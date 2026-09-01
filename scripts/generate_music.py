"""Gera uma trilha ambiente original e livre de dependências externas."""

from pathlib import Path
import sys
import wave

import numpy as np


SAMPLE_RATE = 44_100
DURATION = 40.0


def midi(note: int) -> float:
    return 440.0 * (2.0 ** ((note - 69) / 12.0))


def envelope(length: int, attack: float, release: float) -> np.ndarray:
    curve = np.ones(length, dtype=np.float64)
    attack_size = min(length, int(attack * SAMPLE_RATE))
    release_size = min(length, int(release * SAMPLE_RATE))
    if attack_size:
        curve[:attack_size] = np.linspace(0.0, 1.0, attack_size) ** 1.7
    if release_size:
        curve[-release_size:] *= np.linspace(1.0, 0.0, release_size) ** 1.35
    return curve


def add_tone(track: np.ndarray, note: int, start: float, duration: float, volume: float, pan: float, bell: bool = False) -> None:
    start_sample = int(start * SAMPLE_RATE)
    size = min(int(duration * SAMPLE_RATE), len(track) - start_sample)
    if size <= 0:
        return

    time = np.arange(size, dtype=np.float64) / SAMPLE_RATE
    frequency = midi(note)
    if bell:
        signal = (
            np.sin(2 * np.pi * frequency * time)
            + 0.34 * np.sin(2 * np.pi * frequency * 2.01 * time)
            + 0.13 * np.sin(2 * np.pi * frequency * 3.98 * time)
        )
        signal *= np.exp(-2.6 * time / max(duration, 0.1))
        shape = envelope(size, 0.018, min(1.8, duration * 0.7))
    else:
        signal = (
            np.sin(2 * np.pi * frequency * time)
            + 0.22 * np.sin(2 * np.pi * frequency * 2 * time)
            + 0.07 * np.sin(2 * np.pi * frequency * 3 * time)
        )
        shape = envelope(size, 1.15, min(2.2, duration * 0.5))

    signal *= shape * volume
    left_gain = np.sqrt((1.0 - pan) / 2.0)
    right_gain = np.sqrt((1.0 + pan) / 2.0)
    track[start_sample:start_sample + size, 0] += signal * left_gain
    track[start_sample:start_sample + size, 1] += signal * right_gain


def main(output: str) -> None:
    track = np.zeros((int(DURATION * SAMPLE_RATE), 2), dtype=np.float64)
    # Progressão original: Cmaj7 · Am7 · Fmaj7 · Gsus4, duas passagens.
    chords = [
        (48, [60, 64, 67, 71]),
        (45, [57, 60, 64, 67]),
        (41, [53, 57, 60, 64]),
        (43, [55, 60, 62, 67]),
        (48, [60, 64, 67, 71]),
        (45, [57, 60, 64, 69]),
        (41, [53, 57, 60, 64]),
        (43, [55, 59, 62, 67]),
    ]

    for index, (bass, notes) in enumerate(chords):
        start = index * 5.0
        add_tone(track, bass, start, 5.3, 0.068, -0.08)
        for offset, note in enumerate(notes):
            add_tone(track, note, start + 0.12 * offset, 5.0, 0.041, -0.45 + offset * 0.3)
        pattern = [notes[0] + 12, notes[2] + 12, notes[1] + 12, notes[3] + 12, notes[2] + 12]
        for step, note in enumerate(pattern):
            add_tone(track, note, start + 0.35 + step * 0.82, 2.1, 0.105, (-0.55 + step * 0.27), bell=True)

    # Ecos discretos criam uma ambiência semelhante a uma sala ampla.
    dry = track.copy()
    for delay, gain in [(0.19, 0.22), (0.37, 0.15), (0.71, 0.085), (1.08, 0.045)]:
        shift = int(delay * SAMPLE_RATE)
        track[shift:] += dry[:-shift] * gain

    fade = np.ones(len(track))
    fade[:int(1.1 * SAMPLE_RATE)] = np.linspace(0, 1, int(1.1 * SAMPLE_RATE))
    fade[-int(3.2 * SAMPLE_RATE):] = np.linspace(1, 0, int(3.2 * SAMPLE_RATE))
    track *= fade[:, None]
    track /= max(1.0, np.max(np.abs(track)) / 0.82)

    pcm = (track * 32767).astype(np.int16)
    target = Path(output)
    target.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(target), 'wb') as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(SAMPLE_RATE)
        wav.writeframes(pcm.tobytes())


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'musica-instrumental.wav')

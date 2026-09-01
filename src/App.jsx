import {
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  Camera,
  Check,
  ChevronDown,
  Clock3,
  Gift,
  Heart,
  MapPin,
  MessageCircle,
  Quote,
  Smartphone,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { wedding } from './config'

const pad = (value) => String(Math.max(0, value)).padStart(2, '0')

const calendarDate = (value) => new Date(value)
  .toISOString()
  .replace(/[-:]/g, '')
  .replace(/\.\d{3}Z$/, 'Z')

const escapeCalendarText = (value) => value
  .replace(/\\/g, '\\\\')
  .replace(/,/g, '\\,')
  .replace(/;/g, '\\;')
  .replace(/\n/g, '\\n')

function buildCalendarLinks() {
  const title = `Casamento de ${wedding.bride} e ${wedding.groom}`
  const description = `Você é nosso convidado especial! Cerimônia e recepção no ${wedding.venue}.`
  const dates = `${calendarDate(wedding.date)}/${calendarDate(wedding.endDate)}`
  const googleParams = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates,
    details: description,
    location: `${wedding.venue} — ${wedding.address}`,
  })
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'PRODID:-//Convite Júllia e Mikhael//PT-BR',
    'BEGIN:VEVENT',
    `UID:casamento-${wedding.bride.toLowerCase()}-${wedding.groom.toLowerCase()}@convite`,
    `DTSTAMP:${calendarDate(new Date())}`,
    `DTSTART:${calendarDate(wedding.date)}`,
    `DTEND:${calendarDate(wedding.endDate)}`,
    `SUMMARY:${escapeCalendarText(title)}`,
    `DESCRIPTION:${escapeCalendarText(description)}`,
    `LOCATION:${escapeCalendarText(`${wedding.venue} — ${wedding.address}`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  return {
    google: `https://calendar.google.com/calendar/render?${googleParams.toString()}`,
    apple: `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`,
  }
}

function useCountdown(date) {
  const calculate = () => {
    const distance = Math.max(0, new Date(date).getTime() - Date.now())
    return {
      dias: Math.floor(distance / 86400000),
      horas: Math.floor((distance / 3600000) % 24),
      minutos: Math.floor((distance / 60000) % 60),
      segundos: Math.floor((distance / 1000) % 60),
    }
  }

  const [time, setTime] = useState(calculate)

  useEffect(() => {
    const id = window.setInterval(() => setTime(calculate()), 1000)
    return () => window.clearInterval(id)
  }, [date])

  return time
}

function Botanicals({ className = '' }) {
  return (
    <svg className={`botanicals ${className}`} viewBox="0 0 200 340" aria-hidden="true">
      <path d="M38 330C55 234 86 138 164 20" />
      <path d="M62 250c-40-2-50-24-51-42 31-1 51 11 51 42Z" />
      <path d="M87 190c-36-9-41-32-38-49 29 5 46 22 38 49Z" />
      <path d="M115 132c-31-15-31-39-24-54 26 11 37 31 24 54Z" />
      <path d="M69 230c37-2 52-23 56-41-29-2-50 9-56 41Z" />
      <path d="M98 168c35-7 46-29 46-46-29 3-47 19-46 46Z" />
      <path d="M130 108c30-12 36-34 32-50-25 8-40 25-32 50Z" />
    </svg>
  )
}

function OpeningExperience({ onEnter }) {
  const [opening, setOpening] = useState(false)
  const [ready, setReady] = useState(false)

  const openEnvelope = () => {
    if (opening) return
    setOpening(true)
    window.setTimeout(() => setReady(true), 1100)
  }

  return (
    <main className={`opening ${opening ? 'is-opening' : ''} ${ready ? 'is-ready' : ''}`}>
      <div className="opening-grain" />
      <Botanicals className="opening-branch branch-left" />
      <Botanicals className="opening-branch branch-right" />

      <div className="opening-copy">
        <span className="opening-kicker">UMA HISTÓRIA DE AMOR VAI GANHAR UM NOVO CAPÍTULO</span>
        <h1>{wedding.bride} <em>&</em> {wedding.groom}</h1>
        <p>{opening ? 'Nosso convite está se revelando…' : 'Preparamos algo especial para você'}</p>
      </div>

      <div className="envelope-stage">
        <button className="envelope" onClick={ready ? onEnter : openEnvelope} aria-label={ready ? 'Entrar no convite' : 'Abrir o envelope'}>
          <span className="envelope-back" />
          <span className="invitation-card">
            <span className="card-border" />
            <small>O CASAMENTO DE</small>
            <strong>{wedding.bride}<i>&</i>{wedding.groom}</strong>
            <span className="card-date">{wedding.shortDate}</span>
            <span className="card-enter">ENTRAR NO CONVITE <ArrowRight size={15} /></span>
          </span>
          <span className="envelope-flap" />
          <span className="envelope-pocket" />
          <span className="wax-seal"><span>{wedding.initials.replace(' · ', '')}</span></span>
        </button>
      </div>

      <button className={`opening-action ${ready ? 'ready' : ''}`} onClick={ready ? onEnter : openEnvelope}>
        {ready ? 'CONTINUAR' : 'TOQUE PARA ABRIR'} <ArrowRight size={15} />
      </button>
      <span className="opening-footnote">Feito com amor, especialmente para você</span>
    </main>
  )
}

function Lightbox({ photo, onClose }) {
  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  if (!photo) return null

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Foto ampliada" onClick={onClose}>
      <button onClick={onClose} aria-label="Fechar foto"><X /></button>
      <img src={photo.src} alt={photo.alt} onClick={(event) => event.stopPropagation()} />
      <p>{photo.alt}</p>
    </div>
  )
}

function Invitation({ musicPlaying, onToggleMusic }) {
  const countdown = useCountdown(wedding.date)
  const [guestName, setGuestName] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const calendarLinks = buildCalendarLinks()

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.14 },
    )
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  const confirmPresence = (event) => {
    event.preventDefault()
    const guest = guestName.trim()
    const text = encodeURIComponent(`Olá, ${wedding.bride} e ${wedding.groom}! Eu, ${guest}, confirmo minha presença no casamento. Será uma alegria celebrar com vocês! 🤍`)
    setConfirmed(true)
    window.setTimeout(() => window.open(`https://wa.me/${wedding.whatsapp}?text=${text}`, '_blank', 'noopener,noreferrer'), 450)
  }

  return (
    <main className="invitation-page">
      <button className={`music-control ${musicPlaying ? 'is-playing' : ''}`} onClick={onToggleMusic} aria-label={musicPlaying ? 'Pausar música' : 'Reproduzir música'}>
        <span className="music-icon">{musicPlaying ? <Volume2 /> : <VolumeX />}</span>
        <span className="music-label"><small>NOSSA TRILHA</small>{musicPlaying ? 'Tocando agora' : 'Ativar música'}</span>
        <i className="sound-wave"><b /><b /><b /></i>
      </button>

      <section className="hero" style={{ '--hero-image': `url(${wedding.heroImage})` }}>
        <div className="hero-shade" />
        <div className="hero-content">
          <span className="hero-kicker">COM A BÊNÇÃO DE DEUS E DE NOSSAS FAMÍLIAS</span>
          <span className="hero-monogram">{wedding.initials}</span>
          <h1><span>{wedding.bride}</span><i>&</i><span>{wedding.groom}</span></h1>
          <div className="hero-divider"><span /><Heart size={13} fill="currentColor" /><span /></div>
          <p>{wedding.dateLabel}</p>
          <small>{wedding.venue} · {wedding.timeLabel}</small>
        </div>
        <a className="hero-scroll" href="#nossa-historia"><span>DESCUBRA NOSSA HISTÓRIA</span><ChevronDown /></a>
      </section>

      <section className="intro-section" id="nossa-historia">
        <div className="intro-copy reveal">
          <span className="section-number">01</span>
          <p className="script">O nosso para sempre</p>
          <h2>Há encontros que<br />mudam tudo.</h2>
          <div className="fine-line" />
          <p className="body-copy">{wedding.story}</p>
          <span className="signature">J & M</span>
        </div>
        <div className="intro-photo reveal">
          <img src="/images/casal-olival.webp" alt="Júllia e Mikhael caminhando juntos" />
          <span className="photo-caption">O começo do nosso para sempre</span>
        </div>
      </section>

      <section className="count-section">
        <div className="count-inner reveal">
          <span className="eyebrow-light">ATÉ O NOSSO GRANDE DIA</span>
          <h2>Contando cada instante</h2>
          <div className="countdown">
            {Object.entries(countdown).map(([label, value]) => (
              <div className="count-item" key={label}>
                <strong>{label === 'dias' ? value : pad(value)}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="details-section">
        <header className="section-heading reveal">
          <span className="section-number">02</span>
          <p className="script">Reserve esta data</p>
          <h2>Onde celebraremos</h2>
        </header>
        <div className="details-layout reveal">
          <div className="date-block">
            <span>MAIO</span>
            <strong>22</strong>
            <small>2027 · SÁBADO</small>
          </div>
          <div className="venue-block">
            <span className="round-icon"><MapPin /></span>
            <h3>{wedding.venue}</h3>
            <p>{wedding.address}</p>
            <div className="venue-meta">
              <span><CalendarDays /> {wedding.dateLabel}</span>
              <span><Clock3 /> A partir das {wedding.timeLabel}</span>
            </div>
            <a className="premium-button dark" href={wedding.mapsUrl} target="_blank" rel="noreferrer">
              COMO CHEGAR <ArrowRight size={14} />
            </a>
          </div>
        </div>
        <div className="schedule reveal">
          {wedding.schedule.map((item, index) => (
            <div className="schedule-item" key={item.title}>
              <span className="schedule-index">0{index + 1}</span>
              <time>{item.time}</time>
              <div><h3>{item.title}</h3><p>{item.text}</p></div>
            </div>
          ))}
        </div>
        <div className="calendar-card reveal">
          <span className="calendar-art"><CalendarPlus /></span>
          <div className="calendar-copy">
            <small>NÃO DEIXE ESTE DIA PASSAR</small>
            <h3>Adicione à sua agenda</h3>
            <p>Salve a data, o horário e o endereço com apenas um toque.</p>
          </div>
          <div className="calendar-buttons">
            <a className="calendar-button google" href={calendarLinks.google} target="_blank" rel="noreferrer">
              <CalendarDays /> GOOGLE AGENDA
            </a>
            <a className="calendar-button apple" href={calendarLinks.apple} download={`casamento-${wedding.bride.toLowerCase()}-${wedding.groom.toLowerCase()}.ics`}>
              <Smartphone /> APPLE / IOS
            </a>
          </div>
        </div>
      </section>

      <section className="gallery-section">
        <header className="section-heading reveal">
          <span className="section-number">03</span>
          <p className="script">Memórias que guardamos</p>
          <h2>Nossa galeria</h2>
          <p className="heading-note">Um pouco da história que nos trouxe até aqui.</p>
        </header>
        <div className="gallery-grid reveal">
          {wedding.gallery.map((photo, index) => (
            <button className={`gallery-photo ${photo.className}`} key={`${photo.src}-${index}`} onClick={() => setSelectedPhoto(photo)}>
              <img src={photo.src} alt={photo.alt} loading="lazy" />
              <span><Camera size={17} /> VER FOTO</span>
            </button>
          ))}
        </div>
      </section>

      <section className="verse-section">
        <div className="verse-card reveal">
          <Quote />
          <blockquote>“{wedding.verse}”</blockquote>
          <span>{wedding.verseRef}</span>
        </div>
      </section>

      <section className="rsvp-section">
        <div className="rsvp-copy reveal">
          <span className="section-number">04</span>
          <p className="script">Você faz parte desta história</p>
          <h2>Esperamos por você</h2>
          <p>Confirme sua presença até <strong>{wedding.rsvpDeadline}</strong>. Será uma alegria viver esse dia ao seu lado.</p>
        </div>
        <form className="rsvp-form reveal" onSubmit={confirmPresence}>
          <label htmlFor="guest">NOME COMPLETO</label>
          <input id="guest" value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder="Como devemos chamar você?" required />
          <button className={`premium-button submit ${confirmed ? 'confirmed' : ''}`} type="submit">
            {confirmed ? <><Check size={17} /> PRESENÇA CONFIRMADA</> : <><MessageCircle size={17} /> CONFIRMAR PELO WHATSAPP</>}
          </button>
          <small>Ao confirmar, abriremos uma mensagem pronta no WhatsApp.</small>
        </form>
      </section>

      <section className="gift-section">
        <div className="gift-card reveal">
          <span className="round-icon light"><Gift /></span>
          <p className="script">Um gesto de carinho</p>
          <h2>Lista de presentes</h2>
          <p>Sua presença é o nosso maior presente. Mas, se desejar fazer parte do início do nosso lar, preparamos uma lista especial.</p>
          <a className="premium-button ivory" href={wedding.giftUrl} target="_blank" rel="noreferrer">CONHECER A LISTA <ArrowRight size={14} /></a>
        </div>
      </section>

      <footer>
        <Botanicals className="footer-branch left" />
        <Botanicals className="footer-branch right" />
        <span>COM AMOR,</span>
        <h2>{wedding.bride} <i>&</i> {wedding.groom}</h2>
        <p>{wedding.shortDate}</p>
      </footer>

      <Lightbox photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </main>
  )
}

function App() {
  const [entered, setEntered] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const transitionTimer = useRef(null)
  const audioRef = useRef(null)

  useEffect(() => {
    document.body.classList.toggle('scroll-locked', !entered)
    return () => document.body.classList.remove('scroll-locked')
  }, [entered])

  const enterInvitation = () => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = 0.34
      const playback = audio.play()
      if (playback) {
        playback.then(() => setMusicPlaying(true)).catch(() => setMusicPlaying(false))
      }
    }
    setTransitioning(true)
    transitionTimer.current = window.setTimeout(() => {
      setEntered(true)
      window.scrollTo(0, 0)
    }, 350)
  }

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().then(() => setMusicPlaying(true)).catch(() => setMusicPlaying(false))
    } else {
      audio.pause()
      setMusicPlaying(false)
    }
  }

  useEffect(() => () => window.clearTimeout(transitionTimer.current), [])

  return (
    <>
      <audio ref={audioRef} src={wedding.music} loop preload="auto" />
      {!entered ? <OpeningExperience onEnter={enterInvitation} /> : <Invitation musicPlaying={musicPlaying} onToggleMusic={toggleMusic} />}
      <div className={`page-transition ${transitioning && !entered ? 'active' : ''}`} />
    </>
  )
}

export default App

# Convite de casamento premium — Isabella & Gabriel

Versão React/Vite com experiência cinematográfica de abertura, música instrumental, galeria, contagem regressiva, localização, calendário, roteiro do evento, confirmação via WhatsApp e lista de presentes.

## Executar localmente

Requer Node.js 18 ou superior.

```bash
npm install
npm run dev
```

Abra o endereço exibido no terminal, normalmente `http://localhost:5173`.

## Personalizar

Todos os textos, nomes, data, endereço, telefone e links ficam em:

```text
src/config.js
```

Substitua as imagens da pasta `public/images` e mantenha os mesmos nomes, ou altere os caminhos no `config.js`.

### Música

A trilha fica em:

```text
public/audio/musica-instrumental.mp3
```

Para usar a música oficial do casal, substitua esse arquivo por outro `.mp3` mantendo o mesmo nome. O visitante inicia a música ao entrar no convite e pode pausar ou reativar pelo controle flutuante.

### Google Agenda e Apple/iOS

Os botões de calendário são preenchidos automaticamente usando `date`, `endDate`, `venue` e `address` do arquivo `src/config.js`. O botão Apple/iOS gera um evento `.ics` compatível também com Outlook e outros aplicativos de calendário.

## Publicar

Para gerar a versão de produção:

```bash
npm run build
```

A pasta `dist` resultante pode ser publicada na Vercel, Netlify, Firebase Hosting ou em qualquer hospedagem de arquivos estáticos.

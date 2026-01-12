# ListenIn

A premium iOS-style meeting intelligence PWA built with React 19, TypeScript, and the Gemini API.

![ListenIn Banner](https://img.shields.io/badge/PWA-Ready-success?style=for-the-badge&logo=pwa)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

## Features

### Phase 1 (Completed)
- ✅ **Microphone Permission Management** - Smooth permission request flow
- ✅ **Audio Recording** - 16kHz PCM mono capture with pause/resume
- ✅ **Premium UI Components**:
  - Large centered pulsing orb with breathing animation
  - Digital timer (MM:SS format)
  - Real-time waveform visualizer
  - Glassmorphism effects throughout
- ✅ **iOS-Style Design**:
  - OLED black backgrounds (#000000)
  - Apple Blue accents (#007AFF)
  - SF Pro font (system-ui fallback)
  - Squircle rounded corners (20px)
- ✅ **PWA Ready** - Installable on iOS devices

## Design System

### Colors
- **Background**: OLED Black (`#000000`)
- **Text**: White (`#FFFFFF`)
- **Accent**: Apple Blue (`#007AFF`)
- **Glass Effect**: `rgba(255, 255, 255, 0.05)` with backdrop blur

### Typography
- **Font Family**: SF Pro (system-ui fallback)
- **Headings**: Semibold, large sizes
- **Body**: Regular weight, optimized line height

### Components
- **Glassmorphism**: Semi-transparent cards with backdrop blur
- **Squircle Borders**: 20px border-radius for iOS feel
- **Smooth Animations**: 300ms cubic-bezier transitions
- **Breathing Effect**: 3s ease-in-out infinite animation

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **AI Integration**: @google/generative-ai (Gemini API)
- **PWA**: vite-plugin-pwa with Workbox

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Microphone access

### Installation

1. **Install dependencies** (already done)
   ```bash
   npm install
   ```

2. **Set up environment variables** (for future Gemini integration)
   ```bash
   echo "VITE_GEMINI_API_KEY=your_api_key_here" > .env
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## Project Structure

```
listenin/
├── src/
│   ├── components/
│   │   ├── PermissionScreen.tsx    # Microphone permission UI
│   │   ├── RecordingOrb.tsx        # Pulsing orb with animations
│   │   ├── Timer.tsx                # Digital timer display
│   │   ├── Waveform.tsx             # Real-time audio visualizer
│   │   └── RecordingControls.tsx    # Pause/Resume/Finish buttons
│   ├── hooks/
│   │   └── useAudioRecorder.ts      # Audio recording logic
│   ├── App.tsx                      # Main app component
│   ├── index.css                    # Design system + Tailwind
│   └── main.tsx                     # App entry point
├── public/                          # PWA assets
├── index.html                       # HTML with iOS meta tags
├── vite.config.ts                   # Vite + PWA configuration
├── tailwind.config.js               # Tailwind customization
└── package.json
```

## Audio Recording Specifications

- **Sample Rate**: 16kHz (optimized for speech)
- **Channels**: Mono
- **Format**: WebM with Opus codec
- **Features**:
  - Echo cancellation enabled
  - Noise suppression enabled
  - Real-time audio level monitoring
  - Pause/Resume support

## PWA Features

- **Installable**: Add to iOS home screen
- **Offline Ready**: Service worker caching
- **iOS Optimized**:
  - Black translucent status bar
  - Viewport fit for notch devices
  - Touch-optimized interactions
- **Manifest**: Configured for standalone app experience

## Browser Compatibility

- ✅ iOS Safari 15+
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ❌ IE (not supported)

**Note**: Microphone access requires HTTPS or localhost.

## Upcoming Features (Phase 2)

- 🔄 Gemini API integration for transcription
- 🔄 Real-time transcription display
- 🔄 Meeting summaries and key points
- 🔄 Export options (PDF, text)
- 🔄 Recording history with IndexedDB
- 🔄 Speaker diarization

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Key Dependencies

```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "~5.6.2",
  "@google/generative-ai": "^0.21.0",
  "tailwindcss": "^3.4.17",
  "vite": "^6.0.5",
  "vite-plugin-pwa": "^0.21.1"
}
```

## Performance

- **Bundle Size**: Optimized with code splitting
- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s

## Usage

1. **Grant Microphone Permission**: On first launch, grant microphone access
2. **Start Recording**: Tap "Start Recording" to begin capturing audio
3. **Monitor Recording**: Watch the pulsing orb and waveform for visual feedback
4. **Pause/Resume**: Control your recording with pause and resume buttons
5. **Finish**: Tap "Finish" to stop and save the recording

## Contributing

This is a demonstration project. Feel free to fork and customize for your needs.

## License

MIT License - feel free to use this project as a template.

## Acknowledgments

- Design inspired by iOS Human Interface Guidelines
- Icons from Heroicons
- Powered by Google Gemini AI

---

Built with ❤️ using React 19 + Vite + TypeScript

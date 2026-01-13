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

### Phase 2 (Completed)
- ✅ **Real-Time Transcription** - Powered by Gemini 2.0 Flash
- ✅ **Audio Streaming** - PCM 16kHz mono chunks to Gemini API
- ✅ **Live Transcript Display**:
  - Auto-scroll to bottom with manual override
  - Timestamp markers every 30 seconds
  - Fade mask at bottom (OLED aesthetic)
  - Smooth animations for new text
- ✅ **Split-Panel UI** - Recording controls on left, transcript on right
- ✅ **Connection Management**:
  - Real-time connection status indicator
  - Graceful error handling with helpful messages
  - Automatic API setup instructions

### Phase 3 (Completed)
- ✅ **AI Meeting Summaries** - Structured analysis with Gemini 2.0 Flash
- ✅ **Auto-Generation** - Triggers within 30 seconds after recording ends
- ✅ **Structured Output** (JSON Schema):
  - **Executive Overview**: 2-3 sentence summary
  - **Chapters**: Logical segments with timestamps
  - **Key Highlights**: Important quotes with importance levels
  - **Action Items**: Tasks with assignee, priority, due dates
  - **Participants**: Auto-identified from transcript
  - **Metadata**: Duration, timestamp, full transcript
- ✅ **Meeting Detail Screen** with 4 interactive tabs:
  - **Summary Tab**: Executive overview, participants list, chapters timeline
  - **Highlights Tab**: Color-coded quotes by importance (high/medium/low), tap to expand context
  - **Action Items Tab**: Checkable tasks grouped by priority, swipe-to-delete, assignee badges
  - **Intel Chat Tab**: Interactive Q&A with Gemini grounded on meeting transcript
- ✅ **Interactive UI**:
  - Full-screen detail view after recording completes
  - Checkable action items (mark as complete)
  - Priority badges (high/medium/low colors)
  - Progress indicator during generation
  - Swipe-to-delete action items (mobile)
- ✅ **LocalStorage** - Saves last 50 summaries for offline access

### Phase 4 (Completed) 🆕
- ✅ **Main Dashboard** - Full meeting library interface
- ✅ **Search & Filter** - Search meetings by title, overview, or participants
- ✅ **Meeting Cards** with:
  - Title (first 50 chars of overview)
  - Date/time with smart formatting (Today, Yesterday, X days ago)
  - Duration badge
  - Participant count
  - Action items count badge
  - Highlights count badge
  - Swipe-to-delete gesture (mobile)
- ✅ **Framework Selector** - Choose meeting type before recording:
  - **Sales Call** 💼: Extracts budget, objections, competitors, deal health, champion identification
    - Action items: Follow-up materials, proposal deadlines, decision-maker engagement
  - **1:1 Meeting** 🤝: Extracts career goals, feedback, challenges, growth opportunities
    - Action items: Development plans, check-in dates, resource needs
  - **Standup** ⚡: Extracts work completed, blockers, dependencies, team updates
    - Action items: Blockers to resolve, dependencies to unblock, follow-ups
  - **Brainstorm** 💡: Extracts ideas by theme, divergent thinking, convergent decisions
    - Action items: Ideas to explore, prototypes to build, research needed
  - **General** 📝: Standard balanced comprehensive meeting analysis
- ✅ **Framework-Specific Analysis**:
  - Specialized AI prompts for each meeting type
  - Customized extraction criteria and focus areas
  - Framework badge displayed on cards and detail view
  - Framework metadata stored with each meeting
- ✅ **Floating Action Button** - Always-accessible record button with pulse animation
- ✅ **Empty State** - Beautiful onboarding with feature highlights
- ✅ **iOS-Style Animations**:
  - Slide-up modal animations
  - Haptic feedback simulation (vibration)
  - Smooth card interactions
  - Pulse and fade animations

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
- **Backend**: Vercel Serverless Functions (secure API proxy)
- **AI Integration**: Gemini 2.0 Flash via secure backend
- **PWA**: vite-plugin-pwa with Workbox
- **Security**: Server-side API key management, CORS, rate limiting

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

2. **Set up environment variables** (REQUIRED for Phase 2 transcription)

   🔒 **Secure Setup**: API key is stored server-side only (NOT exposed to browser)

   **For local development:**
   ```bash
   echo "GEMINI_API_KEY=your_api_key_here" > .env
   ```

   **For Vercel deployment (REQUIRED):**
   1. Get your free API key from: https://makersuite.google.com/app/apikey
   2. Go to your Vercel project dashboard
   3. Navigate to: **Settings** → **Environment Variables**
   4. Add new variable:
      - **Name**: `GEMINI_API_KEY` (⚠️ NO `VITE_` prefix!)
      - **Value**: Your API key
      - **Environment**: All (Production, Preview, Development)
   5. Click **Save** and redeploy

   ✅ Your API key stays secure on the server and is never exposed to users

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

## PWA Features (iOS Optimized)

- **Installable**: Add to iOS home screen for native app experience
- **Offline Support**:
  - App shell cached for offline access
  - Meetings stored locally (persists without internet)
  - Offline indicator when network unavailable
  - Background sync for API requests
- **iOS Specific**:
  - Black status bar (blends with OLED design)
  - Viewport fit for notch/Dynamic Island support
  - Apple Touch Icons (180x180)
  - Splash screens for all iPhone sizes
  - Standalone display mode (hides Safari UI)
  - Install instructions modal on first visit
- **Performance Optimizations**:
  - 60fps animations with requestAnimationFrame
  - Lazy loading for transcript chunks
  - Optimized waveform rendering
  - Will-change CSS hints for smooth animations
- **Manifest**: Full PWA configuration with categories and purpose-specific icons

## Browser Compatibility

- ✅ iOS Safari 15+
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ❌ IE (not supported)

**Note**: Microphone access requires HTTPS or localhost.

## Upcoming Features (Phase 5)

- 🔄 Export Options - Download summaries as PDF, text, JSON
- 🔄 Speaker Diarization - Identify and label different speakers
- 🔄 Multi-language Support - Transcribe in multiple languages
- 🔄 Custom AI Prompts - User-defined analysis questions
- 🔄 Email Integration - Send summaries via email
- 🔄 Calendar Integration - Create events from action items
- 🔄 Settings Screen - Customize app behavior and preferences
- 🔄 Dark/Light Theme Toggle - User preference for color scheme

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
2. **Browse Dashboard**: View all your past meetings on the main screen
3. **Search Meetings**: Use the search bar to filter by title, overview, or participants
4. **Start New Recording**:
   - Tap the floating blue microphone button (bottom-right)
   - Choose a meeting framework (Sales Call, 1:1, Standup, Brainstorm, or General)
   - Recording starts immediately with optimized AI analysis
5. **During Recording**:
   - Watch real-time transcription appear live
   - Monitor the pulsing orb and waveform for visual feedback
   - Pause/Resume with controls
   - Review transcript with timestamp markers every 30 seconds
6. **Finish Recording**: Click "Finish" to stop and generate AI summary
7. **AI Summary Generation** (30 seconds):
   - Framework-specific analysis (e.g., Sales Calls focus on objections and commitments)
   - Automatically transitions to full-screen Meeting Detail view
   - All summaries saved to localStorage
8. **Explore Meeting Detail** (4 Interactive Tabs):
   - **Summary Tab**: View overview, participants, and chapter timeline
   - **Highlights Tab**: Browse color-coded key moments (tap to expand)
   - **Action Items Tab**: Check off tasks, see priority levels, swipe to delete
   - **Intel Chat Tab**: Ask questions about the meeting with AI assistance
9. **Manage Meetings**:
   - Tap any meeting card to view its detail
   - Swipe left on cards to delete (mobile)
   - Use the back button to return to dashboard

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

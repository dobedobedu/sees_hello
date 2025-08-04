# Had Me At Hello - AI-Powered School Tour Booking System

An intelligent tour booking assistant for Saint Stephen's Episcopal School that transforms the traditional school tour inquiry process into an engaging, personalized experience using AI-powered matching with student success stories.

## Features

- **6-Step Interactive Quiz**: Personalized questions about grade level, interests, values, and timeline
- **Voice or Text Input**: Parents can describe their child using voice recording or text
- **AI-Powered Matching**: Uses LMStudio (local LLM) to match families with relevant student stories and faculty
- **Personalized Results**: Shows match percentage, student success stories, and faculty mentors
- **Beautiful UI**: Modern, responsive design with smooth animations using Framer Motion
- **Privacy-First**: Can run entirely locally with LMStudio for complete data privacy

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **AI Models**: 
  - LMStudio (local inference) - Primary
  - OpenAI GPT-4 (optional fallback)
  - Groq Whisper (future audio transcription)
- **Knowledge Base**: JSON-based student stories, faculty profiles, and school facts

## Getting Started

### Prerequisites

1. **LMStudio** (for local AI inference)
   - Download from [lmstudio.ai](https://lmstudio.ai)
   - Load a model like Gemma 2 or Llama 3
   - Start the local server (default: http://localhost:1234)

2. **Node.js** (v18 or higher)

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd had-me-at-hello

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
had-me-at-hello/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Landing page
│   ├── quiz/              # Quiz flow pages
│   └── results/           # Results display
├── components/            # React components
│   └── quiz/             # Quiz-specific components
├── lib/                   # Utilities and services
│   └── ai/               # AI integration layer
├── knowledge/             # Knowledge base
│   ├── stories.json      # Student success stories
│   ├── faculty.json      # Faculty profiles
│   └── facts.json        # School facts
└── public/               # Static assets
```

## How It Works

1. **Parents start the quiz** from the landing page
2. **Answer 6 questions** about their child and family
3. **Describe their child** using voice or text (60 seconds max for voice)
4. **AI analyzes responses** and matches with student stories using RAG
5. **Personalized results** show matched stories, faculty, and a custom message
6. **Book a tour** with pre-filled information

## AI Model Configuration

The system is designed to work with multiple AI providers:

- **LMStudio** (default): Free, local, private
- **OpenAI**: High quality but requires API key
- **Groq**: Fast inference for audio transcription

Configure in `.env.local`:
```env
LMSTUDIO_BASE_URL=http://localhost:1234/v1
# Optional:
OPENAI_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
```

## Development Notes

- Quiz progress is saved in sessionStorage
- Voice recording uses Web Speech API (Chrome/Edge recommended)
- Fallback responses provided if AI is unavailable
- Mobile-first responsive design
- Accessibility features included

## Future Enhancements

- Email automation for tour confirmations
- Admin dashboard for content management
- A/B testing framework
- Advanced analytics tracking
- Calendar integration for tour scheduling
- Multi-language support

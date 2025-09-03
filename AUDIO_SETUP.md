# Audio Transcription Setup

This app supports voice input for the child description question using OpenAI's Whisper API.

## Quick Setup

1. **Get an OpenAI API Key**
   - Go to https://platform.openai.com/api-keys
   - Create a new API key
   - Copy the key

2. **Set up your environment**
   - Copy `.env.local.example` to `.env.local`
   - Add your OpenAI API key:
   ```
   NEXT_PUBLIC_OPENAI_API_KEY=your_actual_api_key_here
   ```

3. **Test it out**
   - Go to the quiz and reach the "Tell us about your child" question
   - Click the "Voice" button
   - Click the microphone to start recording
   - Speak for up to 60 seconds
   - Click the microphone again to stop and transcribe

## How it works

- Records audio using your browser's MediaRecorder API
- Sends audio to OpenAI's Whisper API for transcription
- Displays the transcribed text which you can edit before submitting

## Troubleshooting

- **Microphone access denied**: Check your browser permissions
- **API key not working**: Make sure you've added the `NEXT_PUBLIC_` prefix
- **Transcription fails**: Check your OpenAI account has credits

## Cost

- OpenAI Whisper costs ~$0.006 per minute of audio
- Each recording is max 60 seconds, so ~$0.006 per transcription
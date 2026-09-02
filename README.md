# MockMate AI

> **Practice the interview, not just the answer.**

MockMate AI is an adaptive AI-avatar interview practice application for Product Management candidates. It simulates an interviewer, adapts follow-up questions to the candidate's answers, and provides a structured post-interview debrief.

## Features

- **AI interviewer avatar** with clear AI disclosure
- **Voice and text interaction** with read-aloud support
- **Adaptive follow-up questions** based on the candidate's latest answer and interview history
- **Resume-aware interviews** using uploaded PDF or DOCX resumes
- **Question-history handling** designed to reduce repetitive questions and rotate interview dimensions
- **10-minute interview loop** with a target of up to six questions
- **Structured debrief** across six PM competencies:
  - Problem framing
  - User insight
  - Analytical thinking
  - Metrics
  - Prioritization
  - Communication
- **Session history and progress tracking**
- **Transcript export**
- **Analytics event tracking and CSV export**
- **Next-practice recommendations**
- **Deterministic fallback mode** when live AI is unavailable

## How It Works

```text
Practice Setup
      ↓
Optional Resume Grounding
      ↓
AI-Avatar Interview
      ↓
Answer → Adaptive Follow-up
      ↓
Interview Debrief
      ↓
Next Practice
```

The application supports a live AI mode and a local fallback mode. In live mode, the server sends interview-generation and feedback requests to the configured OpenAI model. If live AI is unavailable, the local interview engine keeps the core experience functional.

## Resume Handling

Resume uploads support PDF and DOCX files with a 5 MB size limit. The server extracts the resume text for the current request and removes the temporary uploaded file after processing, including during error handling.

Resume content is used as interview context for the current session rather than being stored in a persistent resume database.

## Tech Stack

- **Runtime:** Node.js 20+
- **Backend:** Express 5
- **Language:** JavaScript / ES modules
- **AI:** OpenAI API
- **Resume parsing:** `pdf-parse`, `mammoth`
- **File uploads:** `multer`
- **Environment configuration:** `dotenv`
- **Deployment:** Render
- **Testing:** Node.js built-in test runner

## Project Structure

```text
mockmate-ai/
├── public/                  # Frontend UI and static assets
├── src/
│   ├── interview-engine.js  # Adaptive and fallback interview logic
│   └── resume-parser.js     # PDF/DOCX text extraction
├── server.js                # Express server and API routes
├── package.json             # Scripts and dependencies
└── package-lock.json
```

## Getting Started

### Requirements

- Node.js 20 or newer

### Install

```bash
npm install
```

### Run

```bash
npm start
```

Open `http://localhost:3000` in your browser.

### Development mode

```bash
npm run dev
```

## Configuration

Create a `.env` file in the project root when live AI responses are required:

```env
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-5.6-luna
```

If `OPENAI_API_KEY` is not configured, MockMate AI uses its local fallback engine.

**Never commit API keys or other secrets to the repository.**

## Testing

Run the automated tests with:

```bash
npm test
```

## AI Behavior

The live interview flow uses AI for three main tasks:

1. Generate an initial interview question.
2. Generate an adaptive follow-up from the latest answer and interview history.
3. Evaluate the completed transcript and produce structured feedback.

The application instructs the interviewer not to invent resume facts and to avoid repeating previous questions. The fallback interview engine provides a deterministic alternative for development and demonstration.

## Privacy & Safety

- Resume uploads are limited to PDF/DOCX and 5 MB.
- Temporary uploaded files are deleted after extraction.
- The product identifies the interviewer as AI-generated.
- MockMate AI is an interview-practice tool and is not a hiring or employment decision-maker.
- API credentials should be stored in environment variables rather than source code.

## Validation

The application includes a structured feedback form for evaluating interview realism, follow-up relevance, resume personalization, willingness to use the product again, and overall experience.

When reporting product usage or feedback, use real collected data. Do not present illustrative or synthetic data as real user traction.

## Links

- **Live application:** https://mockmate-ai-1-28u3.onrender.com
- **Feedback form:** https://forms.gle/ew9mzbCoonXkGpjN9

## License

No open-source license has been added yet. Unless a license is added, the repository should not be assumed to grant permission to reuse or redistribute the code.

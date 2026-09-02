# MockMate AI

> **Practice the interview, not just the answer.**

MockMate AI is an adaptive AI-avatar interview practice MVP built for Product Management candidates. It is designed around a simple loop: **practice → receive targeted feedback → improve → practice again**.

## 🔗 Product Links

- **Live MVP:** https://mockmate-ai-1-28u3.onrender.com
- **Feedback Form:** https://forms.gle/ew9mzbCoonXkGpjN9

## 🎯 Product Problem

PM candidates can find plenty of interview questions and answer resources, but practice often lacks the pressure and interaction of a real interview. MockMate AI focuses on that gap by simulating an interviewer that can respond to the candidate's answers, ask adaptive follow-ups, and provide an immediate debrief.

## 💡 Product Experience

The MVP follows a focused interview loop:

1. **Choose a practice setup** — role, interview type and difficulty.
2. **Optionally ground the session in a resume** — PDF and DOCX resumes are supported.
3. **Start the AI-avatar interview** — interact through voice or text.
4. **Answer and receive adaptive follow-ups** — questions are generated from the latest answer and interview history.
5. **Complete the interview** — the experience targets a 10-minute, up-to-six-question loop.
6. **Review the debrief** — receive competency scores, strengths, improvements and a recommended next practice.

## ✨ Key Features

- AI interviewer avatar with explicit AI disclosure
- Voice input and text input with read-aloud support
- Adaptive follow-up questioning
- Resume-aware interview mode
- PDF/DOCX resume parsing
- Question-history normalization to reduce repetition
- Deterministic fallback / Demo Mode when live AI is unavailable
- 10-minute interview timer and six-question target loop
- Six PM competency dimensions:
  - Problem framing
  - User insight
  - Analytical thinking
  - Metrics
  - Prioritization
  - Communication
- Session history and progress tracking
- Analytics event tracking and CSV export
- Transcript export
- Next-practice recommendation
- Automated tests

## 🧠 AI Design

MockMate AI supports two interview modes:

### Live AI mode

When `OPENAI_API_KEY` is configured, the server uses the OpenAI Responses API for:

- Initial interview questions
- Adaptive follow-up questions
- Post-interview feedback

The model is configured through `OPENAI_MODEL` and defaults to `gpt-5.6-luna` in the application.

### Demo / fallback mode

If a live AI key is unavailable or an AI request fails, the application uses the local interview engine. This keeps the core interview flow demonstrable without presenting a simulated response as live AI.

The adaptive engine also uses interview history to avoid repeating previously asked questions and rotates across different reasoning dimensions.

## 📄 Resume Privacy

Resume uploads are restricted to PDF and DOCX files with a 5 MB upload limit. Uploaded files are processed server-side for text extraction and the temporary uploaded file is deleted after extraction, including after error handling.

Resume-derived interview content is used as context for the current interview request; the application does not provide a persistent resume database.

## 🛠️ Technology Stack

- **Runtime:** Node.js 20+
- **Server:** Express 5
- **Language:** JavaScript / ES modules
- **AI:** OpenAI API
- **Resume parsing:** `pdf-parse`, `mammoth`
- **File uploads:** `multer`
- **Configuration:** `dotenv`
- **Deployment:** Render
- **Testing:** Node.js built-in test runner

## 📁 Project Structure

```text
mockmate-ai/
├── public/                  # Web application UI and client assets
├── src/
│   ├── interview-engine.js  # Adaptive / deterministic interview logic
│   └── resume-parser.js     # PDF/DOCX resume extraction
├── server.js                # Express server and API routes
├── package.json             # Scripts and dependencies
├── package-lock.json
├── ASSIGNMENT_ALIGNMENT.md  # Mapping to assignment criteria
└── FINAL_SUBMISSION_CHECKLIST.md
```

## 🚀 Run Locally

### Prerequisites

- Node.js 20+

### Install and start

```bash
npm install
npm start
```

Open:

```text
http://localhost:3000
```

### Enable live AI

Create a local `.env` file and configure:

```text
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-5.6-luna
```

Do **not** commit API keys or secrets to GitHub.

Without `OPENAI_API_KEY`, the application runs in its clearly labeled Demo Mode.

## 🧪 Testing

Run the automated test suite with:

```bash
npm test
```

## 📊 Validation Approach

The MVP includes a structured feedback mechanism covering:

- Interview realism
- Follow-up relevance
- Resume personalization
- Willingness to use MockMate AI again
- Overall experience
- Qualitative likes and improvement requests

Real user feedback should be reported as collected. **No synthetic or illustrative data should be represented as real user traction, retention, conversion or testimonials.**

## 🔐 AI Disclosure

MockMate AI clearly communicates that the interviewer is AI-generated and that the product is intended for interview practice rather than hiring decisions.

## 📚 Assignment Materials

The repository also contains supporting product and submission materials, including the assignment-alignment document, final submission checklist, product case study and presentation assets where applicable.

## 👤 Project

Built as an Internship cum PPO Recruitment product assignment with a focus on:

- Sharp problem definition
- Narrow MVP scope
- AI-native product experience
- Fast iteration
- Transparent validation
- Evidence-led product decisions

---

**MockMate AI — Practice the interview, not just the answer.**

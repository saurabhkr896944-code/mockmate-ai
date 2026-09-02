# MockMate AI — Final Product Intern Submission

**Practice interviews like they're real.**

MockMate AI is a focused AI-avatar interview practice MVP for Product Management candidates. The product simulates an interviewer, adapts follow-up questions to the candidate's answer, and produces a structured debrief that recommends what to practice next.

## What is included

- Working web MVP: dashboard → setup → live interview → debrief → progress
- AI interviewer avatar with explicit AI disclosure
- Voice input + text input + read-aloud
- Adaptive follow-up engine with deterministic Demo Mode
- Optional OpenAI Responses API integration
- 10-minute interview timer and six-question target loop
- Six competency dimensions: problem framing, user insight, analytical thinking, metrics, prioritization, communication
- Local session history and progress tracking
- Analytics event tracking and CSV export
- Transcript export
- Product case study, PRD, user research guide, validation plan, experiment backlog and release checklist
- Final 8-slide PM deck
- Illustrative validation package with a synthetic 30-user dataset
- Automated tests

## Evidence integrity

**Important:** the validation folder is explicitly **SIMULATED / ILLUSTRATIVE — NOT REAL USER TRACTION**. It demonstrates the analytics structure, funnel logic and decision framework, but it must not be presented as real users, retention, conversion, testimonials or traction.

Before submitting, run real sessions and replace the synthetic dataset/metrics with real, consented evidence. This keeps the submission aligned with the assignment's requirement for transparent validation.

## Run locally

Requires Node.js 20+.

```bash
npm install
cp .env.example .env
npm start
```

Open `http://localhost:3000`.

### AI mode

Set `OPENAI_API_KEY` in `.env` to enable live AI responses. Without a key, the app runs in clearly labeled Demo Mode using the local adaptive engine.

## Test

```bash
npm test
```

## Suggested single-link submission structure

Use one public Drive/GitHub/Notion landing page as the submission hub. Put these links in the order a recruiter should consume them:

1. **Live product / demo**
2. **Final PM deck** — `submission/MockMate_AI_Final_PM_Deck.pptx`
3. **Product case study** — `MockMate_AI_Product_Case_Study.pdf`
4. **Validation evidence** — replace illustrative assets with real participant evidence
5. **2-minute demo script** — `submission/DEMO_SCRIPT.md`
6. **Source code / technical notes**

## Assignment alignment

See `ASSIGNMENT_ALIGNMENT.md` for a direct mapping to the assignment requirements and evaluation criteria.

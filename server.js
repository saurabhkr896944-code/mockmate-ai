import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import multer from "multer";
import OpenAI from "openai";
import { extractResumeText } from "./src/resume-parser.js";
import { normalizeHistory, getInitialQuestion, getAdaptiveQuestion, getDemoFeedback } from "./src/interview-engine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
const ai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const uploadDir = path.join(__dirname, ".tmp-uploads");
await fs.mkdir(uploadDir, { recursive: true });
const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req,file,cb) => {
    const ok = /\.pdf$/i.test(file.originalname) || /\.docx$/i.test(file.originalname);
    cb(ok ? null : new Error("Only PDF and DOCX resumes are supported."), ok);
  }
});

app.use(express.json({limit:"1mb"}));
app.use(express.static(path.join(__dirname,"public")));

app.get("/api/health", (_req,res) => res.json({ok:true,aiMode:Boolean(ai),model:process.env.OPENAI_MODEL || "gpt-5.6-luna"}));

app.post("/api/resume/parse", upload.single("resume"), async (req,res) => {
  try {
    const text = await extractResumeText(req.file);
    await fs.unlink(req.file.path).catch(()=>{});
    res.json({ok:true,fileName:req.file.originalname,characters:text.length,text});
  } catch (err) {
    if (req.file?.path) await fs.unlink(req.file.path).catch(()=>{});
    const message = err?.message || "Resume parsing failed.";
    res.status(400).json({ok:false,error:message});
  }
});

app.post("/api/interview/start", async (req,res) => {
  const { role="Product Manager Intern", type="Product Sense", difficulty="Intermediate", resumeText="" } = req.body || {};
  if (!ai) return res.json({mode:"demo", resumeAware:Boolean(resumeText), ...getInitialQuestion({role,type,difficulty,resumeText})});
  try {
    const resumeBlock = resumeText ? `\nCandidate resume (use only this as the source for resume-specific claims):\n${String(resumeText).slice(0,18000)}` : "";
    const prompt = `You are the interviewer for a ${role} ${type} interview at ${difficulty} difficulty.
${resumeText ? "This is a RESUME-AWARE interview. Start with one specific, defensible question about something actually present in the candidate resume. Do not invent details." : "Start the interview with ONE concise, realistic question. It must test product judgment, not trivia."}
${resumeBlock}
Return JSON only: {"question":"...","competency":"...","intent":"..."}.`;
    const response = await ai.responses.create({model:process.env.OPENAI_MODEL || "gpt-5.6-luna",input:prompt,text:{format:{type:"json_object"}}});
    res.json({mode:"ai",resumeAware:Boolean(resumeText),...JSON.parse(response.output_text)});
  } catch {
    res.json({mode:"fallback",resumeAware:Boolean(resumeText),...getInitialQuestion({role,type,difficulty,resumeText})});
  }
});

app.post("/api/interview/followup", async (req,res) => {
  const { role, type, difficulty, currentQuestion, answer, history=[], resumeText="" } = req.body || {};
  const safe = normalizeHistory(history);
  if (!ai) return res.json({mode:"demo",resumeAware:Boolean(resumeText),...getAdaptiveQuestion({role,type,difficulty,currentQuestion,answer,history:safe,resumeText})});
  try {
    const resumeBlock = resumeText ? `\nRESUME CONTEXT:\n${String(resumeText).slice(0,18000)}` : "";
    const system = `You are an expert Product Management interviewer.
Role: ${role}. Interview type: ${type}. Difficulty: ${difficulty}.
${resumeText ? "This is a resume-aware interview. Ask follow-ups that are grounded in the resume and the candidate's latest answer. You may challenge ownership, impact, metrics, decisions, trade-offs, tools, or project details, but NEVER invent a resume fact. If the answer is vague, ask for a concrete example or evidence." : "Ask one concise follow-up question based directly on the candidate's latest answer."}
Probe the missing reasoning dimension: users, problem framing, prioritization, metrics, experiments, trade-offs, or communication.
Do not praise excessively. Do not give away the answer. Keep the interview realistic.
IMPORTANT: Never repeat a question that already appears in the interview history. Before generating a question, compare it against every prior question and choose a meaningfully different question. Do not merely change punctuation or a few words. Rotate across ownership, problem, prioritization, metrics, stakeholders, trade-offs, and reflection.
If the candidate has completed at least 6 substantive answers, set isFinal=true.
Return JSON only: {"question":"...","competency":"...","intent":"...","isFinal":false}.
${resumeBlock}`;
    const response = await ai.responses.create({model:process.env.OPENAI_MODEL || "gpt-5.6-luna",input:[{role:"system",content:system},{role:"user",content:JSON.stringify({currentQuestion,answer,history:safe})}],text:{format:{type:"json_object"}}});
    res.json({mode:"ai",resumeAware:Boolean(resumeText),...JSON.parse(response.output_text)});
  } catch {
    res.json({mode:"fallback",resumeAware:Boolean(resumeText),...getAdaptiveQuestion({role,type,difficulty,currentQuestion,answer,history:safe,resumeText})});
  }
});

app.post("/api/interview/feedback", async (req,res) => {
  const { role, history=[], resumeText="" } = req.body || {};
  const safe = normalizeHistory(history);
  if (!ai) return res.json({mode:"demo",...getDemoFeedback(safe)});
  try {
    const system = `You are a senior Product Management interview coach.
Evaluate the transcript only from evidence in the candidate's answers.
${resumeText ? "This was a resume-aware interview. Also assess how well the candidate defended resume claims, ownership and quantified impact. Do not assume resume claims are true; score only how well they were defended in the interview." : ""}
Return JSON only:
{"overallScore":0,"summary":"","scores":{"problemFraming":0,"userInsight":0,"analyticalThinking":0,"metrics":0,"prioritization":0,"communication":0},"strengths":["","",""],"improvements":["","",""],"nextPractice":{"title":"","reason":""}}
Scores are 0-10. Be specific, fair and actionable. Do not claim hiring probability.`;
    const response = await ai.responses.create({model:process.env.OPENAI_MODEL || "gpt-5.6-luna",input:[{role:"system",content:system},{role:"user",content:JSON.stringify({role,transcript:safe,resumeText:resumeText?String(resumeText).slice(0,18000):""})}],text:{format:{type:"json_object"}}});
    res.json({mode:"ai",resumeAware:Boolean(resumeText),...JSON.parse(response.output_text)});
  } catch {
    res.json({mode:"fallback",...getDemoFeedback(safe)});
  }
});

app.use((err,_req,res,_next)=>{res.status(400).json({ok:false,error:err?.message||"Request failed."})});
app.use((_req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(PORT,()=>console.log(`MockMate AI → http://localhost:${PORT}`));

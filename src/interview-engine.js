const BANK = [
  { question:"Pick a product you use every week. What is one user problem you would solve first, and why?", competency:"Problem framing", intent:"Clarify user, problem and prioritization logic." },
  { question:"How would you know that your solution actually improved the user's experience?", competency:"Metrics", intent:"Test outcome metrics and measurement thinking." },
  { question:"You can only ship one of three improvements this quarter. How would you prioritize?", competency:"Prioritization", intent:"Test impact, effort, risk and strategic fit." },
  { question:"Suppose your primary metric improves, but complaints also rise. What would you investigate?", competency:"Trade-offs", intent:"Test metric quality, segmentation and unintended consequences." },
  { question:"Design an experiment to test whether your proposed change is worth launching.", competency:"Experiment design", intent:"Test hypothesis, control, success criteria and risks." },
  { question:"Tell me about a time new evidence changed your product decision.", competency:"Learning agility", intent:"Test evidence-based decision making." },
  { question:"Imagine engineering says your idea is too expensive. What would you do next?", competency:"Stakeholder management", intent:"Test collaboration, trade-offs and scope reduction." }
];

export function normalizeHistory(history){
  return (Array.isArray(history)?history:[]).slice(-10).map(x=>({
    question:String(x.question||"").slice(0,1500),
    answer:String(x.answer||"").slice(0,4000),
    competency:String(x.competency||"")
  }));
}

function resumeLines(resumeText="") {
  return String(resumeText).split(/\n+/).map(x=>x.replace(/^[-•▪*]\s*/,"").trim()).filter(x=>x.length>25).slice(0,160);
}

function resumeTopics(resumeText="") {
  const lines=resumeLines(resumeText);
  const preferred=lines.filter(x=>/(project|intern|experience|developed|built|created|led|managed|achieved|worked|product|analysis|machine learning|dashboard|app|system|research|internship)/i.test(x));
  const pool=[...preferred,...lines].filter((x,i,a)=>a.indexOf(x)===i);
  return pool.length?pool:["your most relevant experience"];
}

function resumeTopic(resumeText="", index=0) {
  const topics=resumeTopics(resumeText);
  return topics[Math.min(index,topics.length-1)];
}

function questionWasUsed(question, history=[]) {
  const q=String(question||"").trim().toLowerCase();
  return history.some(x=>String(x.question||"").trim().toLowerCase()===q);
}

function pickUnique(candidates, history) {
  return candidates.find(x=>!questionWasUsed(x.question,history)) || candidates[0];
}

export function getInitialQuestion({resumeText=""}={}){
  if(resumeText?.trim()) return {
    question:`I reviewed your resume and noticed this: “${resumeTopic(resumeText,0).slice(0,220)}”. Walk me through what you personally owned and the problem you were trying to solve.`,
    competency:"Resume deep dive",
    intent:"Verify ownership, problem framing and impact from the candidate's resume."
  };
  return BANK[0];
}

export function getAdaptiveQuestion({answer="",history=[],resumeText=""}={}){
  const safeHistory=normalizeHistory(history);
  const a=String(answer).toLowerCase();
  const n=safeHistory.length;
  if(n>=6) return {question:"That concludes this practice session. Let's debrief your performance.",competency:"Debrief",intent:"Complete session",isFinal:true};

  if(resumeText?.trim()) {
    // Deliberately rotate the interview dimension. This prevents the same keyword
    // in an answer (e.g. "project") from producing the same question repeatedly.
    const topic=resumeTopic(resumeText, Math.floor((n-1)/2)+1);
    const topicShort=topic.slice(0,140);
    const resumeCandidates=[
      {question:`What was the biggest challenge you faced while working on ${topicShort}, and how did you resolve it?`,competency:"Problem solving",intent:"Probe a concrete challenge from the resume."},
      {question:`How did you decide what to build or prioritize in ${topicShort}?`,competency:"Prioritization",intent:"Test product judgment and prioritization from the resume."},
      {question:`What evidence or metric did you use to judge whether ${topicShort} was successful?`,competency:"Resume evidence",intent:"Test measurable impact and evidence."},
      {question:`Who were the key people or stakeholders involved in ${topicShort}, and how did you work with them?`,competency:"Stakeholder management",intent:"Probe collaboration and ownership."},
      {question:`If you could redo ${topicShort} today, what would you change first and why?`,competency:"Product judgment",intent:"Test reflection and product reasoning."},
      {question:`What is one thing on your resume about ${topicShort} that an interviewer is most likely to challenge, and how would you defend it?`,competency:"Resume defensibility",intent:"Test precise ownership and credibility."}
    ];

    // Use answer signals only to choose a dimension, then choose an unused question.
    let preferred=0;
    if(/metric|kpi|retention|conversion|dau|mau|result|impact|increase|decrease|%/.test(a)) preferred=2;
    else if(/team|led|managed|stakeholder|collaborat|engineering|designer/.test(a)) preferred=3;
    else if(/decision|priorit|choose|trade.?off|constraint/.test(a)) preferred=1;
    else if(/challenge|problem|difficult|obstacle/.test(a)) preferred=0;
    else if(/improve|change|today|future/.test(a)) preferred=4;

    const ordered=[resumeCandidates[preferred],...resumeCandidates.filter((_,i)=>i!==preferred)];
    const chosen=pickUnique(ordered,safeHistory);
    return {...chosen,isFinal:false};
  }

  const candidates=[
    /metric|kpi|retention|conversion|dau|mau|north star/.test(a)?BANK[2]:null,
    /user|customer|persona|pain|need|problem/.test(a)?BANK[1]:null,
    /trade.?off|cost|effort|risk|constraint/.test(a)?BANK[4]:null,
    /experiment|a\/b|test|control|hypothesis/.test(a)?BANK[3]:null,
    BANK[(n+1)%BANK.length]
  ].filter(Boolean).map(x=>({...x,isFinal:false}));
  return pickUnique(candidates,safeHistory);
}

function scoreAnswer(a){
  const t=a.toLowerCase(); let s=3;
  if(t.length>180)s+=1;
  if(/user|customer|persona|pain/.test(t))s+=1;
  if(/metric|kpi|retention|conversion|dau|mau/.test(t))s+=1;
  if(/because|assume|first|second|then|therefore/.test(t))s+=1;
  if(/trade.?off|risk|cost|effort|constraint/.test(t))s+=1;
  if(/experiment|a\/b|test|control/.test(t))s+=1;
  return Math.min(10,s);
}

export function getDemoFeedback(history){
  const scores=history.map(x=>scoreAnswer(x.answer||""));
  const avg=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):5;
  return {
    overallScore:Math.min(100,avg*10),
    summary:"You showed useful product instincts. The biggest opportunity is to make your reasoning more explicit: define the user and problem first, choose a measurable outcome, then explain the trade-offs behind your decision.",
    scores:{problemFraming:Math.min(10,avg+1),userInsight:Math.min(10,avg),analyticalThinking:Math.min(10,avg),metrics:Math.max(4,avg-1),prioritization:Math.max(4,avg-1),communication:Math.min(10,avg+1)},
    strengths:["You engaged with the interviewer and responded to follow-up pressure.","Your answers showed product intuition rather than only repeating memorized frameworks.","You were able to move from ideas toward decisions."],
    improvements:["Name the target user and the exact problem before proposing a solution.","Choose one primary outcome metric and explain why it represents user value.","Make trade-offs explicit: impact, effort, risk and what you would deliberately not build."],
    nextPractice:{title:"Metrics + Experiment Design",reason:"Your next session should strengthen measurement and evidence-based decision making."}
  };
}

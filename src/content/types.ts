export type Difficulty = "beginner" | "intermediate" | "advanced";

export type Depth = "full" | "primer";

export type DiagramId =
  | "infinity"
  | "http"
  | "git"
  | "cicd"
  | "docker"
  | "aws"
  | "terraform"
  | "k8s"
  | "prometheus"
  | "bluegreen"
  | "incident"
  | "linuxfs"
  | "vpc"
  | "permissions";

export type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; tone: "info" | "tip" | "warn" | "danger"; title: string; text: string }
  | { type: "code"; lang: string; title?: string; code: string; note?: string }
  | { type: "table"; caption?: string; headers: string[]; rows: string[][] }
  | { type: "diagram"; id: DiagramId };

export type Exercise = {
  title: string;
  prompt: string;
  steps: string[];
  criteria: string[];
};

export type Qa = { q: string; a: string };

export type Lesson = {
  slug: string;
  title: string;
  status: Depth;
  blocks: Block[];
  exercise: Exercise | null;
  checks: Qa[];
  interview: Qa[];
  takeaways: string[];
};

export type ModuleInfo = {
  id: string;
  slug: string;
  number: number;
  title: string;
  summary: string;
  outcomes: string[];
  optional?: boolean;
};

export type Topic = {
  slug: string;
  moduleId: string;
  title: string;
  summary: string;
  difficulty: Difficulty;
  minutes: number;
  depth: Depth;
  objectives: string[];
  prerequisites: string[];
  tags: string[];
  brief: string;
};

export type LabStep = {
  title: string;
  body: string;
  why: string;
  code?: string;
  lang?: string;
  note?: string;
};

export type Lab = {
  slug: string;
  code: string;
  title: string;
  objective: string;
  minutes: number;
  difficulty: Difficulty;
  prerequisites: string[];
  setup: string[];
  warning?: string;
  steps: LabStep[];
  verify: string[];
  errors: { symptom: string; fix: string }[];
  cleanup: string[];
  checklist: string[];
  challenge?: string;
};

export type ProjectSpec = {
  slug: string;
  number: number;
  title: string;
  summary: string;
  effort: string;
  difficulty: Difficulty;
  outcomes: string[];
  architecture: string[];
  tree: { path: string; note: string }[];
  steps: { title: string; body: string }[];
  deliverables: string[];
  validation: string[];
  talkingPoints: string[];
  warning?: string;
};

export type QuizQuestion = {
  id: string;
  kind: "mc" | "tf" | "short";
  difficulty: Difficulty;
  prompt: string;
  choices?: string[];
  answer?: number | boolean;
  model?: string;
  explanation: string;
  topic: string;
};

export type Quiz = {
  id: string;
  title: string;
  summary: string;
  moduleId: string;
  minutes: number;
  questions: QuizQuestion[];
};

export type GlossaryEntry = {
  term: string;
  slug: string;
  definition: string;
  moduleId: string;
  related: string[];
};

export type InterviewItem = {
  id: string;
  category: string;
  difficulty: Difficulty;
  kind: "concept" | "compare" | "scenario" | "output" | "behavioral";
  prompt: string;
  hint: string;
  answer: string;
  topic?: string;
};

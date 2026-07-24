// Tech-stack data that drives the keyboard.
//
// The `name` of each skill MUST match the corresponding keycap object name
// inside `skills-keyboard.spline` — that is how a hovered/pressed key is mapped
// back to a skill. `label` + `shortDescription` are pushed into the Spline
// scene variables "heading" / "desc" so they appear on the keyboard's screen.
// `color` / `icon` are used if you want to render a flat HTML fallback grid.

export enum SkillNames {
PYTHON = "Python",
JAVA = "Java",
CPP = "C++",
JS = "JS",
TYPESCRIPT = "TypeScript",
SQL = "SQL",

MACHINE_LEARNING = "ML",
LANGCHAIN = "LangChain",
LANGGRAPH = "LangGraph",
OPENAI = "OpenAI",
RAG = "RAG",
PANDAS = "Pandas",

REACT = "React",
NODEJS = "Node.js",
EXPRESS = "Express",
POSTGRESQL = "Postgres",
SUPABASE = "Supabase",
TAILWIND = "Tailwind",
AWS = "AWS",
DOCKER = "Docker",
GIT = "Git",
GITHUB = "GitHub",
LINUX = "Linux",
VERCEL = "Vercel",
}

export type Skill = {
  id: number;
  name: string;
  label: string;
  shortDescription: string;
  color: string;
  icon: string;
};

export const SKILLS: Record<SkillNames, Skill> = {
  [SkillNames.JS]: {
    id: 1,
    name: "JS",
    label: "JS",
    shortDescription:
      "Drove AI Job Portal • CICT Platforms • Portfolio Website",
    color: "#F7DF1E",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },

  [SkillNames.TYPESCRIPT]: {
    id: 2,
    name: "ts",
    label: "TypeScript",
    shortDescription:
      "Enabled Portfolio Development • Modern React Apps • Type-Safe Components",
    color: "#3178C6",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  
  [SkillNames.CPP]: {
    id: 3,
    name: "cpp",
    label: "C++",
    shortDescription:
      "Strengthened LeetCode Practice • Competitive Programming • Algorithm Design",
    color: "#00599C",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  },

  [SkillNames.PYTHON]: {
    id: 4,
    name: "python",
    label: "Python",
    shortDescription:
      "Powered AI Data Analysis Agent • Data Quality Monitor • RuTAG Research",
    color: "#3776AB",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },

  [SkillNames.JAVA]: {
    id: 5,
    name: "java",
    label: "Java",
    shortDescription:
      "Applied in Object-Oriented Programming • Academic Projects • Software Engineering",
    color: "#ED8B00",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  },


  [SkillNames.SQL]: {
    id: 6,
    name: "sql",
    label: "SQL",
    shortDescription:
      "Queried AI Job Portal • PostgreSQL Database • Application Data",
    color: "#336791",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  },

  [SkillNames.MACHINE_LEARNING]: {
    id: 7,
    name: "ML",
    label: "ML",
    shortDescription:
      "Developed Tamil Language Models • CICT Research • Intelligent Applications",
    color: "#FF6F00",
    icon: "https://cdn.simpleicons.org/tensorflow/FF6F00",
  },

   [SkillNames.RAG]: {
    id: 11,
    name: "RAG",
    label: "RAG",
    shortDescription:
      "Enhanced Knowledge Retrieval • Bedrock Experiments • Context-Aware Responses",
    color: "#0EA5E9",
    icon: "https://cdn.simpleicons.org/vectorlogozone/0EA5E9",
  },

  [SkillNames.LANGCHAIN]: {
    id: 8,
    name: "LangChain",
    label: "LangChain",
    shortDescription:
      "Engineered AI Data Analysis Agent • LLM Pipelines • Tool Calling",
    color: "#1C3C3C",
    icon: "https://cdn.simpleicons.org/langchain/1C3C3C",
  },
   [SkillNames.PANDAS]: {
    id: 12,
    name: "Pandas",
    label: "Pandas",
    shortDescription:
      "Analyzed RuTAG Research • Experimental Datasets • Language Corpora",
    color: "#150458",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
  },
 [SkillNames.OPENAI]: {
    id: 10,
    name: "OpenAI",
    label: "OpenAI",
    shortDescription:
      "Integrated Conversational AI • Data Analysis Agent • LLM Applications",
    color: "#412991",
    icon: "https://cdn.simpleicons.org/openai/412991",
  },

  [SkillNames.LANGGRAPH]: {
    id: 9,
    name: "LangGraph",
    label: "LangGraph",
    shortDescription:
      "Orchestrated Multi-Agent Workflows • AI Data Analysis Agent • State Management",
    color: "#6D28D9",
    icon: "https://cdn.simpleicons.org/langgraph/6D28D9",
  },
 
    [SkillNames.REACT]: {
    id: 13,
    name: "React",
    label: "React",
    shortDescription:
      "Built AI Job Portal • CICT Platforms • Portfolio Website",
    color: "#61DAFB",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },

  [SkillNames.NODEJS]: {
    id: 14,
    name: "Node.js",
    label: "Node.js",
    shortDescription:
      "Powered AI Job Portal Backend • CICT Platforms • REST APIs",
    color: "#339933",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },

  [SkillNames.EXPRESS]: {
    id: 15,
    name: "Express.js",
    label: "Express.js",
    shortDescription:
      "Developed Authentication APIs • Job Management • Backend Services",
    color: "#FFFFFF",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
  },

  [SkillNames.POSTGRESQL]: {
    id: 16,
    name: "Postgres",
    label: "Postgres",
    shortDescription:
      "Managed User Accounts • Job Applications • Relational Data",
    color: "#336791",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  },

  [SkillNames.SUPABASE]: {
    id: 17,
    name: "Supabase",
    label: "Supabase",
    shortDescription:
      "Handled Authentication • Resume Storage • Cloud Database",
    color: "#3ECF8E",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg",
  },

  [SkillNames.TAILWIND]: {
    id: 18,
    name: "Tailwind",
    label: "Tailwind",
    shortDescription:
      "Designed Portfolio Website • AI Job Portal • Responsive Interfaces",
    color: "#06B6D4",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  },

   [SkillNames.GITHUB]: {
    id: 22,
    name: "GitHub",
    label: "GitHub",
    shortDescription:
      "Hosted Portfolio Website • Open-Source Projects • Version Control",
    color: "#181717",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  },
[SkillNames.DOCKER]: {
    id: 20,
    name: "Docker",
    label: "Docker",
    shortDescription:
      "Containerized Backend Services • Development Environment • Application Deployment",
    color: "#2496ED",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  },
 [SkillNames.LINUX]: {
    id: 23,
    name: "Linux",
    label: "Linux",
    shortDescription:
      "Configured Development Environment • Server Workflows • Command-Line Tools",
    color: "#FCC624",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
  },

[SkillNames.AWS]: {
    id: 19,
    name: "AWS",
    label: "AWS",
    shortDescription:
      "Powered Bedrock Experiments • S3 Storage • Cloud Infrastructure",
    color: "#FF9900",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
  },


  [SkillNames.VERCEL]: {
    id: 24,
    name: "Vercel",
    label: "Vercel",
    shortDescription:
      "Deployed Portfolio Website • AI Job Portal • Serverless Functions",
    color: "#000000",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg",
  },


  [SkillNames.GIT]: {
    id: 21,
    name: "Git",
    label: "Git",
    shortDescription:
      "Versioned Project Development • Feature Branches • Team Collaboration",
    color: "#F05032",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },

 
};
 
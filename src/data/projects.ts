import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "ai-job-portal",
    title: "AI-Powered Job Portal System",
    problem:
      "Traditional job portals provide static job listings with limited personalization, making it difficult for candidates to prepare for interviews, optimize resumes, and discover relevant opportunities.",
    solution:
      "Built an AI-powered recruitment platform with role-based authentication, intelligent resume matching, AI mock interviews, resume analysis, and real-time application tracking to streamline the hiring process for both job seekers and recruiters.",
    techStack: [
      "React",
      "PostgreSQL",
      "Supabase",
      "Node.js",
      "JavaScript",
      "CSS",
      "OpenAI API"
    ],
    features: [
      "Role-based authentication for job seekers and recruiters",
      "AI-powered resume parsing and job matching with match percentage",
      "AI mock interviews with voice-based evaluation and feedback history",
      "AI-curated skill recommendations for specific career roles",
      "Resume builder and interview preparation resources",
      "Real-time application status tracking",
      "Dynamic motivational quotes on dashboard",
      "Character-level highlighted job search"
    ],
    responsibilities: [
      "Implemented role-based authentication for job seekers and recruiters",
      "Integrated the OpenAI API for resume parsing, matching and mock interviews",
      "Built the resume builder, candidate dashboard and application tracker in React"
    ],
    architecture: [
      "React client backed by Supabase (PostgreSQL) for auth, data and storage",
      "Node.js layer orchestrating OpenAI calls for parsing and evaluation",
      "Match scoring derived from parsed resumes and role requirements"
    ],
    results: [
      "AI match percentage and curated skill recommendations per role",
      "Voice-based mock interviews with persistent feedback history",
      "End-to-end, real-time application status tracking"
    ],
    images: [
      "/images/projects/jobportal-1.jpg",
      "/images/projects/jobportal-2.jpg"
    ],
    video: "/videos/projects/jobportal.mp4",
    demoUrl: "YOUR_DEMO_URL",
    githubUrl: "YOUR_GITHUB_URL",
    category: "AI Application",
    year: "2026",
    color: "#997953",
  },

  {
    id: "ai-data-analysis-agent",
    title: "AI Data Analysis Agent",
    problem:
      "Business users often spend hours performing exploratory data analysis manually before extracting meaningful insights.",
    solution:
      "Developed a multi-agent AI system using LangGraph and LLMs that automates exploratory data analysis, visualization, reporting, and competitor research through an intuitive Streamlit interface.",
    techStack: [
      "Python",
      "LangChain",
      "LangGraph",
      "Streamlit",
      "Plotly",
      "OpenAI API",
      "Tavily API"
    ],
    features: [
      "Multi-agent workflow orchestration using LangGraph",
      "Automated EDA and statistical analysis",
      "Interactive dashboards and visualizations",
      "CSV/XLSX upload support",
      "AI-generated reports",
      "Competitor analysis using external APIs",
      "Conversational interaction with datasets"
    ],
    responsibilities: [
      "Designed a multi-agent workflow with LangGraph to automate EDA",
      "Built the Streamlit interface for uploads, chat and report export",
      "Integrated external APIs for competitor research"
    ],
    architecture: [
      "LangGraph orchestrates specialised LLM agents as a directed workflow",
      "Streamlit front end over a Python analysis and visualisation layer",
      "Plotly for interactive charts; Tavily API for external research"
    ],
    results: [
      "Automated exploratory analysis and statistical summaries",
      "AI-generated reports and dashboards from raw CSV/XLSX uploads",
      "Conversational querying of uploaded datasets"
    ],
    images: [
      "/images/projects/dataagent-1.jpg",
      "/images/projects/dataagent-2.jpg"
    ],
    video: "/videos/projects/dataagent.mp4",
    demoUrl: "YOUR_DEMO_URL",
    githubUrl: "YOUR_GITHUB_URL",
    category: "Generative AI",
    year: "2026",
    color: "#A78BFA",
  },

  {
    id: "bedrock-rag",
    title: "AWS Bedrock RAG Knowledge Base",
    problem:
      "Enterprise documents are difficult to search efficiently using traditional keyword-based systems.",
    solution:
      "Built a Retrieval-Augmented Generation (RAG) solution on Amazon Bedrock using S3, Titan Embeddings and OpenSearch Serverless to deliver accurate context-aware AI responses from enterprise datasets.",
    techStack: [
      "Amazon Bedrock",
      "Amazon S3",
      "IAM",
      "OpenSearch Serverless",
      "Titan Embeddings",
      "Amazon Nova",
      "RAG"
    ],
    features: [
      "Semantic search using Titan Embeddings",
      "Knowledge Base integration with Amazon Bedrock",
      "Automatic document ingestion pipeline",
      "Context-aware AI responses",
      "Enterprise-scale vector search",
      "Automatic knowledge base updates without retraining"
    ],
    responsibilities: [
      "Built the document ingestion pipeline into an S3-backed knowledge base",
      "Configured Titan Embeddings and OpenSearch Serverless for vector search",
      "Wired Amazon Bedrock (Nova) for context-aware responses"
    ],
    architecture: [
      "S3 stores source documents; Bedrock Knowledge Base handles ingestion",
      "Titan Embeddings indexed in OpenSearch Serverless for semantic retrieval",
      "Nova generates answers grounded in retrieved context (RAG)"
    ],
    results: [
      "Accurate, context-aware answers over enterprise documents",
      "Semantic search that outperforms keyword lookup",
      "Knowledge base updates without model retraining"
    ],
    images: [
      "/images/projects/rag-1.jpg"
    ],
    video: "/videos/projects/rag.mp4",
    demoUrl: "YOUR_DEMO_URL",
    githubUrl: "YOUR_GITHUB_URL",
    category: "Cloud AI",
    year: "2026",
    color: "#34D399",
  },

  {
    id: "data-quality-monitor",
    title: "AI-Powered Data Quality Monitoring & Auto-Correction System",
    problem:
      "Poor-quality datasets containing missing values, duplicates and outliers reduce the reliability of analytics and machine learning models.",
    solution:
      "Developed an intelligent data quality platform that evaluates datasets across six quality dimensions, automatically detects issues, and applies corrective actions through an interactive dashboard.",
    techStack: [
      "Python",
      "Pandas",
      "NumPy",
      "Streamlit",
      "Data Visualization"
    ],
    features: [
      "Evaluation across six data quality dimensions",
      "Missing value detection",
      "Duplicate identification",
      "Outlier analysis",
      "Automatic data correction",
      "Interactive quality scoring dashboard",
      "Download cleaned datasets"
    ],
    responsibilities: [
      "Implemented scoring across six data-quality dimensions",
      "Built detection for missing values, duplicates and outliers",
      "Added automatic correction and cleaned-dataset export"
    ],
    architecture: [
      "Pandas/NumPy analysis core behind a Streamlit dashboard",
      "Rule-based checks compute per-dimension quality scores",
      "Correction routines applied on demand, exports downloadable"
    ],
    results: [
      "Interactive quality scoring across six dimensions",
      "Automatic detection and correction of common issues",
      "Downloadable cleaned datasets ready for modelling"
    ],
    images: [
      "/images/projects/dataquality-1.jpg"
    ],
    video: "/videos/projects/dataquality.mp4",
    demoUrl: "YOUR_DEMO_URL",
    githubUrl: "YOUR_GITHUB_URL",
    category: "Data Engineering",
    year: "2026",
    color: "#F59E0B",
  },

  {
    id: "smart-queueing",
    title: "Smart Queueing System",
    problem:
      "Traditional food ordering systems create long physical queues, increasing waiting time and reducing operational efficiency.",
    solution:
      "Developed a web-based smart queue management system enabling digital ordering, QR-based verification and real-time order tracking for a seamless contactless pickup experience.",
    techStack: [
      "HTML",
      "CSS",
      "JavaScript"
    ],
    features: [
      "Digital food ordering interface",
      "Real-time queue management",
      "Unique order ID generation",
      "QR-based order verification",
      "Live order status tracking",
      "Reduced waiting time through asynchronous processing"
    ],
    responsibilities: [
      "Built the digital food-ordering and queue interface",
      "Implemented unique order-ID generation and QR verification",
      "Added live order-status tracking"
    ],
    architecture: [
      "Client-side web app in HTML, CSS and JavaScript",
      "Order IDs encoded as QR codes for pickup verification",
      "Asynchronous status updates drive the live queue"
    ],
    results: [
      "Contactless ordering with QR-verified pickup",
      "Reduced physical queueing and wait time",
      "Real-time order status for customers"
    ],
    images: [
      "/images/projects/queue-1.jpg"
    ],
    video: "/videos/projects/queue.mp4",
    demoUrl: "YOUR_DEMO_URL",
    githubUrl: "YOUR_GITHUB_URL",
    category: "Full Stack",
    year: "2026",
    color: "#F87171",
  },
];

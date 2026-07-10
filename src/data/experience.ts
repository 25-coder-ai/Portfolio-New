import type { Experience } from "@/types";

// ============================================================
// EXPERIENCE DATA — REPLACE WITH YOUR EXPERIENCE
// ============================================================

export const experiences: Experience[] = [
  {
    id: "internship-1",
    title: "Technical Intern",             // REPLACE
    organization: "Central Institute of Classical Tamil, Central Government",       // REPLACE
    type: "internship",
    startDate: "2026-04",                         // REPLACE: YYYY-MM format
    endDate: "2026-10",                           // REPLACE
    description: "Contributing to the full-stack development of scalable web platforms for Tamil language learning and digital corpus exploration, integrating modern web technologies and language processing tools.", // REPLACE
    responsibilities: [
    "Design and develop full-stack web applications for Tamil language education and digital corpus platforms",
    "Implement responsive user interfaces using React and integrate backend services",
    "Prepare and preprocess linguistic datasets for language-focused applications",
    "Implement reusable frontend and backend components",

    ],
    technologies: ["React", "Node.js", "Tailwind CSS", "Git", "Python"],
    achievements: [
      "Developing a scalable platform for interactive Tamil language education",
      "Empowering researchers through a searchable corpus containing thousands of linguistic records",
      "Integrating intelligent language tools using modern full-stack technologies"
    ],
    location: "CICT, Chennai",
    color: "#4F8EF7",
    icon: "💼",
    metrics: [
      { value: "40%", label: "Faster reporting" },
      { value: "90%", label: "Fewer data errors" },
      { value: "5", label: "ETL pipelines" },
    ],
  },
  {
    id: "club-1",
    title: "Events Head of the Literary Club",   // REPLACE
    organization: "SRM University, Chennai", // REPLACE
    type: "club",
    startDate: "2024-06",                         // REPLACE
    endDate: "Present",                           // REPLACE
    description: "Won national-level hackathon with a real-time crop disease detection system using computer vision and IoT integration.", // REPLACE
    responsibilities: [
      "Led team of 6 members across design, ML, and backend",
      "Built and trained YOLOv8 model achieving 96% detection accuracy",
      "Developed REST API serving predictions in <200ms",
      "Presented solution to panel of 20+ industry experts",
    ],
    technologies: ["Python", "YOLOv8", "FastAPI", "React", "Raspberry Pi"],
    achievements: [
      "1st of 480 teams, national finals",
      "96% detection accuracy on field data",
      "Solution shortlisted for incubation",
    ],
    color: "#F59E0B",
    icon: "🏆",
    metrics: [
      { value: "1st", label: "of 480 teams" },
      { value: "96%", label: "Detection accuracy" },
      { value: "<200ms", label: "API latency" },
    ],
  },
  {
    id: "internship-2",
    title: "Research Intern",             // REPLACE
    organization: "IIT Madras",       // REPLACE
    type: "internship",
    startDate: "2025-12",                         // REPLACE: YYYY-MM format
    endDate: "2025-12",                         // REPLACE
    description: "Contributed to precision agriculture research by engineering experimental datasets and deriving data-driven insights for technology-enabled farming solutions.", // REPLACE
    responsibilities: [
      "Organized 8 technical workshops with 150+ attendees each",
      "Mentored 30 junior students in data science fundamentals",
      "Coordinated department-level coding competition with 300+ participants",
      "Managed club's technical blog reaching 2000+ monthly readers",
    ],
    technologies: ["Event Management", "Teaching", "Community Building"],
    achievements: [
      "Grew active membership from 60 to 200",
      "8 workshops, 150+ attendees each",
      "Mentored 30 juniors into data roles",
    ],
    color: "#A78BFA",
    icon: "👑",
    metrics: [
      { value: "200", label: "Members grown to" },
      { value: "8", label: "Workshops led" },
      { value: "30", label: "Students mentored" },
    ],
  },
  {
    id: "club-2",
    title: "Technical Member of Chipset Club",                  // REPLACE
    organization: "SRM University, Chennai", // REPLACE
    type: "research",
    startDate: "2023-01",                         // REPLACE
    endDate: "2023-12",                           // REPLACE
    description: "Assisted faculty in research on efficient graph neural network architectures for large-scale social network analysis.", // REPLACE
    responsibilities: [
      "Reviewed 25+ research papers on GNN architectures",
      "Implemented and benchmarked 3 GNN models on ogbn-arxiv dataset",
      "Co-authored a conference paper (submitted to ICML 2024)",
      "Maintained reproducible experiment pipeline with MLflow",
    ],
    technologies: ["Python", "PyTorch", "DGL", "MLflow", "LaTeX"],
    achievements: [
      "Co-authored paper submitted to ICML 2024",
      "Beat baseline GNN by 4.2% on ogbn-arxiv",
      "Built fully reproducible experiment suite",
    ],
    color: "#34D399",
    icon: "🔬",
    metrics: [
      { value: "4.2%", label: "Above baseline" },
      { value: "3", label: "GNN models built" },
      { value: "25+", label: "Papers reviewed" },
    ],
  },
  {
    id: "volunteering-1",
    title: "Technical Volunteer",                 // REPLACE
    organization: "Code for India Foundation",    // REPLACE
    type: "volunteering",
    startDate: "2023-06",                         // REPLACE
    endDate: "2023-12",                           // REPLACE
    description: "Volunteered to teach coding fundamentals to underprivileged students in rural schools, covering Python basics and web development.", // REPLACE
    responsibilities: [
      "Taught 50+ students Python fundamentals over 6 months",
      "Developed simplified curriculum for students with no prior coding experience",
      "Conducted 24 weekly sessions both online and in-person",
    ],
    technologies: ["Python", "HTML/CSS", "Scratch"],
    achievements: [
      "Taught 50+ first-time coders over 6 months",
      "Designed a zero-prerequisite curriculum",
      "24 sessions across 4 rural schools",
    ],
    color: "#F87171",
    icon: "❤️",
  },
  {
    id: "academic",
    title: "B.Tech Computer Science",            // REPLACE
    organization: "VIT University, Chennai",     // REPLACE
    type: "academic",
    startDate: "2022-07",                        // REPLACE
    endDate: "2026-05",                          // REPLACE
    description: "Specialization in Big Data Analytics. Relevant coursework: Machine Learning, Database Systems, Big Data Technologies, Cloud Computing, Data Structures & Algorithms.", // REPLACE
    responsibilities: [
      "CGPA: 10 / 10 (Current)",
      "Specialization: Big Data Analytics",
      "Relevant: ML, DBMS, Big Data Tech, Cloud Computing, DSA",
      "Dean's List: Semester 1, 2, 3, 4",
    ],
    technologies: ["ML", "Big Data", "Cloud Computing", "DSA"],
    achievements: [
      "CGPA 10 / 10, Dean's List ×4 semesters",
      "Big Data Analytics specialization",
      "Consistent top-decile standing",
    ],
    color: "#4F8EF7",
    icon: "🎓",
    metrics: [
      { value: "10", label: "CGPA / 10" },
      { value: "×4", label: "Dean's List" },
    ],
  },
  {
    id: "club-11",
    title: "Core Member — AI/ML Club",           // REPLACE
    organization: "VIT AI Research Club",        // REPLACE
    type: "club",
    startDate: "2022-09",                        // REPLACE
    endDate: "Present",
    description: "Active member of the university's AI/ML research club, working on open-source projects and organizing knowledge-sharing sessions.", // REPLACE
    responsibilities: [
      "Contributed to 3 open-source ML projects on GitHub",
      "Presented monthly research paper reviews to 50+ members",
      "Organized annual AI Symposium with 500+ registrations",
    ],
    technologies: ["Python", "TensorFlow", "PyTorch", "Kaggle"],
    achievements: [
      "Contributed to 3 open-source ML projects",
      "Organized AI Symposium, 500+ registrations",
      "Monthly paper reviews for 50+ members",
    ],
    color: "#A78BFA",
    icon: "🤖",
  },
];

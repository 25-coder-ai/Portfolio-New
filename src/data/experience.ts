import type { Experience } from "@/types";

// ============================================================
// EXPERIENCE DATA — REPLACE WITH YOUR EXPERIENCE
// ============================================================

export const experiences: Experience[] = [
  {
    id: "internship-1",
    title: "Data Engineering Intern",             // REPLACE
    organization: "Tech Company Pvt. Ltd.",       // REPLACE
    type: "internship",
    startDate: "2024-05",                         // REPLACE: YYYY-MM format
    endDate: "2024-08",                           // REPLACE
    description: "Built and maintained ETL pipelines processing millions of records daily for business intelligence reporting.", // REPLACE
    responsibilities: [
      "Developed 5 ETL pipelines using Python and Apache Airflow",
      "Optimized SQL queries reducing report generation time by 40%",
      "Collaborated with cross-functional teams to define data models",
      "Implemented data quality checks reducing errors by 90%",
    ],
    technologies: ["Python", "Apache Airflow", "PostgreSQL", "AWS S3", "Tableau"],
    location: "Chennai, India",
    color: "#4F8EF7",
    icon: "💼",
  },
  {
    id: "hackathon-1",
    title: "1st Place — Smart India Hackathon",   // REPLACE
    organization: "Ministry of Education, India", // REPLACE
    type: "hackathon",
    startDate: "2024-03",                         // REPLACE
    endDate: "2024-03",                           // REPLACE
    description: "Won national-level hackathon with a real-time crop disease detection system using computer vision and IoT integration.", // REPLACE
    responsibilities: [
      "Led team of 6 members across design, ML, and backend",
      "Built and trained YOLOv8 model achieving 96% detection accuracy",
      "Developed REST API serving predictions in <200ms",
      "Presented solution to panel of 20+ industry experts",
    ],
    technologies: ["Python", "YOLOv8", "FastAPI", "React", "Raspberry Pi"],
    color: "#F59E0B",
    icon: "🏆",
  },
  {
    id: "leadership-1",
    title: "Technical Lead",                      // REPLACE
    organization: "Computer Science Student Association", // REPLACE
    type: "leadership",
    startDate: "2023-07",                         // REPLACE
    endDate: "2024-06",                           // REPLACE
    description: "Led technical initiatives for a 200-member student community, organizing workshops, hackathons, and coding competitions.", // REPLACE
    responsibilities: [
      "Organized 8 technical workshops with 150+ attendees each",
      "Mentored 30 junior students in data science fundamentals",
      "Coordinated department-level coding competition with 300+ participants",
      "Managed club's technical blog reaching 2000+ monthly readers",
    ],
    technologies: ["Event Management", "Teaching", "Community Building"],
    color: "#A78BFA",
    icon: "👑",
  },
  {
    id: "research-1",
    title: "Research Assistant",                  // REPLACE
    organization: "Department of Computer Science, VIT", // REPLACE
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
    color: "#34D399",
    icon: "🔬",
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
      "CGPA: 8.5 / 10 (Current)",
      "Specialization: Big Data Analytics",
      "Relevant: ML, DBMS, Big Data Tech, Cloud Computing, DSA",
      "Dean's List: Semester 1, 2, 3, 4",
    ],
    technologies: ["ML", "Big Data", "Cloud Computing", "DSA"],
    color: "#4F8EF7",
    icon: "🎓",
  },
  {
    id: "club-1",
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
    color: "#A78BFA",
    icon: "🤖",
  },
];

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
    achievements: [
      "40% faster reporting cycle, adopted org-wide",
      "Data quality errors down 90%",
      "Return offer extended at end of term",
    ],
    location: "Chennai, India",
    color: "#4F8EF7",
    icon: "💼",
    metrics: [
      { value: "40%", label: "Faster reporting" },
      { value: "90%", label: "Fewer data errors" },
      { value: "5", label: "ETL pipelines" },
    ],
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
      "CGPA: 8.5 / 10 (Current)",
      "Specialization: Big Data Analytics",
      "Relevant: ML, DBMS, Big Data Tech, Cloud Computing, DSA",
      "Dean's List: Semester 1, 2, 3, 4",
    ],
    technologies: ["ML", "Big Data", "Cloud Computing", "DSA"],
    achievements: [
      "CGPA 8.5 / 10, Dean's List ×4 semesters",
      "Big Data Analytics specialization",
      "Consistent top-decile standing",
    ],
    color: "#4F8EF7",
    icon: "🎓",
    metrics: [
      { value: "8.5", label: "CGPA / 10" },
      { value: "×4", label: "Dean's List" },
    ],
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
    achievements: [
      "Contributed to 3 open-source ML projects",
      "Organized AI Symposium, 500+ registrations",
      "Monthly paper reviews for 50+ members",
    ],
    color: "#A78BFA",
    icon: "🤖",
  },
];

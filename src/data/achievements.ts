import type { Achievement } from "@/types";

// ============================================================
// ACHIEVEMENTS DATA — REPLACE WITH YOUR ACHIEVEMENTS
// ============================================================

export const achievements: Achievement[] = [
  {
    id: "ach-1",
    title: "Smart India Hackathon 2024 — Winner", // REPLACE
    issuer: "Ministry of Education, India",        // REPLACE
    type: "hackathon",
    date: "2024-03",                               // REPLACE
    description: "National-level grand prize for building a real-time crop disease detection system. Competed against 10,000+ teams nationwide.", // REPLACE
    image: "/images/achievements/hackathon-1.jpg", // REPLACE: Add image
    rank: "1st Place",
    skills: ["Computer Vision", "FastAPI", "Team Leadership", "Edge Deployment"],
    notes: "Led a team of six from prototype to a working field demo in 36 hours; solution shortlisted for incubation.",
    color: "#F59E0B",
  },
  {
    id: "ach-2",
    title: "AWS Certified Cloud Practitioner",    // REPLACE
    issuer: "Amazon Web Services",                // REPLACE
    type: "certificate",
    date: "2024-01",                              // REPLACE
    description: "Foundational AWS certification validating cloud concepts, core services, security, and pricing models.", // REPLACE
    image: "/images/achievements/aws-cert.jpg",   // REPLACE: Add image
    credentialUrl: "https://aws.amazon.com/verification", // REPLACE
    skills: ["AWS Core Services", "Cloud Security", "Cost Optimization"],
    notes: "Foundation for hands-on work with S3, EC2 and IAM across later projects.",
    color: "#FF9900",
  },
  {
    id: "ach-3",
    title: "Kaggle Competition — Top 5%",         // REPLACE
    issuer: "Kaggle",                             // REPLACE
    type: "competition",
    date: "2023-11",                              // REPLACE
    description: "Achieved top 5% ranking in the Tabular Playground Series competition using an XGBoost ensemble with sophisticated feature engineering.", // REPLACE
    image: "/images/achievements/kaggle.jpg",     // REPLACE: Add image
    rank: "Top 5%",
    skills: ["XGBoost", "Feature Engineering", "Model Ensembling", "Pandas"],
    notes: "Placed in the top 5% of a field of several thousand competitors.",
    color: "#20BEFF",
  },
  {
    id: "ach-4",
    title: "Best Paper Award — ICDE Workshop",    // REPLACE
    issuer: "IEEE ICDE",                          // REPLACE
    type: "award",
    date: "2024-05",                              // REPLACE
    description: "Best paper award at the Data Engineering workshop for research on efficient streaming graph processing algorithms.", // REPLACE
    image: "/images/achievements/paper-award.jpg", // REPLACE: Add image
    skills: ["Graph Algorithms", "Stream Processing", "Technical Writing"],
    notes: "Recognized among workshop submissions for clarity and practical impact.",
    color: "#A78BFA",
  },
  {
    id: "ach-5",
    title: "Google Data Analytics Certificate",  // REPLACE
    issuer: "Google / Coursera",                 // REPLACE
    type: "certificate",
    date: "2023-08",                             // REPLACE
    description: "Professional certificate covering data analysis process, visualization, SQL, R, and Tableau across 8 comprehensive courses.", // REPLACE
    image: "/images/achievements/google-cert.jpg", // REPLACE: Add image
    credentialUrl: "https://coursera.org/verify/your-id", // REPLACE
    skills: ["SQL", "R", "Tableau", "Data Visualization"],
    notes: "Eight-course professional track covering the full analytics workflow.",
    color: "#4285F4",
  },
  {
    id: "ach-6",
    title: "Dean's List — 4 Consecutive Semesters", // REPLACE
    issuer: "VIT University",                        // REPLACE
    type: "academic",
    date: "2024-06",                                 // REPLACE
    description: "Recognized for academic excellence with a CGPA above 8.5 for four consecutive semesters, placing in the top 10% of the department.", // REPLACE
    rank: "Top 10%",
    skills: ["Consistency", "Time Management", "Core CS Foundations"],
    notes: "Maintained standing while leading club activities and side projects.",
    color: "#34D399",
  },
];

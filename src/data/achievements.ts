import type { Achievement } from "@/types";

// ============================================================
// ACHIEVEMENTS DATA — a curated exhibition of exactly three.
// Ordered left → right as they appear on their pedestals.
// ============================================================

export const achievements: Achievement[] = [
  {
    id: "ach-aws",
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    type: "certificate",
    date: "2025-07",
    description:
      "Earned the AWS Certified Cloud Practitioner credential in my first year, building a strong foundation in cloud architecture that later supported full-stack and cloud projects.",
    credentialUrl: "https://www.credly.com/users/dakshithaa-venkatesan",
    skills: ["AWS Core Services", "Cloud Security", "Cost Optimization"],
    notes: "Foundation for hands-on work with S3, EC2 and IAM across later projects.",
    color: "#FF9900",
  },
  {
    id: "ach-gpa",
    title: "Perfect 10.0 CGPA",
    issuer: "SRM University",
    type: "academic",
    date: "2024-06",
    description:
      "Achieved a perfect 10 CGPA for 4 consecutive semesters while balancing internships and leadership roles.",
    skills: ["Consistency", "Time Management", "Core CS Foundations"],
    notes: "Maintained while working an internship and leading club activities.",
    color: "#CFE0FF",
  },
  {
    id: "ach-leetcode",
    title: "LeetCode Streak",
    issuer: "LeetCode",
    type: "competition",
    date: "2026-07",
    description:
      "Maintained a 184-day LeetCode streak through consistent daily problem solving, strengthening algorithmic thinking and coding proficiency.",
      credentialUrl: "https://leetcode.com/u/Dakshithaa/",
    skills: ["Data Structures", "Algorithms", "Problem Solving"],
    notes: "Consistent daily practice across arrays, graphs, and dynamic programming.",
    color: "#F59E0B",
  },
];

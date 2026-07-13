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
      "Foundational certification validating cloud concepts, core services, security, and pricing models.",
    credentialUrl: "https://www.credly.com/users/dakshithaa-venkatesan",
    skills: ["AWS Core Services", "Cloud Security", "Cost Optimization"],
    notes: "Foundation for hands-on work with S3, EC2 and IAM across later projects.",
    color: "#FF9900",
  },
  {
    id: "ach-gpa",
    title: "Perfect 10.0 GPA",
    issuer: "SRM University",
    type: "academic",
    date: "2024-06",
    description:
      "A flawless 10 / 10 CGPA sustained across four consecutive semesters.",
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
      "A sustained daily problem-solving streak building lasting algorithmic fluency.",
    skills: ["Data Structures", "Algorithms", "Problem Solving"],
    notes: "Consistent daily practice across arrays, graphs, and dynamic programming.",
    color: "#F59E0B",
  },
];

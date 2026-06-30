import type { Project } from "@/types";

// ============================================================
// PROJECTS DATA — REPLACE WITH YOUR PROJECTS
// ============================================================

export const projects: Project[] = [
  {
    id: "bigdata-pipeline",
    title: "Real-Time Big Data Pipeline",  // REPLACE: Project title
    problem: "Traditional batch processing systems could not handle streaming IoT sensor data at scale, causing analysis delays of 4–6 hours.", // REPLACE
    solution: "Built an end-to-end real-time pipeline using Apache Kafka, Spark Streaming, and a PostgreSQL data warehouse with automated alerting.", // REPLACE
    techStack: ["Python", "Apache Kafka", "Spark Streaming", "PostgreSQL", "Docker", "AWS EC2"],
    features: [
      "Processes 500K+ events/sec with sub-second latency",
      "Automated anomaly detection with configurable thresholds",
      "Real-time dashboard with live metric updates",
      "Horizontal auto-scaling on AWS",
    ],
    images: ["/images/projects/project1-1.jpg", "/images/projects/project1-2.jpg"], // REPLACE
    video: "/videos/projects/bigdata-pipeline.mp4", // REPLACE (optional — drop a muted loop here)
    demoUrl: "https://your-demo-link.com",  // REPLACE
    githubUrl: "https://github.com/yourusername/bigdata-pipeline", // REPLACE
    category: "Big Data",
    year: "2024",
    color: "#4F8EF7",
  },
  {
    id: "ml-sentiment",
    title: "Multi-Modal Sentiment Analyzer", // REPLACE
    problem: "Existing sentiment tools analyzed text only, missing crucial emotional signals from customer support audio and images.", // REPLACE
    solution: "Developed a multi-modal deep learning system combining NLP (BERT) and CNN models to analyze text, audio features, and image sentiment simultaneously.", // REPLACE
    techStack: ["Python", "TensorFlow", "BERT", "FastAPI", "React", "Docker"],
    features: [
      "94.2% accuracy on multi-modal benchmark dataset",
      "Real-time API with <100ms response time",
      "Supports text, audio (wav/mp3), and image inputs",
      "Interactive web dashboard for batch analysis",
    ],
    images: ["/images/projects/project2-1.jpg"], // REPLACE
    video: "/videos/projects/ml-sentiment.mp4", // REPLACE (optional)
    demoUrl: "https://your-demo-link.com", // REPLACE
    githubUrl: "https://github.com/yourusername/ml-sentiment", // REPLACE
    category: "Machine Learning",
    year: "2024",
    color: "#A78BFA",
  },
  {
    id: "data-viz",
    title: "Interactive Analytics Dashboard", // REPLACE
    problem: "Business teams needed real-time visibility into KPIs but existing BI tools required technical expertise to operate.", // REPLACE
    solution: "Built a drag-and-drop analytics dashboard with natural language query support, auto-generated charts, and scheduled email reports.", // REPLACE
    techStack: ["React", "D3.js", "Python", "FastAPI", "PostgreSQL", "AWS S3"],
    features: [
      "Natural language to SQL query converter",
      "25+ chart types with auto-suggestions",
      "Scheduled PDF/email report generation",
      "Role-based access control",
    ],
    images: ["/images/projects/project3-1.jpg"], // REPLACE
    video: "/videos/projects/analytics-dashboard.mp4", // REPLACE (optional)
    demoUrl: "https://your-demo-link.com", // REPLACE
    githubUrl: "https://github.com/yourusername/analytics-dashboard", // REPLACE
    category: "Analytics",
    year: "2023",
    color: "#34D399",
  },
  {
    id: "cloud-infra",
    title: "Serverless Data Processing Platform", // REPLACE
    problem: "On-premise batch jobs were expensive and lacked scalability during peak loads, causing 30% over-provisioning costs.", // REPLACE
    solution: "Migrated to an event-driven serverless architecture using AWS Lambda, Step Functions, and S3, reducing costs by 60%.", // REPLACE
    techStack: ["AWS Lambda", "Step Functions", "S3", "DynamoDB", "Python", "Terraform"],
    features: [
      "60% reduction in infrastructure costs",
      "Auto-scales from 0 to 10K concurrent executions",
      "Infrastructure-as-code with Terraform",
      "Full observability with CloudWatch dashboards",
    ],
    images: ["/images/projects/project4-1.jpg"], // REPLACE
    video: "/videos/projects/serverless-platform.mp4", // REPLACE (optional)
    demoUrl: undefined,
    githubUrl: "https://github.com/yourusername/serverless-platform", // REPLACE
    category: "Cloud",
    year: "2023",
    color: "#F59E0B",
  },
  {
    id: "fraud-detection",
    title: "Real-Time Fraud Detection Engine", // REPLACE
    problem: "Card transactions had to be scored for fraud in under 50ms, but the existing rules engine missed novel attack patterns.", // REPLACE
    solution: "Built a streaming feature store feeding a gradient-boosted model served behind a low-latency API, with online learning from analyst feedback.", // REPLACE
    techStack: ["Python", "XGBoost", "Kafka", "Redis", "FastAPI", "Feast"],
    features: [
      "Sub-50ms p99 scoring latency at 12K TPS",
      "Cut false positives by 38% over the legacy rules",
      "Online feature store with point-in-time correctness",
      "Human-in-the-loop retraining pipeline",
    ],
    images: ["/images/projects/project5-1.jpg"], // REPLACE
    video: "/videos/projects/fraud-detection.mp4", // REPLACE (optional)
    demoUrl: "https://your-demo-link.com", // REPLACE
    githubUrl: "https://github.com/yourusername/fraud-detection", // REPLACE
    category: "Machine Learning",
    year: "2024",
    color: "#F87171",
  },
];

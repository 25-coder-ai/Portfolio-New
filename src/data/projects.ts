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
  {
    id: "geo-insights",
    title: "Geospatial Mobility Insights", // REPLACE
    problem: "City planners lacked a way to understand foot-traffic and transit demand from billions of anonymized GPS pings.", // REPLACE
    solution: "Built an H3-indexed spatial pipeline and an interactive map that surfaces hotspots, flows, and demand forecasts by hour.", // REPLACE
    techStack: ["Python", "H3", "DuckDB", "deck.gl", "Next.js", "PostGIS"],
    features: [
      "Aggregates 2B+ GPS pings into H3 hexes nightly",
      "Interactive deck.gl heatmaps and flow maps",
      "Hourly demand forecasting per zone",
      "Privacy-preserving k-anonymity thresholds",
    ],
    images: ["/images/projects/project6-1.jpg"], // REPLACE
    video: "/videos/projects/geo-insights.mp4", // REPLACE (optional)
    demoUrl: "https://your-demo-link.com", // REPLACE
    githubUrl: "https://github.com/yourusername/geo-insights", // REPLACE
    category: "Big Data",
    year: "2024",
    color: "#38BDF8",
  },
  {
    id: "rag-assistant",
    title: "Retrieval-Augmented Docs Assistant", // REPLACE
    problem: "Support agents spent hours digging through scattered docs to answer recurring product questions.", // REPLACE
    solution: "Built a RAG assistant that grounds answers in the company knowledge base with citations, using a vector store and a reranking step.", // REPLACE
    techStack: ["TypeScript", "Next.js", "pgvector", "Claude API", "LangGraph"],
    features: [
      "Grounded answers with inline source citations",
      "Hybrid search (BM25 + dense) with cross-encoder rerank",
      "Streaming responses with tool-calling",
      "Feedback loop that flags low-confidence answers",
    ],
    images: ["/images/projects/project7-1.jpg"], // REPLACE
    video: "/videos/projects/rag-assistant.mp4", // REPLACE (optional)
    demoUrl: "https://your-demo-link.com", // REPLACE
    githubUrl: "https://github.com/yourusername/rag-assistant", // REPLACE
    category: "Machine Learning",
    year: "2025",
    color: "#A78BFA",
  },
  {
    id: "iot-twin",
    title: "Industrial IoT Digital Twin", // REPLACE
    problem: "Factory operators couldn't predict equipment failures, leading to costly unplanned downtime.", // REPLACE
    solution: "Created a digital twin that streams sensor telemetry into a time-series store and flags anomalies with predictive maintenance alerts.", // REPLACE
    techStack: ["Python", "MQTT", "TimescaleDB", "Grafana", "scikit-learn", "Docker"],
    features: [
      "Live 3D twin synced to 400+ sensors",
      "Predicts bearing failures ~2 weeks ahead",
      "Reduced unplanned downtime by 27%",
      "Edge buffering for unreliable network links",
    ],
    images: ["/images/projects/project8-1.jpg"], // REPLACE
    video: "/videos/projects/iot-twin.mp4", // REPLACE (optional)
    demoUrl: undefined,
    githubUrl: "https://github.com/yourusername/iot-twin", // REPLACE
    category: "Big Data",
    year: "2023",
    color: "#2DD4BF",
  },
  {
    id: "ab-platform",
    title: "Self-Serve Experimentation Platform", // REPLACE
    problem: "Product teams couldn't run trustworthy A/B tests without a data scientist setting up the stats each time.", // REPLACE
    solution: "Built a self-serve platform that handles assignment, guardrail metrics, and sequential testing with automatic significance calls.", // REPLACE
    techStack: ["TypeScript", "React", "Python", "Snowflake", "dbt", "Airflow"],
    features: [
      "Sequential testing with always-valid p-values",
      "Automatic guardrail and sample-ratio mismatch checks",
      "Self-serve metric definitions via dbt",
      "Powers 120+ concurrent experiments",
    ],
    images: ["/images/projects/project9-1.jpg"], // REPLACE
    video: "/videos/projects/ab-platform.mp4", // REPLACE (optional)
    demoUrl: "https://your-demo-link.com", // REPLACE
    githubUrl: "https://github.com/yourusername/ab-platform", // REPLACE
    category: "Analytics",
    year: "2025",
    color: "#FB7185",
  },
  {
    id: "vision-quality",
    title: "Computer Vision Quality Inspector", // REPLACE
    problem: "Manual visual inspection on the assembly line was slow and missed subtle surface defects.", // REPLACE
    solution: "Trained a defect-segmentation model and deployed it on edge devices to flag and sort defective parts in real time.", // REPLACE
    techStack: ["Python", "PyTorch", "OpenCV", "ONNX", "TensorRT", "Jetson"],
    features: [
      "98.6% defect recall at 30 FPS on-edge",
      "Few-shot adaptation to new product lines",
      "Active-learning loop for hard examples",
      "Automatic reject-bin actuation via GPIO",
    ],
    images: ["/images/projects/project10-1.jpg"], // REPLACE
    video: "/videos/projects/vision-quality.mp4", // REPLACE (optional)
    demoUrl: "https://your-demo-link.com", // REPLACE
    githubUrl: "https://github.com/yourusername/vision-quality", // REPLACE
    category: "Machine Learning",
    year: "2024",
    color: "#C084FC",
  },
];

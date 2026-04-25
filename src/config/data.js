
// ============================================================
// PERSONAL PORTFOLIO DATA
// Single source of truth. Edit here to update the site.
// ============================================================

export const personalInfo = {
  name: 'Rakshit Sinha',
  initials: 'RS',
  role: 'CV Engineer · ML Researcher · Edge AI Builder',
  roles: ['CV Engineer', 'ML Researcher', 'Edge AI Builder', 'Full-Stack Dev'],
  shortBio:
    'B.Tech CS @ VIT Vellore · Vice Chair, TAM-VIT AI Club. I build computer vision systems, deploy models to edge devices, and occasionally write about what I learn.',
  longBio:
    "I'm a second-year Computer Science student at VIT Vellore, where I serve as Vice Chairperson of the AI & ML Club (TAM-VIT). My work sits at the intersection of computer vision, edge deployment, and building things that actually run in the real world: Jetson Orin Nano inference pipelines, offline-first mobile ML apps, and research tooling. I care about depth over breadth, writing clearly about technical ideas, and shipping things that work under constraints.",
  email: 'rakshitsinha1444@gmail.com',
  github: 'https://github.com/Arvoxis',
  githubHandle: 'Arvoxis',
  linkedin: 'https://www.linkedin.com/in/rakshit-sinha-vit/',
  linkedinHandle: 'rakshit-sinha-vit',
  medium: 'https://medium.com/@rakshitsinha1444',
  mediumHandle: '@rakshitsinha1444',
  location: 'Vellore, India',
  status: 'Open to Internships',
  availability: 'Available for remote',
};

export const personal = {
  name: {
    first: 'Rakshit',
    last: 'Sinha',
  },
  role: 'Machine Learning & AI Developer',
  tagline: 'Machine Learning & AI Developer',
  subTagline: 'B.Tech Computer Science · VIT Vellore · Class of 2028',
  bio:
    "Computer Science undergraduate at VIT Vellore with experience in machine learning, NLP, and computer vision. Skilled in Python-based ML workflows using Scikit-learn, NumPy, and Pandas, with exposure to TensorFlow and Keras. Built projects including LLM-based semantic search, supervised ML models, and gesture recognition using OpenCV and MediaPipe. Vice Chairperson of the AI & ML Club, seeking an AI/ML internship.",
  email: 'rakshitsinha1444@gmail.com',
  phone: '+91 9113865011',
  location: 'VIT Vellore, Tamil Nadu, India',
  resumeUrl: '#',
  socials: {
    github: 'https://github.com/Arvoxis',
    linkedin: 'https://www.linkedin.com/in/rakshit-sinha-vit/',
    twitter: null,
  },
};

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Writing', href: '#writing' },
  { label: 'Contact', href: '#contact' },
];

export const stats = [
  {
    k: 'Education',
    v: 'B.Tech CS, VIT Vellore',
    note: 'Second year · Class of 2028',
    icon: 'academic',
  },
  {
    k: 'Leadership',
    v: 'Vice Chair, TAM-VIT',
    note: "VIT's AI & ML Club · 200+ members",
    icon: 'club',
  },
  {
    k: 'Focus',
    v: 'Computer vision, edge AI',
    note: 'Jetson · TensorRT · offline-first ML',
    icon: 'hack',
  },
  {
    k: 'Availability',
    v: 'Internships, 2025',
    note: 'Remote or on-site · SWE / ML',
    icon: 'work',
  },
];

export const techStack = [
  'Python',
  'PyTorch',
  'FastAPI',
  'React',
  'TensorRT',
  'OpenCV',
  'PostgreSQL',
  'Docker',
  'Git',
  'CUDA',
  'TFLite',
  'Node.js',
];

export const projects = {
  featured: {
    slug: 'hawk-i',
    badge: 'Featured · In Development',
    title: 'Hawk-I · Drone Infrastructure Inspection',
    description:
      'Edge AI pipeline on Jetson Orin Nano for real-time structural defect detection. YOLOv11n TensorRT INT8 + Grounding DINO-T FP16, SAM2 segmentation with GSD-based area calculation, DINOv2 temporal anomaly detection via cosine similarity, Gemma-3 LLM report generation grounded in IRC/IS 456 standards. FastAPI/WebSocket backend with PostGIS and a live GPS map dashboard.',
    tags: [
      'YOLOv11',
      'TensorRT INT8',
      'DINOv2',
      'SAM2',
      'Grounding DINO',
      'Gemma-3',
      'FastAPI',
      'PostGIS',
      'Streamlit',
      'Jetson Orin Nano',
    ],
    github: 'https://github.com/Arvoxis/hawk-i',
    caseStudy:
      'https://medium.com/@rakshitsinha1444/how-i-used-dinov2-embeddings-to-detect-infrastructure-degradation-no-object-detector-could-see-ed57272e72c0',
  },

  grid: [
    {
      slug: 'kisansathi',
      title: 'KisanSathi · Smart Agriculture Platform',
      description:
        'Offline-first mobile platform giving farmers crop-disease diagnosis, weather and market-price guidance, and modern farming recommendations. MobileNetV2 on PlantVillage (~94% val accuracy) quantized to TFLite INT8 for on-device inference, with a Crop Risk Score and a Federated Learning module for privacy-preserving model updates.',
      tags: [
        'MobileNetV2',
        'TFLite INT8',
        'PlantVillage',
        'Federated Learning',
        'React Native',
        'Offline-First',
      ],
      github: 'https://github.com/Arvoxis/KisanSathi',
    },
    {
      slug: 'research-assistant',
      title: 'Research Assistant · Intelligent Retrieval Engine',
      description:
        'An automated research assistant that retrieves, summarizes, and extracts knowledge from multiple sources. Uses LLMs and embedding-based semantic search to understand user queries, fetch relevant documents, and generate concise, context-aware insights, cutting the time from question to synthesized answer.',
      tags: [
        'LLMs',
        'Embeddings',
        'Semantic Search',
        'Prompt Engineering',
        'Python',
      ],
      github: 'https://github.com/Arvoxis/Research-assistant',
    },
    {
      slug: 'stocksense',
      title: 'StockSense · AI Stock Dashboard',
      description:
        'Real-time prices, interactive charts, and Claude-powered buy/sell/hold calls in one place. Fuses technicals, news, and sentiment so retail investors stop juggling tabs. Includes a watchlist, a screener, and a "Why Is It Moving?" explainer that generates narrative context for price movements.',
      tags: ['Claude API', 'Node.js', 'MongoDB', 'Finnhub', 'React'],
      github: 'https://github.com/Arvoxis/StockSense',
    },
    {
      slug: 'breast-cancer',
      title: 'Breast Cancer Classifier',
      description:
        'Supervised binary classifier on the WDBC diagnostic dataset. End-to-end: EDA, feature selection, SVM with RBF kernel, k-fold cross-validation, and confusion-matrix / AUC analysis. Ships with a full research report and presentation explaining how AI can assist in early detection and medical decision-making.',
      tags: ['SVM', 'Scikit-learn', 'WDBC', 'EDA', 'Classification', 'Python'],
      github: 'https://github.com/Arvoxis/BreastCancer',
    },
    {
      slug: 'snitch-game',
      title: 'Gesture-Controlled Snitch Game',
      description:
        'A Harry-Potter-themed interactive game built for a college expo escape room. Real-time hand tracking with MediaPipe and OpenCV drives two modes (catching golden snitches and whacking magical creatures) with custom gesture-to-action mapping for low-latency gameplay.',
      tags: ['OpenCV', 'MediaPipe', 'Real-Time CV', 'Python'],
      github: 'https://github.com/Arvoxis/Harry-puttar-snitch-game',
    },
  ],
};

export const articles = [
  {
    date: 'April 2026',
    title: 'When YOLO Goes Blind: Using DINOv2 for Pre-Defect Anomaly Detection',
    description:
      'How I used DINOv2 vision transformer embeddings and cosine similarity to detect structural degradation before it becomes a visible defect, catching what object detectors fundamentally cannot.',
    tags: ['DINOv2', 'Computer Vision', 'Anomaly Detection', 'Infrastructure'],
    readTime: '8 min read',
    url: 'https://medium.com/@rakshitsinha1444/how-i-used-dinov2-embeddings-to-detect-infrastructure-degradation-no-object-detector-could-see-ed57272e72c0',
  },
];

export const experience = [
  {
    role: 'Vice Chairperson',
    org: 'TAM-VIT (The AI & ML Club)',
    company: 'The AI & ML Club, VIT Vellore',
    location: 'VIT Vellore',
    period: '2024 · Present',
    description:
      'Leading AI/ML initiatives, organizing workshops and events, managing club communications, and building technical projects for 200+ members. TAM-VIT won Best Technical Club award.',
  },
  {
    role: 'Core Member',
    org: 'Toastmasters VIT',
    location: 'VIT Vellore',
    period: '2024 · Present',
    description:
      'Public speaking, communication skills development, meeting facilitation.',
  },
];


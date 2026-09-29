// ============================================================
// PERSONAL PORTFOLIO DATA
// Single source of truth. Edit here to update the site.
// ============================================================

export const personal = {
  name: 'Rakshit Sinha',
  first: 'Rakshit',
  last: 'Sinha',
  role: 'AI/ML Engineer',
  disciplines: ['Computer vision', 'Edge AI', 'Drone systems'],
  tagline: 'I build vision models that fly, and the systems that get them there.',
  standing: "CS undergrad, VIT Vellore '28 · Summer 2026: AI/ML Engineering Intern, Skylark Drones",
  education: 'B.Tech CSE · VIT Vellore · 2024–2028',
  status: 'Open to Summer 2027 internships',
  location: 'Vellore, India',
  email: 'rakshitsinha1444@gmail.com',
  github: 'https://github.com/Arvoxis',
  githubHandle: 'Arvoxis',
  linkedin: 'https://www.linkedin.com/in/rakshit-sinha-vit/',
  linkedinHandle: 'rakshit-sinha-vit',
  medium: 'https://medium.com/@rakshitsinha1444',
  mediumHandle: '@rakshitsinha1444',
  site: 'https://rakshitsinhacse.vercel.app/',
}

// SHEET 02: About, written as numbered drawing notes
export const notes = [
  'Third-year Computer Science student at VIT Vellore. Most of my work sits between a camera and a decision: detection, segmentation and anomaly models that have to run on real hardware.',
  'Spent Summer 2026 at Skylark Drones shipping defect-detection models for transmission-tower inspection, from label audits to Dockerized FastAPI serving, and putting a person/truck detector on DJI\'s own drone hardware.',
  'I like hard constraints: 6 GB of VRAM, a Jetson on a drone, a mesh of $5 boards with no leader. Constraints force the interesting engineering.',
  'Vice Chairperson of TAM-VIT, the AI & ML Club. We won Best Technical Club at University Day 2025 on our first nomination.',
]

export const spec = [
  { k: 'Role', v: 'AI/ML Engineer' },
  { k: 'Focus', v: 'CV · Edge AI · Drones' },
  { k: 'Education', v: 'B.Tech CSE, VIT Vellore' },
  { k: 'Year', v: '3rd · Class of 2028' },
  { k: 'Latest role', v: 'Skylark Drones, AI/ML Eng. Intern' },
  { k: 'Based in', v: 'Vellore, India' },
]

// SHEET 03: Revision history. The first `lead` points are shown; the rest sit behind a disclosure.
export const experience = [
  {
    rev: 'C',
    role: 'AI/ML Engineering Intern',
    org: 'Skylark Drones',
    place: 'Bangalore',
    period: 'May – Jul 2026',
    summary:
      'Built and shipped the defect-detection stack for drone-based transmission-tower inspection.',
    metrics: [
      { v: '5', l: 'production models shipped' },
      // `scan`: the tower scene's insulator detection lights this figure up
      { v: '0.76', l: 'mAP50, insulator defects', scan: true },
      { v: '9,148', l: '4096×3072 images per bulk run' },
      { v: '20–25', l: 'FPS on the DJI Matrice 4' },
    ],
    lead: 3,
    points: [
      'Deployed an MMYOLO person/truck detector onto the DJI Matrice 4 through DJI\'s "AI Inside" program at 20–25 FPS, plus a TFLite INT8 build for the RC Plus 2.',
      'Took the insulator defect detector from scratch to mAP50 0.76 by pivoting to oriented bounding boxes (about 47% of boxes were rotated) and auditing labels into a clean 4-class schema.',
      'Bird-dropping and corrosion segmentors reached 0.65 IoU from only ~19 masks; recovered +10 mAP points on a stalled corona detector through review-gated label completion, not architecture changes.',
      'Shipped 5 production defect models (3 YOLOv11-OBB detectors, 2 UNet++ / EfficientNet-B4 + SCSE segmentors) as 3 Dockerized repos with model cards, all served from one FastAPI container behind a shared I/O contract.',
      'Wrote a resumable bulk-inference pipeline running all 5 models over 9,148 full-res images. Profiling showed it was CPU-bound, and a full run landed at ~2.1 h on an RTX 3080.',
      'Extension week on Railways OHE: raised an anti-bird-net detector from 0.80 to ~0.90 mAP50 with model-assisted auto-relabelling and no hand-drawn boxes.',
    ],
    stack: ['YOLOv11-OBB', 'UNet++', 'SAM 3', 'MMYOLO', 'FastAPI', 'Docker', 'TFLite'],
  },
  {
    rev: 'B',
    role: 'Vice Chairperson',
    org: 'TAM-VIT · The AI & ML Club',
    place: 'VIT Vellore',
    period: '2025 – Present',
    summary: 'Helping lead a 3,000-member AI and ML club.',
    metrics: [
      { v: '3,000+', l: 'club members' },
      { v: '60+', l: 'events in a year' },
      { v: '2,000+', l: 'students at our events' },
    ],
    lead: 2,
    points: [
      'Led the club to Best Technical Club at VIT University Day 2025 on its first-ever nomination.',
      'Oversee a 14-member board running workshops, hackathons, a podcast, newsletters and research initiatives.',
    ],
    stack: [],
  },
  {
    rev: 'A',
    role: 'Core Member',
    org: 'Toastmasters VIT',
    place: 'VIT Vellore',
    period: '2024 – Present',
    summary: 'Public speaking, storytelling and structured communication.',
    metrics: [],
    lead: 0,
    points: [],
    stack: [],
  },
]

// SHEET 04: Drawings. `plate` picks the illustration in components/Plates.jsx.
export const featured = {
  dwg: 'DWG-01',
  plate: 'hawki',
  detect: 'project.hawk_i',
  title: 'Hawk-I',
  subtitle: 'AI drone infrastructure inspection',
  context: "Equinox '26 · ZeroDefect track",
  hero: { v: '24 h', l: 'hackathon build: Jetson edge inference to an auto-written PDF report' },
  description:
    'A Jetson Orin Nano runs YOLOv11n with TensorRT on the drone and streams frames over WebSocket to a FastAPI backend. SAM 2 segments each defect and estimates its area in cm², PostGIS with DBSCAN de-duplicates overlapping detections, and Gemma-3 via Ollama writes the inspection report when the session ends.',
  pipeline: ['Jetson · YOLOv11n', 'WebSocket', 'FastAPI', 'SAM 2', 'PostGIS', 'Gemma-3 report'],
  stack: ['YOLOv11', 'SAM 2', 'TensorRT', 'FastAPI', 'PostGIS', 'Ollama', 'Streamlit'],
  github: 'https://github.com/Arvoxis/hawk-i',
}

// The write-up that sits under Hawk-I as reference R1
export const writeup = {
  ref: 'R1',
  date: 'Apr 2026',
  title: 'When YOLO goes blind: using DINOv2 for pre-defect anomaly detection',
  description:
    'Using DINOv2 embeddings and cosine similarity to catch structural degradation before it becomes a visible defect, which is exactly what object detectors cannot see.',
  readTime: '8 min read',
  url: 'https://medium.com/@rakshitsinha1444/how-i-used-dinov2-embeddings-to-detect-infrastructure-degradation-no-object-detector-could-see-ed57272e72c0',
}

export const projects = [
  {
    dwg: 'DWG-02',
    plate: 'khoj',
    detect: 'project.khoj',
    title: 'KHOJ',
    subtitle: 'Leaderless search-and-rescue drone swarm',
    context: 'INNOHACK 2.0',
    hero: { v: '1.6×', l: 'more survivors confirmed than the best baseline search, same time budget (simulated)' },
    description:
      'A swarm for GPS-denied collapsed buildings. ESP32 boards on an ESP-NOW mesh run a sequential auction with no leader. A survivor is only confirmed once two drones independently agree, through log-odds fusion. Kill any board and the rest re-coordinate in under 2 s. Results so far are from simulation; hardware-in-the-loop runs are in progress.',
    facts: ['0 false alarms in 600 simulated runs', 'mAP50 0.934 on SAR imagery', 'Recovers from a dead node in < 2 s'],
    stack: ['ESP32', 'ESP-NOW', 'C', 'YOLOv11', 'TensorRT', 'FastAPI'],
    github: 'https://github.com/Arvoxis/Khoj',
  },
  {
    dwg: 'DWG-03',
    plate: 'kisan',
    detect: 'project.kisansathi',
    title: 'KisanSathi',
    subtitle: 'Crop-disease scanner and crop advisor',
    context: 'AgriTech',
    hero: { v: '92.5%', l: 'validation accuracy across 38 crop-disease classes' },
    description:
      'A plant-disease scanner built on MobileNetV2 fine-tuned on PlantVillage and exported to TFLite for on-device inference. It sits alongside a Random Forest crop recommender and a weighted crop-risk score.',
    facts: ['TFLite export for on-device use', 'Top-3 crop recommendations', 'Crop risk score out of 100'],
    stack: ['MobileNetV2', 'TFLite', 'Random Forest', 'Python'],
    github: 'https://github.com/Arvoxis/KisanSathi',
  },
  {
    dwg: 'DWG-04',
    plate: 'research',
    detect: 'project.research_engine',
    title: 'Research Intelligence Engine',
    subtitle: 'Papers in, knowledge graph out',
    context: 'NLP · Retrieval',
    hero: { v: '97.5%', l: 'of extracted claims grounded in their source papers, on our eval set' },
    description:
      'Fetches arXiv papers, embeds abstracts with MiniLM and retrieves with FAISS. It then builds a knowledge graph from spaCy claim extraction, and flags literature gaps and contradictions with DeBERTa NLI.',
    facts: ['Claims checked against their sources', 'Contradictions flagged with NLI', 'Literature gaps found in the graph'],
    stack: ['MiniLM', 'FAISS', 'spaCy', 'DeBERTa', 'FastAPI', 'React'],
    github: 'https://github.com/Arvoxis/Research-assistant',
  },
  {
    dwg: 'DWG-05',
    plate: 'tracker',
    detect: 'project.ml_tracker',
    title: 'ML Experiment Tracker',
    subtitle: 'A lite MLflow where the database is the hero',
    context: 'DBMS course project · team of 3',
    hero: { v: '4', l: 'Postgres features doing the heavy lifting: triggers, recursive CTEs, window functions, pgvector' },
    description:
      'Logs, compares and queries training runs. Triggers catch accuracy regressions, recursive CTEs track run lineage through a failed-run "graveyard", window functions flag rogue runs, and a local LLM turns plain-English questions into read-only SQL over pgvector.',
    facts: ['Recursive-CTE lineage', 'Trigger-based alerts', 'Plain English to SQL'],
    stack: ['PostgreSQL', 'pgvector', 'Supabase', 'FastAPI', 'React', 'Docker'],
    github: null,
    note: 'Private repo',
  },
  {
    dwg: 'DWG-06',
    plate: 'stock',
    detect: 'project.stocksense',
    title: 'StockSense',
    subtitle: 'AI stock dashboard',
    context: 'Full-stack',
    hero: { v: '3', l: 'market and news APIs behind one Express backend, with Claude analysis on top' },
    description:
      'Real-time quotes, technical indicators and news in one place, with Claude-powered analysis and a "Why is it moving?" explainer for price swings.',
    facts: ['EMA, Bollinger, RSI, MACD', 'Watchlist and screener', 'JWT auth with refresh tokens'],
    stack: ['Claude API', 'React', 'Express', 'MongoDB', 'Finnhub'],
    github: 'https://github.com/Arvoxis/StockSense',
  },
]

export const archive = [
  { title: 'Gesture-controlled Snitch game', github: 'https://github.com/Arvoxis/Harry-puttar-snitch-game' },
  { title: 'Breast cancer classifier', github: 'https://github.com/Arvoxis/BreastCancer' },
]

// SHEET 05: Bill of materials
export const skills = [
  { part: 'Vision / ML', items: ['PyTorch', 'TensorFlow / Keras', 'scikit-learn', 'YOLOv8/11 + OBB', 'SAM 2/3', 'UNet++', 'MMYOLO / MMDetection', 'DINOv2', 'OpenCV', 'MediaPipe'] },
  { part: 'Edge', items: ['Jetson Orin Nano', 'TensorRT', 'ONNX', 'TFLite INT8', 'DJI Matrice 4', 'ESP32'] },
  { part: 'LLM / NLP', items: ['Ollama', 'Gemma-3', 'LangChain', 'FAISS', 'spaCy', 'RAG', 'Hugging Face'] },
  { part: 'Web', items: ['FastAPI', 'WebSockets', 'Node.js', 'Express', 'React', 'Streamlit'] },
  { part: 'Data / Infra', items: ['PostgreSQL', 'pgvector', 'PostGIS', 'MongoDB', 'Docker', 'Git LFS', 'Linux'] },
  { part: 'Languages', items: ['Python', 'JavaScript', 'C/C++', 'Java', 'SQL'] },
]

// Credit required by the drone model's CC BY 4.0 licence
export const modelCredit = {
  text: '"DJI Avata2" by raphael.harris.gaffga',
  url: 'https://sketchfab.com/3d-models/dji-avata2-e27ed758e2174a89a48368e84027f8d9',
  license: 'CC BY 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
}

export const navLinks = [
  { label: 'About', href: '#notes' },
  { label: 'Experience', href: '#revisions' },
  { label: 'Projects', href: '#drawings' },
  { label: 'Skills', href: '#materials' },
  { label: 'Contact', href: '#contact' },
]

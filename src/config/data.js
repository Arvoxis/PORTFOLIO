// ============================================================
// PERSONAL PORTFOLIO DATA
// Edit this file to update all content across the site.
// ============================================================

export const personal = {
  name: {
    first: 'Rakshit',
    last: 'Sinha',
  },
  role: 'Machine Learning & AI Enthusiast',
  tagline: 'Machine Learning & AI Enthusiast',
  subTagline:
    'B.Tech Computer Science · VIT Vellore · Class of 2028',
  bio: "Computer Science undergraduate at VIT Vellore with experience in machine learning, NLP, and computer vision. Skilled in Python-based ML workflows using Scikit-learn, NumPy, and Pandas, with exposure to TensorFlow and Keras. Built projects including LLM-based semantic search, supervised ML models, and gesture recognition using OpenCV and MediaPipe. Vice Chairperson of the AI & ML Club, seeking an AI/ML internship.",
  email: 'rakshitsinha1444@gmail.com',
  phone: '+91 9113865011',
  location: 'VIT Vellore, Tamil Nadu, India',
  resumeUrl: '#',
  socials: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com/in/rakshitsinha',
    twitter: null,
  },
}

export const experience = [
  {
    company: 'The AI & ML Club, VIT Vellore',
    role: 'Vice Chairperson',
    period: '2025 — Present',
    location: 'VIT Vellore',
    bullets: [
      'Lead planning and execution of AI/ML workshops, hackathons, and guest speaker sessions for the student community.',
      'Manage core team coordination, event logistics, and cross-departmental outreach initiatives.',
      'Promote AI literacy and emerging technology awareness across the VIT campus.',
    ],
  },
  {
    company: 'Toastmasters VIT',
    role: 'Core Member',
    period: '2024 — Present',
    location: 'VIT Vellore',
    bullets: [
      'Develop public speaking, storytelling, and leadership skills through structured Toastmasters sessions.',
      'Build confident communication and presentation skills applicable to technical and non-technical audiences.',
    ],
  },
]

export const projects = [
  {
    name: 'AI Research Assistant',
    description:
      'Designed an intelligent research assistant using LLMs and embedding models for precise, context-aware query answering. Built a semantic search pipeline using vector representations to retrieve and rank relevant information from document sets, with applied prompt engineering.',
    tech: ['LLMs', 'Embeddings', 'Semantic Search', 'Prompt Engineering'],
    github: 'https://github.com',
    live: null,
  },
  {
    name: 'Breast Cancer Prediction Model',
    description:
      'Trained a supervised binary classification model on clinical breast cancer data achieving strong diagnostic accuracy. Performed comprehensive EDA, feature selection, and k-fold cross-validation; visualized data distributions and feature correlations using Matplotlib.',
    tech: ['Scikit-learn', 'EDA', 'Feature Engineering', 'Classification'],
    github: 'https://github.com',
    live: null,
  },
  {
    name: 'Computer Vision Snitch Game',
    description:
      'Built a gesture-controlled game using MediaPipe Hands and OpenCV for real-time hand tracking and pose estimation. Designed custom gesture-to-action mapping logic enabling responsive and intuitive gameplay interactions.',
    tech: ['Python', 'OpenCV', 'MediaPipe', 'Real-Time Detection'],
    github: 'https://github.com',
    live: null,
  },
  {
    name: 'Voice Note Web Application',
    description:
      'Developed a password-protected web app for recording, storing, and replaying voice notes directly in the browser. Implemented client-side audio recording via the Web Audio API with local storage-based data persistence.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Web Audio API'],
    github: 'https://github.com',
    live: null,
  },
]

export const skills = {
  Programming: ['Python', 'C/C++', 'Java', 'SQL', 'JavaScript', 'HTML/CSS'],
  'AI / ML': ['Machine Learning', 'Deep Learning', 'NLP & LLMs', 'Embeddings', 'Neural Networks', 'Model Evaluation'],
  'Libraries & Frameworks': ['Scikit-learn', 'TensorFlow', 'PyTorch', 'NumPy', 'Pandas', 'Keras', 'OpenCV', 'MediaPipe'],
  'Tools & Platforms': ['Git & GitHub', 'Jupyter Notebook', 'Google Colab', 'VS Code', 'Linux'],
}

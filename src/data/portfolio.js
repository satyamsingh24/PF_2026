/**
 * Single source of truth for the whole site.
 *
 * Everything is linked through NAV. The order here is the order of:
 *   - the navbar links
 *   - the sections on the page (after the landing hero)
 *   - the scroll-spy highlight and the section numbers
 *
 * Landing -> About Me -> Experience -> Skills -> Education -> Certifications -> Contact
 * (+ the floating Ask AI toggle, which is an action, not a section)
 */

export const PROFILE = {
  name: 'Satyam Singh Bhadoriya',
  firstName: 'Satyam',
  initials: 'SB',
  greeting: 'Hi, I am Satyam',
  role: 'A DevOps Engineer',
  email: 'Satyamsinghbhadoriya922@gmail.com',
  phone: '+91 8962373424',
  location: 'Indore, Madhya Pradesh',
  photo: '/assets/satyam-photo.jpg',
  avatar: '/assets/kuldeep-soni-avatar.png',
  github: 'https://github.com/satyamsingh24',
  linkedin: 'https://www.linkedin.com/in/satyam-singh-bhadoriya-7a22b1240',
};

export const NAV = [
  { id: 'about', label: 'About Me' },
  { id: 'projects', label: 'Experience' },
  { id: 'skills', label: 'Skills', kicker: 'Technical Toolkit' },
  { id: 'education', label: 'Education', kicker: 'Education & Honors' },
  { id: 'certifications', label: 'Certifications', kicker: 'Credentials' },
  { id: 'contact', label: 'Contact', kicker: 'Get in Touch' },
  { id: 'ask-ai', label: 'Ask AI', action: 'chat' },
];

export const SECTION_NAV = NAV.filter((n) => !n.action);
const NAV_BY_ID = Object.fromEntries(NAV.map((n) => [n.id, n]));
export const navItem = (id) => NAV_BY_ID[id];
/** "03" for the third section etc. — numbering follows NAV order automatically */
export const navNumber = (id) =>
  String(SECTION_NAV.findIndex((n) => n.id === id) + 1).padStart(2, '0');

/* -------------------------------------------------------------------------- */
/* Landing                                                                    */
/* -------------------------------------------------------------------------- */

export const HERO = {
  bio: 'DevOps Engineer with 10+ months of professional experience designing and maintaining CI/CD pipelines, AWS cloud infrastructure, and automated deployments with Docker, Kubernetes, Terraform, and Jenkins.',
};

/* -------------------------------------------------------------------------- */
/* Experience  (rendered with the stacking project-card design)               */
/* -------------------------------------------------------------------------- */

export const PROJECTS_INTRO = {
  title: 'Experience',
};

export const PROJECTS = [
  {
    id: 'nenosystems',
    badge: 'CURRENT ROLE · JAN 2026 – PRESENT',
    category: 'DevOps Engineer',
    title: 'Nenosystems Consultancy Services',
    period: 'Jan 2026 – Present',
    subtitle:
      'Building, maintaining, and optimizing CI/CD pipelines and AWS cloud infrastructure for reliable, automated deployments.',
    description:
      'Designing and managing AWS infrastructure with Terraform (IaC), containerizing applications with Docker and orchestrating them on Kubernetes — including storage, networking, and security. Configuring and monitoring EC2, IAM, S3, RDS, Lambda, CloudWatch, Route53, SQS, and SNS; tracking system health with Datadog, Grafana, Prometheus, and CloudWatch; and automating operational tasks with Shell scripting and Python.',
    video: null,
    mockup: {
      type: 'quote',
      icon: '⎈',
      quote: '$ terraform apply && kubectl rollout status deploy/app',
      color: '#7aa2f7',
      left: 'Jenkins & GitHub Actions',
      right: 'AWS · Terraform · Kubernetes',
    },
    highlights: [
      ['CI/CD', 'Jenkins & GitHub Actions'],
      ['INFRASTRUCTURE', 'AWS + Terraform (IaC)'],
      ['ORCHESTRATION', 'Docker & Kubernetes'],
      ['OBSERVABILITY', 'Datadog, Grafana, Prometheus'],
    ],
    tags: ['AWS', 'Terraform', 'Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions', 'Datadog', 'Python', 'Shell'],
    links: [],
  },
  {
    id: 'inventurs-cube',
    badge: 'APR 2025 – JUN 2025 · INDORE',
    category: 'DevOps Engineer',
    title: 'Inventurs Cube LLB, Indore',
    period: 'Apr 2025 – Jun 2025',
    subtitle:
      'CI/CD automation, Infrastructure as Code, and Linux server operations across build, test, and deployment workflows.',
    description:
      'Designed and maintained CI/CD pipelines with Jenkins, GitHub Actions, and GitLab CI/CD. Managed AWS infrastructure with Terraform and Ansible, containerized applications with Docker and Docker Compose, and worked with Kubernetes deployments, services, networking, and storage. Handled Linux server operations, troubleshot pipeline and deployment failures, implemented IAM roles, policies, and security groups, and deployed applications on EC2.',
    video: null,
    mockup: {
      type: 'hud',
      icon: 'IC',
      tiles: [['3', 'CI/CD Tools'], ['IaC', 'Terraform + Ansible'], ['24/7', 'Monitoring']],
      left: 'Pipelines: Jenkins · GitHub · GitLab',
      right: 'Deploy target: AWS EC2',
    },
    highlights: [
      ['CI/CD', 'Jenkins, GitHub Actions, GitLab CI'],
      ['IaC & CONFIG', 'Terraform & Ansible'],
      ['CONTAINERS', 'Docker & Docker Compose'],
      ['SECURITY', 'IAM Roles, Policies, SGs'],
    ],
    tags: ['Jenkins', 'GitLab CI/CD', 'Terraform', 'Ansible', 'Docker Compose', 'Linux', 'AWS EC2', 'Bash'],
    links: [],
  },
];

/* -------------------------------------------------------------------------- */
/* About Me                                                                   */
/* -------------------------------------------------------------------------- */

export const ABOUT = {
  title: 'About Me',
  portrait: '/assets/satyam-photo.jpg',
  portraitIsPhoto: true, // normal photo (not a transparent cut-out) -> soft oval fade
  bio: 'DevOps Engineer with 10+ months of professional experience and prior internship experience in CI/CD, cloud infrastructure, and automated deployments. Skilled in Linux, AWS, Docker, Kubernetes, Terraform, and Jenkins, with a strong foundation in Java, Spring, and Hibernate — focused on automation, troubleshooting, and system reliability.',
};

/* -------------------------------------------------------------------------- */
/* Education                                                                  */
/* -------------------------------------------------------------------------- */

export const EDUCATION_INTRO = {
  title: ['Academic Foundations.', 'Consistent Commitment.'],
  lead: 'Formal education in computer applications, with focused training in DevOps engineering.',
};

export const EDUCATION = [
  {
    year: '2023 — 2025',
    degree: 'Master of Computer Application (MCA)',
    institution: 'RGPV, Bhopal, Madhya Pradesh',
    score: 'MCA',
    scoreLabel: 'Post Graduation · Completed',
    featured: true,
  },
  {
    year: '2016 — 2019',
    degree: 'Bachelor of Computer Application (BCA)',
    institution: 'Barkatullah University, Bhopal, Madhya Pradesh',
    score: 'BCA',
    scoreLabel: 'Graduation · Completed',
  },
  {
    year: 'JAN 2025 · CERTIFICATION',
    degree: 'DevOps Engineer Foundation Course',
    institution: 'Skilling Academy',
    score: 'DevOps',
    scoreLabel: 'Professional Training',
  },
];

/* -------------------------------------------------------------------------- */
/* Skills                                                                     */
/* -------------------------------------------------------------------------- */

export const SKILLS_INTRO = {
  title: ['Core Competencies.', 'Modern DevOps Stack.'],
  lead: 'Tools and platforms I use to automate delivery, provision cloud infrastructure, and keep production systems observable and reliable.',
};

/**
 * Order = clockwise around the skills wheel, starting at the top.
 * `lines` is the label printed on the ring; `title` is the full heading shown in the centre.
 */
export const SKILLS = [
  {
    id: 'cloud',
    lines: ['Cloud &', 'Network'],
    title: 'Cloud, Networking & Security',
    items: ['AWS', 'EC2', 'IAM', 'S3', 'RDS', 'Lambda', 'Route53', 'SQS & SNS', 'VPC', 'Security Groups', 'VPN', 'Cloudflare CDN'],
  },
  {
    id: 'cicd',
    lines: ['CI/CD'],
    title: 'CI/CD & Version Control',
    items: ['Jenkins', 'GitHub Actions', 'GitLab Runner', 'GitLab CI/CD', 'Git', 'GitHub', 'GitLab', 'Branching Strategies'],
  },
  {
    id: 'containers',
    lines: ['Containers'],
    title: 'Containerization & Orchestration',
    items: ['Docker', 'Docker Compose', 'Kubernetes', 'Helm'],
  },
  {
    id: 'iac',
    lines: ['IaC'],
    title: 'Infrastructure as Code',
    items: ['Terraform', 'Ansible', 'Configuration Management'],
  },
  {
    id: 'observability',
    lines: ['Monitoring'],
    title: 'Monitoring & Observability',
    items: ['Datadog', 'Grafana', 'Prometheus', 'Tempo', 'Alloy', 'CloudWatch'],
  },
  {
    id: 'systems',
    lines: ['Systems &', 'Languages'],
    title: 'Systems, Servers & Languages',
    items: ['Linux (Ubuntu, CentOS)', 'Windows', 'Nginx', 'Apache', 'Tomcat', 'MySQL', 'MariaDB', 'DynamoDB', 'Python', 'Java', 'Bash / Shell', 'OOP'],
  },
];

/* -------------------------------------------------------------------------- */
/* Certifications                                                             */
/* -------------------------------------------------------------------------- */

export const CERTIFICATIONS_INTRO = {
  title: ['Verified Learning.', 'Credentials & Certificates.'],
  lead: 'Professional training in DevOps engineering practices and tooling.',
};

/**
 * Newest first. `image` (preview) and `file` (original) are optional —
 * drop a certificate scan in /public/assets/certificates and add the paths.
 * `verify` = public verification page, if any.
 */
export const CERTIFICATIONS = [
  {
    id: 'devops-foundation-skilling-academy',
    title: 'DevOps Engineer Foundation Course',
    issuer: 'Skilling Academy',
    type: 'Course Completion',
    date: 'Jan 2025',
    facts: ['CI/CD', 'Docker & Kubernetes', 'AWS & Terraform'],
  },
];

/* -------------------------------------------------------------------------- */
/* Contact                                                                    */
/* -------------------------------------------------------------------------- */

export const CONTACT = {
  title: ['Let’s Build', 'Something Reliable.'],
  lead: 'I’m open to DevOps, Cloud, and Site Reliability engineering roles — and always happy to talk CI/CD, Kubernetes, and infrastructure automation.',
  links: [
    { label: 'GitHub', href: PROFILE.github },
    { label: 'LinkedIn', href: PROFILE.linkedin },
    { label: PROFILE.phone, href: `tel:${PROFILE.phone.replace(/\s/g, '')}` },
  ],
};

/* -------------------------------------------------------------------------- */
/* Ask AI                                                                     */
/* -------------------------------------------------------------------------- */

export const ASK_AI = {
  welcome:
    "Hi! I'm Satyam's portfolio assistant. Ask me anything about his experience, skills, education, or availability.",
  quickPrompts: [
    { label: 'Experience', prompt: "What is Satyam's work experience?" },
    { label: 'Skills', prompt: 'What DevOps tools and cloud skills does Satyam have?' },
    { label: 'Education', prompt: 'Tell me about his education.' },
    { label: 'Hire', prompt: 'Is Satyam available for DevOps roles?' },
  ],
  fallback: {
    experience:
      'Satyam is currently a **DevOps Engineer at Nenosystems Consultancy Services** (Jan 2026 – Present), building CI/CD pipelines with Jenkins & GitHub Actions, managing AWS infrastructure with Terraform, and running containerized workloads on Kubernetes. Earlier he worked as a **DevOps Engineer at Inventurs Cube LLB, Indore** (Apr 2025 – Jun 2025) on Jenkins/GitLab CI pipelines, Terraform & Ansible, Docker, and Linux server operations.',
    skills:
      'Satyam works with **AWS** (EC2, IAM, S3, RDS, Lambda, Route53, SQS, SNS, CloudWatch), **CI/CD** (Jenkins, GitHub Actions, GitLab Runner), **Docker, Kubernetes & Helm**, **Terraform & Ansible**, and observability with **Datadog, Grafana, Prometheus, Tempo & Alloy**. He scripts in Python and Bash, and has a foundation in Java, Spring, and Hibernate.',
    education:
      'Satyam holds a **Master of Computer Application** from RGPV Bhopal (2023 – 2025) and a **Bachelor of Computer Application** from Barkatullah University Bhopal (2016 – 2019). He also completed the **DevOps Engineer Foundation Course** at Skilling Academy (Jan 2025).',
    availability:
      'Satyam is open to **DevOps, Cloud, and SRE roles**. You can reach him at **Satyamsinghbhadoriya922@gmail.com** or +91 8962373424. He is based in Indore, Madhya Pradesh.',
    general:
      'Satyam Singh Bhadoriya is a DevOps Engineer based in Indore with 10+ months of professional experience in CI/CD, AWS, Docker, Kubernetes, and Terraform. Ask about his experience, skills, or education — or email him at **Satyamsinghbhadoriya922@gmail.com**.',
  },
};

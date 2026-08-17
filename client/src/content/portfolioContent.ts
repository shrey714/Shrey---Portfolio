/**
 * PORTFOLIO CONTENT CONFIGURATION
 *
 * Edit the quoted values in this file to update the website. Layout, animation,
 * color, and component behavior remain in the page and stylesheet files.
 */
export const portfolioContent = {
  identity: {
    name: "Shrey Patel",
    pageDescriptor: "Portfolio · 2026",
    roleDescriptor: "Designing the connective tissue",
    location: "Bangalore, India",
    availability: "Available for considered work",
    railNote: "Built around clarity & care.",
    appearanceLabel: "Appearance",
  },

  navigation: [
    { id: "top", label: "Index", number: "00" },
    { id: "work", label: "Selected work", number: "01" },
    { id: "practice", label: "Practice", number: "02" },
    { id: "about", label: "About", number: "03" },
    { id: "contact", label: "Contact", number: "04" },
  ],

  hero: {
    roleLine: "UI Designer · Frontend Developer · UX Architect",
    heading: ["I make digital", "systems feel", "considered."],
    introduction: "I’m Shrey, a product-minded software engineer and UX researcher who enjoys turning complex problems into simple, polished experiences—from the first interface to the systems underneath.",
    workCta: "See selected work",
    contactCta: "Start a conversation",
    resume: {
      label: "Download Resume",
      // Replace this path with the uploaded PDF URL when your final resume is ready.
      url: "/resume.pdf",
      filename: "Shrey-Patel-Resume.pdf",
    },
    carouselAriaLabel: "Selected design perspectives",
    carouselSelectorLabel: "Hero visual selector",
    previousVisualLabel: "Show previous visual",
    nextVisualLabel: "Show next visual",
    basedInLabel: "Based in",
    basedInDescription: "Designing across interaction, interface, and implementation.",
    roleSnapshot: "Software Engineer @ Wells Fargo",
    focusAreas: ["Frontend interfaces", "Product systems", "User research"],
    imageUrl: "/manus-storage/shrey-hero-editorial_9f125b19.jpg",
    slides: [
      {
        label: "Systems × experience",
        caption: "A visual language where interface and engineering connect.",
        alt: "Abstract cobalt architectural forms on a warm porcelain studio surface",
      },
      {
        label: "Interface architecture",
        caption: "Turning dense workflows into deliberate, readable product surfaces.",
        alt: "Abstract interface architecture composition",
        metaLeft: "Interface / 02",
        metaRight: "Flow state",
        annotation: "Readable flows / intentional states",
      },
      {
        label: "System thinking",
        caption: "Following the path from signal to decision to response.",
        alt: "Abstract system flow composition",
        metaLeft: "Systems / 03",
        metaRight: "Signal map",
        annotation: "From signal to response",
        nodes: ["Signal", "Decision", "Response"],
      },
      {
        label: "Detail as a feature",
        caption: "The small decisions that make a product feel complete.",
        alt: "Abstract editorial detail composition",
        metaLeft: "Details / 04",
        metaRight: "Field note",
        annotation: "Small choices, considered",
      },
    ],
  },

  work: {
    eyebrow: "Selected work",
    heading: "Products with a clear point of view.",
    introduction: "A small selection of systems where interface thinking and engineering have to work together.",
    projects: [
      {
        kind: "clinic" as const,
        meta: "01 — Product system",
        date: "2025",
        name: "DardiBook",
        type: "Clinic management platform",
        description: "A digital workspace that brings authentication, real-time collaboration, operational state, and subscription experiences into one calmer clinical workflow.",
        technologies: ["Next.js", "Firebase", "Liveblocks", "Razorpay"],
        cta: "Discuss this case study",
        ariaLabel: "Discuss the DardiBook project",
        visualMeta: "DardiBook / workflow",
        visualTitle: "Operational care, in view",
        visualRows: ["Patient flow", "Team handoff", "Billing state"],
      },
      {
        kind: "commerce" as const,
        meta: "02 — Commerce system",
        date: "In progress",
        name: "Shopkeeper AI",
        type: "Inventory & online store management",
        description: "One ecosystem for shopkeepers: a native mobile experience for day-to-day inventory and a customer-facing storefront for turning stock into commerce.",
        technologies: ["Expo", "React", "TypeScript", "Supabase"],
        cta: "Ask about the build",
        ariaLabel: "Discuss the Shopkeeper AI project",
        visualMeta: "Shopkeeper AI / operations",
        visualTitle: "Inventory, from shelf to storefront",
        visualRows: ["Catalog signal", "Stock health", "Store orders"],
      },
    ],
  },

  practice: {
    eyebrow: "Practice",
    heading: "The work behind the work.",
    introduction: "I work best in the space between a messy problem and a usable system. That means thinking through flows, asking sharper questions, shaping the interface, and staying close enough to implementation that the details hold up.",
    visualFlow: "Flow",
    visualSystemNote: "Signal / decision / response",
    visualTag: "System note 01",
    visualCallout: "Detail is part of the system.",
    disciplines: [
      { title: "Interface design", text: "Making complex workflows clear, calm, and easy to navigate." },
      { title: "UX architecture", text: "Mapping decisions, edge cases, and information before they become interface debt." },
      { title: "Frontend craft", text: "Translating systems into responsive, resilient interfaces with considered detail." },
      { title: "Research mindset", text: "Watching for assumptions, asking why, and letting real constraints shape the answer." },
    ],
    skills: [
      { name: "Frontend", tools: "React · Next.js · TypeScript" },
      { name: "Backend", tools: "Java · Spring · REST APIs" },
      { name: "Data", tools: "SQL · Firestore · DuckDB" },
      { name: "Architecture", tools: "Systems · Events · Scale" },
    ],
  },

  about: {
    eyebrow: "About",
    heading: "A little about me.",
    experienceLabel: "2+ years of experience",
    statement: "I studied Computer Science and Engineering at SVNIT Surat and now work as a Software Developer at Wells Fargo. I care about what software does under the hood—and how it feels in the hands of the person using it.",
    description: "My work has taken me across frontend development, backend engineering, databases, and risk technology. I particularly enjoy problems where the answer is not obvious: understanding the constraints, breaking the work down, and shaping an experience that can scale.",
    facts: [
      { label: "Now", primary: "Software Developer", secondary: "Wells Fargo" },
      { label: "Education", primary: "B.Tech, CSE", secondary: "SVNIT Surat" },
      { label: "Focus", primary: "Product systems", secondary: "Interface to data" },
    ],
  },

  experience: {
    eyebrow: "Experience",
    introduction: "A factual, understated snapshot of the work I do and the systems I want to keep learning from.",
    company: "Wells Fargo",
    role: "Software Developer · Market Risk",
    date: "2024 — Present",
    description: "Contributing to applications and services that support quantitative risk-management and risk-adjustment workflows. The work stretches across frontend, backend, data, and the technical decisions that connect them.",
    responsibilityLabel: "Current engineering responsibilities",
    responsibilities: [
      "Crafting interface architecture with React and TypeScript.",
      "Designing Java and Spring services around real operational constraints.",
      "Working across SQL data flows, business logic, and user-facing product details.",
    ],
  },

  philosophy: {
    eyebrow: "Engineering philosophy",
    headingLineOne: "How I think",
    headingLineTwo: "about software.",
    introduction: "A few principles I return to when systems, screens, or product decisions get more complex.",
    principles: [
      { number: "01", title: "Keep it simple.", text: "Complexity should solve a real problem. If it does not, it is probably just complexity." },
      { number: "02", title: "Build for the person using it.", text: "Technical decisions matter, but software ultimately exists to make someone’s work or life better." },
      { number: "03", title: "Understand before optimizing.", text: "Measure, find the bottleneck, then make it faster—with a reason for every change." },
      { number: "04", title: "Make it maintainable.", text: "The best decision survives the next six months, including the person who has to maintain it." },
    ],
  },

  contact: {
    eyebrow: "Contact",
    introduction: "Have an interesting idea, a technical problem to explore, or simply want to compare notes?",
    headingLineOne: "Let’s build",
    headingLineTwo: "something clear.",
    email: "hello@shreypatel.dev",
    githubUrl: "https://github.com/",
    linkedinUrl: "https://www.linkedin.com/",
    githubLabel: "GitHub",
    linkedinLabel: "LinkedIn",
    emailLabel: "Email",
    form: {
      eyebrow: "Send a note",
      heading: "Tell me what you’re building.",
      nameLabel: "Name",
      emailLabel: "Email",
      messageLabel: "Message",
      namePlaceholder: "Your name",
      emailPlaceholder: "you@example.com",
      messagePlaceholder: "A little context about your idea, team, or technical challenge…",
      submitLabel: "Send securely",
      submittingLabel: "Sending…",
      successMessage: "Message sent. I’ll get back to you soon.",
      fallbackMessage: "For longer context, you can also email directly.",
      privacyNote: "Your message is delivered privately and is not stored on this website.",
    },
  },

  footer: {
    left: "Built with clarity & care.",
    right: "UI · Frontend · UX · Systems",
  },

  ui: {
    homeAriaLabel: "Shrey Patel home",
    mobileNavigationLabel: "Mobile navigation",
    sectionNavigationLabel: "Section navigation",
    navigateLabel: "Navigate",
    themeLightLabel: "Switch to light mode",
    themeDarkLabel: "Switch to dark mode",
  },
};

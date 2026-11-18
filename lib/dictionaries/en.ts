/* English copy. Keep the same structure as es.ts.
   TODO(CLIENTE): have an English teacher at the school review this text. */
import { ADDRESS_LINE, PHONE_DISPLAY } from "@/lib/site";
import type { Dict } from "./es";

const HOURS = "Monday to Friday, 7:00 a.m. – 5:00 p.m.";

export const en: Dict = {
  meta: {
    siteName: "Howard Gardner Bilingual School",
    description:
      "Bilingual school in Sabanalarga, Atlántico, Colombia, from Pre-K to 11th grade. The only A+ school in Sabanalarga and ranked first in town on the 2026 ICFES school index. An Oxford Quality school. Enrollment for 2027 is open.",
    pages: {
      home: { title: "Bilingual school in Sabanalarga, Colombia | Howard Gardner Bilingual School", description: "" },
      about: { title: "About us", description: "16 years educating children and teenagers in Sabanalarga, in Spanish and English. Meet the school and read our principal's message." },
      learning: { title: "Learning: grade levels, bilingual program and teaching approach", description: "Pre-K, Elementary, Middle School and High School with a bilingual program, Oxford Quality and the theory of multiple intelligences." },
      achievements: { title: "Achievements and ICFES results", description: "The only A+ school in Sabanalarga and first in town on the 2026 ICFES school index. Results and school news." },
      admissions: { title: "Admissions 2027", description: "Enrollment for 2027 is open, from Pre-K to 11th grade. Learn about the process and send your pre-registration." },
      contact: { title: "Contact and location", description: `Visit us at ${ADDRESS_LINE}, Colombia. Phone and WhatsApp +57 ${PHONE_DISPLAY}.` },
      pqrsf: { title: "Requests, complaints and suggestions (PQRSF)", description: "Submit a request, complaint, claim, suggestion or compliment and check its status with your reference number." },
      privacy: { title: "Personal Data Policy", description: "Personal data processing policy under Colombian Law 1581 of 2012." },
    },
  },

  common: {
    skip: "Skip to content",
    enroll: "Admissions 2027",
    visit: "Book a visit",
    call: "Call",
    whatsapp: "Message us on WhatsApp",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    home: "Home",
    language: "Language",
    langNames: { es: "Español", en: "English" },
    backHome: "Back to home",
  },

  wa: {
    admissions: "Hello, I would like information about 2027 admissions at Howard Gardner Bilingual School.",
    visit: "Hello, I would like to book a visit to Howard Gardner Bilingual School.",
  },

  nav: [
    {
      label: "About us",
      page: "about",
      items: [
        { label: "Who we are", page: "about", hash: "historia" },
        { label: "Principal's message", page: "about", hash: "rector" },
      ],
    },
    {
      label: "Learning",
      page: "learning",
      items: [
        { label: "Grade levels", page: "learning", hash: "niveles" },
        { label: "Pre-K and Kindergarten", page: "learning", hash: "preescolar" },
        { label: "Elementary School", page: "learning", hash: "primaria" },
        { label: "Middle School", page: "learning", hash: "secundaria" },
        { label: "High School", page: "learning", hash: "media" },
        { label: "Bilingual program and Oxford Quality", page: "learning", hash: "bilinguismo" },
        { label: "Multiple intelligences", page: "learning", hash: "pedagogia" },
      ],
    },
    {
      label: "Admissions",
      page: "admissions",
      items: [
        { label: "Admissions process", page: "admissions", hash: "proceso" },
        { label: "2027 pre-registration", page: "admissions", hash: "preinscripcion" },
        { label: "FAQ", page: "admissions", hash: "preguntas" },
      ],
    },
    {
      label: "Achievements",
      page: "achievements",
      items: [
        { label: "ICFES results", page: "achievements", hash: "resultados" },
        { label: "News", page: "achievements", hash: "noticias" },
      ],
    },
    {
      label: "Contact",
      page: "contact",
      items: [
        { label: "Visit us", page: "contact", hash: "visitanos" },
        { label: "Requests & complaints (PQRSF)", page: "pqrsf", hash: "radicar" },
        { label: "Check my request", page: "pqrsf", hash: "consultar" },
      ],
    },
  ],

  hero: {
    eyebrow: "Sabanalarga, Colombia · Pre-K to 11th grade",
    title: ["The ", "number one", " bilingual school in Sabanalarga."],
    lead: "The only school in Sabanalarga rated A+ on the 2026 ICFES school index, Colombia's national ranking. For 16 years we have taught children and teenagers in Spanish and English, from Pre-K through 11th grade.",
    stats: [
      ["A+", "ICFES rating 2026"],
      ["#1", "in Sabanalarga"],
      ["16", "years of teaching"],
    ],
    photoAlt: "Tree-lined playground and play areas at Howard Gardner school in Sabanalarga",
  },

  about: {
    eyebrow: "Who we are",
    title: "16 years of teaching in Sabanalarga.",
    paragraphs: [
      "Howard Gardner Bilingual School is a private bilingual school in Sabanalarga, Atlántico, Colombia. We walk with our students from Pre-K to 11th grade, with classes in Spanish and English and the same team all the way through.",
      "We are named after psychologist Howard Gardner because, like him, we believe every child is intelligent in their own way. That belief, together with high academic standards, has made us the only A+ school in Sabanalarga according to ICFES and a member of Oxford Quality.",
    ],
    motto: "Your Vision Is Our Inspiration",
    facts: [
      ["16", "years of history"],
      ["A+", "the only one in Sabanalarga"],
      ["2", "languages, every day"],
    ],
  },

  results: {
    eyebrow: "ICFES school index · 2026",
    title: "The only A+ school in Sabanalarga.",
    lead: "A+ is the highest performance level in Colombia on Saber 11°, the national exit exam. ICFES gives it to the school, not to an individual student: it reflects the work of the whole school over several years.",
    bigLabel: ["ICFES", "rating 2026"],
    bigAria: "A+ rating",
    facts: [
      { n: "#1", t: "In Sabanalarga", d: "First in town on the 2026 ICFES school index, with an index of 0.7783." },
      { n: "71st", t: "In Atlántico", d: "Out of 540 schools assessed in the department in 2026." },
      { n: "88th", t: "Department ICFES index", d: "Out of 553 schools in Atlántico, according to the 2026 ICFES school index." },
      { n: "16", t: "Years of teaching", d: "Educating children and teenagers in Sabanalarga from Pre-K to 11th grade." },
    ],
    areasTitle: "Saber 11° 2025 · town ranking by subject",
    areasLead: "First in town with an overall score of 297, up 13 points from 2024.",
    areasCaption: "Town ranking by subject in Saber 11° 2025",
    areaCol: "Subject",
    placeCol: "Place",
    areas: [
      { area: "Mathematics", place: "1st place", first: true },
      { area: "Social Studies", place: "1st place", first: true },
      { area: "Critical Reading", place: "1st place", first: true },
      { area: "Natural Sciences", place: "2nd place", first: false },
    ],
  },

  levels: {
    eyebrow: "Our program",
    title: "Four stages, one bilingual path.",
    lead: "A continuous journey from age three to 11th grade, with the same team and the same philosophy.",
    items: [
      { id: "preescolar", name: "Pre-K and Kindergarten", grades: "Prejardín, Jardín and Transición", ages: "Ages 3 to 5", desc: "First steps in a bilingual setting where play and exploration spark every child's curiosity." },
      { id: "primaria", name: "Elementary School", grades: "1st to 5th grade", ages: "Ages 6 to 10", desc: "Strong foundations in reading, writing, math and English, with critical thinking and values from an early age." },
      { id: "secundaria", name: "Middle School", grades: "6th to 9th grade", ages: "Ages 11 to 14", desc: "Deeper learning across every subject with a bilingual, hands-on approach that prepares students for high school." },
      { id: "media", name: "High School", grades: "10th and 11th grade", ages: "Ages 15 to 17", desc: "Preparation for the Saber 11° national exam and guidance for university and working life." },
    ],
  },

  bilingual: {
    eyebrow: "Bilingual program",
    title: ["Spanish and English, ", "every day."],
    lead: "We are officially part of Oxford Quality: our students learn English with trusted, world-class resources from Pre-K to 11th grade, so they reach university and the world with a second language of their own.",
    points: [
      "Oxford Quality school: we work with Oxford University Press.",
      "The only bilingual school in Sabanalarga.",
      "English from Pre-K, as part of everyday life.",
      "Bilingual classes across different subjects.",
      "Strong English scores on Saber 11° 2025.",
    ],
    imgAlt: "Announcement: we are officially part of Oxford Quality, working with Oxford University Press",
  },

  pedagogy: {
    eyebrow: "How we teach",
    title: "Eight ways to be smart.",
    lead: "We are named after Harvard psychologist Howard Gardner, who proposed the theory of multiple intelligences in 1983. That is why we don't measure every child with the same yardstick: we look for each student's talent and help it grow.",
    intelligences: ["Linguistic", "Logical-mathematical", "Spatial", "Bodily-kinesthetic", "Musical", "Interpersonal", "Intrapersonal", "Naturalistic"],
    button: "Meet Howard Gardner",
    openLabel: "Open the series Who is Howard Gardner? (9 slides, in Spanish)",
    imgAlt: "Portrait of Howard Gardner, creator of the theory of multiple intelligences",
    slides: [
      "Howard Gardner, creator of the theory of multiple intelligences",
      "Who is he? Born in 1943 in Pennsylvania",
      "Who inspired him? Piaget, Erikson and Bruner",
      "His main contribution: the theory of multiple intelligences (1983)",
      "How many types of intelligence are there? Eight",
      "Linguistic, logical-mathematical and spatial intelligence",
      "Bodily-kinesthetic, musical and interpersonal intelligence",
      "Intrapersonal and naturalistic intelligence",
      "Happy 82nd birthday, Howard Gardner",
    ],
  },

  rector: {
    eyebrow: "A word from our principal",
    quote: "“Every student has unique potential. Our job is to awaken it through excellent bilingual education, strong values and close, personal support.”",
    body: "Our results speak for us, but what makes us proudest is the young people we educate: people of integrity, ready to build the future of Sabanalarga and Colombia.",
    name: "Julián David Cuentas Navarro",
    role: "Principal · Howard Gardner Bilingual School",
    photoAlt: "Julián David Cuentas Navarro, principal of the school",
  },

  gallery: {
    eyebrow: "News",
    title: "Good news to share with our families.",
    instagram: "Follow us on Instagram",
    seeAll: "See all news",
    enlarge: "Enlarge",
    items: [
      "Good news this November: we are the only A+ school in Sabanalarga on the 2026 ICFES index",
      "2026 ICFES school index town ranking: Howard Gardner in first place in Sabanalarga",
      "In 2026 we ranked 71st out of 540 schools in Atlántico and 88th out of 553 on the ICFES index",
      "Enrollment for 2027 is open: 16 years of quality education",
      "First place in the 2025 ICFES town ranking with 297 points and an A+ rating",
      "2025 first places in Mathematics, Social Studies and Critical Reading",
      "The best school in Sabanalarga according to the Milton Ochoa ranking, A+ 2025",
      "Leaders in bilingual education in Sabanalarga",
    ],
  },

  viewer: { label: "Image viewer", close: "Close", prev: "Previous image", next: "Next image" },

  admissionsBand: {
    eyebrow: "Admissions 2027",
    title: "Enrollment for 2027 is open.",
    lead: "From Pre-K to 11th grade. Learn about the process, send your pre-registration or message us on WhatsApp.",
    button: "See the admissions process",
  },

  admissions: {
    eyebrow: "Admissions and enrollment 2027",
    title: "How admissions work.",
    lead: "From Pre-K to 11th grade. We reply on WhatsApp during office hours.",
    steps: [
      { t: "Get in touch", d: "Tell us which grade your child is applying for, on WhatsApp or through the pre-registration form." },
      { t: "Visit the school", d: "We schedule a tour so you can see the campus and meet the team." },
      { t: "Enrollment", d: "We send you the requirements and guide you through enrollment." },
    ],
    callPrompt: "Prefer to call?",
    form: {
      title: "2027 pre-registration",
      lead: "You get a request number and the school contacts you.",
      name: "Parent or guardian's name *",
      phone: "Phone / WhatsApp *",
      grade: "Grade of interest *",
      gradePlaceholder: "Choose a grade",
      message: "Message (optional)",
      consent: ["I authorize the processing of my personal data under the ", "Personal Data Policy", " (Colombian Law 1581 of 2012)."],
      submit: "Send pre-registration",
      successTitle: "Pre-registration received!",
      successNumber: "Your request number",
      successBody: "The school will contact you soon. You can also continue the conversation on WhatsApp.",
      continueWa: "Continue on WhatsApp",
      another: "Send another pre-registration",
      waNumber: "Request",
      errors: {
        name: "Please enter your full name.",
        phone: "Please enter a valid contact number.",
        grade: "Please choose a grade.",
        consent: "You need to authorize data processing to continue.",
      },
      grades: ["Pre-K 3 (Prejardín)", "Pre-K 4 (Jardín)", "Kindergarten (Transición)", "1st grade", "2nd grade", "3rd grade", "4th grade", "5th grade", "6th grade", "7th grade", "8th grade", "9th grade", "10th grade", "11th grade"],
      waIntro: "Hello, I would like information about 2027 admissions and enrollment.",
      waName: "Name",
      waPhone: "Phone",
      waGrade: "Grade of interest",
      waMessage: "Message",
      waConsent: "(I authorize the processing of my data under the school's policy.)",
    },
  },

  faq: {
    eyebrow: "FAQ",
    title: "What families ask us most.",
    items: [
      { q: "Where is the school?", a: `At ${ADDRESS_LINE}, Colombia. You can see the map and get directions on the Contact page.` },
      { q: "Which grades do you offer?", a: "From Pre-K (Prejardín, Jardín and Transición) to 11th grade: Elementary, Middle School and High School." },
      { q: "Is the school bilingual?", a: "Yes. We are the only bilingual school in Sabanalarga, and English is part of every student's education from Pre-K." },
      { q: "What does an A+ rating mean?", a: "An A+ rating from ICFES means the school (not an individual student) is at the highest performance level in Colombia on the Saber 11° national exam. We are the only school in Sabanalarga with this rating on the 2026 ICFES school index." },
      { q: "How have your students done on Saber 11°?", a: "On the 2026 ICFES school index we ranked first in Sabanalarga and 88th out of 553 schools in Atlántico. In 2026 we also ranked 71st out of 540 schools assessed in the department. In 2025 we were first in town with an overall score of 297." },
      { q: "What is Oxford Quality?", a: "We are officially part of Oxford Quality, working with Oxford University Press. For our students, it means learning English with trusted, world-class resources." },
      { q: "How do I enroll my child for 2027?", a: `Send the pre-registration form, message us on WhatsApp or call us at +57 ${PHONE_DISPLAY}. We will tell you about requirements and fees and schedule a visit to the school.` },
      { q: "What are your office hours?", a: `${HOURS}.` },
    ],
  },

  visit: {
    eyebrow: "Visit us",
    title: "Find us on Calle 12, Sabanalarga.",
    address: "Address",
    phone: "Phone",
    whatsapp: "WhatsApp",
    hoursLabel: "Office hours",
    hours: HOURS,
    directions: "Get directions",
    mapTitle: "Map: location of Howard Gardner school in Sabanalarga",
    instagram: "School Instagram",
    facebook: "School Facebook",
  },

  pageHeaders: {
    about: { eyebrow: "About us", title: "A school that believes in every student's talent.", lead: "Our story, what drives us and a message from our principal." },
    learning: { eyebrow: "Learning", title: "From Pre-K to 11th grade, in two languages.", lead: "Our grade levels, the bilingual program with Oxford Quality and our multiple-intelligences approach." },
    achievements: { eyebrow: "Achievements", title: "Results that speak for our students.", lead: "Our ICFES results and the good news we share with our community." },
    admissions: { eyebrow: "Admissions 2027", title: "Enrollment is open.", lead: "Learn about the process, send your pre-registration and get answers to your questions." },
    contact: { eyebrow: "Contact", title: "Let's talk.", lead: "Message us, call us or visit us in Sabanalarga. We are happy to help." },
    pqrsf: { eyebrow: "Requests & complaints", title: "Your feedback helps us improve.", lead: "Submit a request, complaint, claim, suggestion or compliment. You get a reference number to check its status." },
  },

  footer: {
    schoolTitle: "The school",
    contactTitle: "Contact",
    privacy: "Personal Data Policy",
    credit: "Website by",
    links: [
      { label: "Who we are", page: "about" },
      { label: "Learning", page: "learning" },
      { label: "Achievements", page: "achievements" },
      { label: "Admissions 2027", page: "admissions" },
      { label: "Contact", page: "contact" },
      { label: "Requests & complaints", page: "pqrsf" },
    ],
    admin: "Staff login",
  },

  privacy: {
    eyebrow: "Colombian Law 1581 of 2012 · Decree 1377 of 2013",
    title: "Personal Data Policy",
    note: "This is a reference translation. The Spanish version is the legally binding one.",
    sections: [
      { h: "1. Data controller", p: ["{LEGAL}, tax ID (NIT) {NIT}, located at {ADDRESS}, Colombia. Phone: {PHONE}."] },
      { h: "2. Data we collect", p: ["Name, phone number and any information families voluntarily share through the website forms and our contact channels, in order to answer information and admission requests."] },
      { h: "3. Purposes", list: ["To answer requests for information about the school and the admissions process.", "To schedule visits and follow up on enrollment requests.", "To send school information related to the data subject's request."] },
      { h: "4. Data of children and teenagers", p: ["Data of minors is processed respecting their best interests and fundamental rights, and always with the authorization of their legal guardian."] },
      { h: "5. Data subject rights", list: ["To access, update and correct their personal data.", "To request proof of the authorization given.", "To be informed of how their data has been used.", "To revoke the authorization or request deletion of their data when applicable.", "To file complaints with the Superintendence of Industry and Commerce (SIC).", "To access their personal data free of charge."] },
      { h: "6. Inquiries and claims", p: ["Inquiries will be answered within ten (10) business days and claims within fifteen (15) business days of receipt, by phone at {PHONE} or at the school."] },
      { h: "7. Effective date", p: ["This policy is effective from its publication. Data will be kept for as long as necessary to fulfill the purposes described."] },
    ],
  },

  demo: {
    badge: "Demo",
    note: "Demo version: data is stored only in this browser and is not sent to any server. Please don't enter real information.",
  },

  pqrsf: {
    formEyebrow: "Submit",
    formTitle: "Submit your request",
    type: "Type of request *",
    types: { peticion: "Request", queja: "Complaint", reclamo: "Claim", sugerencia: "Suggestion", felicitacion: "Compliment" },
    typeHelp: {
      peticion: "You ask the school for information, a document or an action.",
      queja: "You are unhappy with someone's conduct.",
      reclamo: "You are unhappy with a service or a charge.",
      sugerencia: "You propose an idea to improve.",
      felicitacion: "You recognize something we did well.",
    },
    name: "Parent or guardian's name *",
    email: "Email *",
    phone: "Phone",
    student: "Student's name (if applicable)",
    grade: "Grade",
    gradePlaceholder: "Choose a grade",
    subject: "Subject *",
    description: "Description *",
    urgent: "It's urgent: it affects the student's safety, health or well-being.",
    urgentHelp: "Urgent requests get high priority and are answered within 5 business days at the latest.",
    attachment: "Attachment (optional)",
    attachmentHelp: "PDF or image. In this demo only the file name is saved.",
    consent: ["I authorize the processing of my personal data under the ", "Personal Data Policy", " (Colombian Law 1581 of 2012)."],
    submit: "Submit request",
    errors: {
      type: "Please choose the type of request.",
      name: "Please enter your full name.",
      email: "Please enter a valid email.",
      subject: "Please enter a subject.",
      description: "Please describe your request (at least 20 characters).",
      consent: "You need to authorize data processing to continue.",
    },
    successTitle: "Request submitted!",
    successNumber: "Your reference number",
    successBody: "Keep it to check the status. The school replies within {DAYS} business days at the latest.",
    another: "Submit another request",
    lookupEyebrow: "Check",
    lookupTitle: "Check the status of your request",
    lookupLabel: "Reference number",
    lookupPlaceholder: "PQRSF-2026-0001",
    lookupButton: "Check",
    lookupNotFound: "We couldn't find that reference number. Please check it.",
    lookupStatus: "Status",
    lookupCreated: "Submitted on",
    lookupDue: "Reply due by",
    lookupPriority: "Priority",
    priorities: { alta: "High", media: "Medium", baja: "Low" },
    lookupAnswer: "School's reply",
    statuses: { radicada: "Submitted", en_tramite: "In progress", respondida: "Answered", cerrada: "Closed" },
    infoTitle: "How it works",
    info: [
      "You submit your request and get a reference number.",
      "The school assigns it to the person in charge.",
      "You get a reply within {DAYS} business days at the latest.",
      "You can check the status anytime with your number.",
    ],
  },

  notFound: {
    title: "We couldn't find this page.",
    body: "The address may have changed. Please go back to the home page.",
  },
};

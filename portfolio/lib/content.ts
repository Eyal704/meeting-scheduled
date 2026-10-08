export type Project = {
  slug: string;
  number: string;
  name: string;
  subtitle: string;
  description: string;
  tags: string[];
  media: string;
  duration: string;
  portrait?: boolean;
  problem: string;
  built: string;
  steps: string[];
  architecture: string;
  components: string[];
  value: string;
  takeaway: string;
};

export const projects: Project[] = [
  {
    slug: "meetingscheduled",
    number: "01",
    name: "MeetingScheduled",
    subtitle: "AI Outbound Operating System",
    description:
      "An AI-powered outbound system that identifies relevant companies and decision-makers, researches prospects, generates signals and personalized outreach, and manages a complete outbound cadence.",
    tags: ["AI research", "Outbound", "Workflow automation"],
    media: "meetingscheduled",
    duration: "4:01",
    problem:
      "Outbound work spans company research, identifying decision-makers, writing outreach and managing follow-up. Without a connected workflow, each step is handled separately and context is lost between them.",
    built:
      "An AI-powered outbound operating system that connects prospect identification and research with buying signals, personalized messaging and a complete outbound cadence. The demo shows the working pipeline interface.",
    steps: [
      "Identify relevant companies",
      "Find decision-makers",
      "Research & generate signals",
      "Personalize outreach",
      "Manage the outbound cadence",
    ],
    architecture:
      "The system is organized around the outbound workflow: research and signal generation inform personalized messaging, which drives a staged outreach cadence managed in a single pipeline.",
    components: [
      "Research and enrichment data sources",
      "LLM-based research, signal and message generation",
      "Cadence scheduling and follow-up logic",
      "Pipeline data model and hosted deployment",
    ],
    value:
      "Brings research and outreach into one connected workflow, giving teams a clear path from identifying a relevant company to managing follow-up.",
    takeaway:
      "The useful unit of outbound automation is the complete workflow: research needs to inform outreach, and outreach needs a clear next step.",
  },
  {
    slug: "ai-voice-agent",
    number: "02",
    name: "AI Voice Agent",
    subtitle: "Inbound & Outbound Calling",
    description:
      "A production voice workflow that handles inbound calls, qualifies leads, answers questions, books meetings and can automatically call new leads generated through a website.",
    tags: ["Voice AI", "Lead qualification", "Meeting booking"],
    media: "voice-agent",
    duration: "1:47",
    problem:
      "New leads and incoming calls require a fast, useful response. Qualifying the caller, answering questions and arranging a meeting are parts of the same first conversation.",
    built:
      "A production voice workflow for inbound calls and outbound follow-up to new website leads. The agent qualifies leads, answers questions and books meetings. The demo shows the voice-agent configuration in Retell AI.",
    steps: [
      "Inbound call / new website lead",
      "Voice conversation",
      "Answer questions & qualify",
      "Book a meeting",
      "Continue the lead workflow",
    ],
    architecture:
      "Built on Retell AI, with a conversational voice-agent workflow and structured post-call data extraction. New website leads trigger an outbound call, and booked meetings continue into the sales workflow.",
    components: [
      "Website lead trigger and webhook integration",
      "Telephony configuration and number routing",
      "Knowledge sources and calendar integration",
      "Fallback handling, monitoring and evaluation",
    ],
    value:
      "Connects the first conversation to a concrete commercial next step: a qualified lead or a booked meeting.",
    takeaway:
      "A voice experience has to connect the conversation to the next business action; a successful exchange is only one part of the workflow.",
  },
  {
    slug: "speed-dialer",
    number: "03",
    name: "Speed Dialer",
    subtitle: "Multi-Line Outbound Calling",
    description:
      "A calling system connected to multiple phone numbers with lead queues, dialing workflows, call-status tracking and structured follow-up.",
    tags: ["Calling systems", "Lead queues", "Sales operations"],
    media: "speed-dialer",
    duration: "1:49",
    portrait: true,
    problem:
      "Outbound calling requires more than placing a call. Representatives need the right lead, an efficient calling flow, a record of each outcome and a clear next action.",
    built:
      "A calling system connected to multiple phone numbers, combining lead queues, dialing, call-status tracking and follow-up in a single workflow. The mobile demo shows lead selection, number options, call scripts and outcome controls.",
    steps: [
      "Select a lead queue",
      "Choose a calling number",
      "Place the call",
      "Record the call outcome",
      "Follow up / move to next lead",
    ],
    architecture:
      "A mobile-first calling interface backed by lead queues and multiple outbound numbers. Each call outcome is recorded against the lead and determines the next action in the queue.",
    components: [
      "Telephony integration and number management",
      "Dialing orchestration",
      "Call-status events and retry rules",
      "Lead storage and CRM synchronization",
    ],
    value:
      "Gives outbound teams a structured way to work through lead lists while retaining every call outcome for follow-up.",
    takeaway:
      "Fast dialing is useful when lead context, outcome tracking and the next action stay together. The surrounding workflow matters as much as the call.",
  },
  {
    slug: "crm-revenue-systems",
    number: "04",
    name: "CRM & Revenue Systems",
    subtitle: "From Workflow to Revenue",
    description:
      "Custom CRM and sales workflows connecting prospecting, calling, follow-up, pipeline management and reporting.",
    tags: ["CRM", "Pipeline management", "Revenue operations"],
    media: "crm",
    duration: "0:48",
    problem:
      "Prospecting, calls and follow-ups generate activity. A revenue team also needs a shared view of each lead's status, the next step and its position in the pipeline.",
    built:
      "Custom CRM and sales workflows connecting prospecting, calling, follow-up, pipeline management and reporting. The demo shows leads organized by status, with next steps and call activity.",
    steps: [
      "Capture the prospect",
      "Track calls & conversations",
      "Set the next step",
      "Manage pipeline stages",
      "Report on sales activity",
    ],
    architecture:
      "A CRM built around the sales workflow: leads, activities and next steps are stored together, call activity is recorded against each lead, and pipeline stages feed reporting.",
    components: [
      "Lead, activity and opportunity data model",
      "Calling integration and event handling",
      "User permissions and data access",
      "Pipeline reporting",
    ],
    value:
      "Connects individual sales actions to a visible pipeline, so teams can see status and follow-up at a glance.",
    takeaway:
      "A useful CRM connects what just happened to what needs to happen next, making the pipeline a working tool for the team.",
  },
];

export const metrics = [
  { value: "$4M+", label: "Qualified Pipeline Generated" },
  { value: "~$700K", label: "Contributed in Closed Business" },
  { value: "150%", label: "Annual Quota Attainment" },
  { value: "8+ Years", label: "GTM, Sales & AI Automation" },
];

export const toolNames = [
  "Claude",
  "Codex",
  "Next.js",
  "Supabase/Postgres",
  "Vercel",
  "APIs",
  "LLMs",
  "Voice AI",
  "CRM integrations",
];
export const companies = [
  { name: "Incredibuild", url: "https://incredibuild.com" },
  { name: "Epox.ai", url: "https://epox.ai" },
  { name: "RampedUp", url: "https://rampedup.io" },
  { name: "Twingo.co.il", url: "https://twingo.co.il" },
  { name: "SingleStore", url: "https://singlestore.com" },
];

export type Evidence = {
  id: string;
  image: string;
  category: string;
  title: string;
  caption: string;
  alt: string;
  fit?: "contain";
};
export const evidence: Evidence[] = [
  {
    id: "closed-won",
    image: "closed-won",
    category: "Closed business",
    title: "$367K closed business, recorded in Salesforce.",
    caption:
      "Original Salesforce snapshot of Eyal’s Closed Won dashboard. A single point-in-time record, separate from the career figures above.",
    alt: "Salesforce dashboard titled Eyal’s Closed Won showing USD 367K",
    fit: "contain",
  },
  {
    id: "gdc",
    image: "gdc",
    category: "Industry events",
    title: "Game Developers Conference.",
    caption:
      "Representing Incredibuild at GDC and presenting technical product capabilities to engineering audiences.",
    alt: "Eyal at the Incredibuild booth at the Game Developers Conference",
  },
  {
    id: "discovery",
    image: "discovery-1",
    category: "Customer discovery",
    title: "Customer discovery meetings.",
    caption: "A customer discovery meeting from Eyal’s commercial work.",
    alt: "Eyal participating in a remote customer discovery conversation",
  },
  {
    id: "pipeline",
    image: "pipeline",
    category: "Pipeline",
    title: "$418K pipeline snapshot.",
    caption:
      "Eyal’s Salesforce dashboard with meetings, opportunities and a USD 418K pipeline. A point-in-time record.",
    alt: "Eyal’s Salesforce dashboard showing meetings, opportunities and USD 418K pipeline",
    fit: "contain",
  },
  {
    id: "sql",
    image: "sql",
    category: "Qualified opportunities",
    title: "Sales-qualified opportunities.",
    caption:
      "BDR dashboard showing Eyal’s SQL count alongside team opportunity and meeting activity.",
    alt: "Salesforce BDR SQL dashboard with Eyal Shoval at 15 and team activity charts",
    fit: "contain",
  },
  {
    id: "quarterly",
    image: "quarterly",
    category: "Sales operations",
    title: "Quarterly sales reporting.",
    caption:
      "Quarterly team report covering sales-qualified leads, opportunities and meetings. Team totals are not attributed to Eyal individually.",
    alt: "Incredibuild quarterly team dashboard for SQLs, opportunities and scheduled meetings",
    fit: "contain",
  },
  {
    id: "event",
    image: "event",
    category: "Industry events",
    title: "Professional events.",
    caption: "In-person commercial conversations at a professional event.",
    alt: "Eyal speaking with a group of people at a professional event",
  },
  {
    id: "discovery-2",
    image: "discovery-2",
    category: "Customer discovery",
    title: "Technical stakeholder meetings.",
    caption: "A video meeting with customer technical stakeholders.",
    alt: "Eyal and technical stakeholders on an Incredibuild video meeting",
  },
  {
    id: "discovery-3",
    image: "discovery-3",
    category: "Customer discovery",
    title: "Technical discovery.",
    caption: "A remote technical discovery meeting.",
    alt: "Eyal listening during a remote technical discovery meeting",
  },
  {
    id: "discovery-4",
    image: "discovery-4",
    category: "Customer discovery",
    title: "Requirements and next steps.",
    caption: "A customer call defining business requirements and next steps.",
    alt: "Eyal discussing business needs in a customer video call",
  },
];

// Edited from the supplied product recordings, with matching English subtitles.
export const workReel = {
  src: "/media/eyal-90-seconds-v2.mp4",
  poster: "/media/eyal-90-seconds-poster.webp",
};

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
  missing: string[];
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
      "Outbound work spans company research, finding decision-makers, writing outreach and following up. Connecting those activities into a usable workflow is the business problem this system addresses.",
    built:
      "An AI-powered outbound operating system that connects prospect identification and research with signals, personalized messaging and a complete outbound cadence. The supplied recording shows the working pipeline interface.",
    steps: [
      "Identify relevant companies",
      "Find decision-makers",
      "Research & generate signals",
      "Personalize outreach",
      "Manage the outbound cadence",
    ],
    architecture:
      "The workflow below reflects the supplied project description. The demo shows a pipeline organized around outreach stages; it does not establish the underlying service architecture.",
    missing: [
      "Research and enrichment data sources",
      "Model selection, prompts and evaluation",
      "Cadence scheduling and integration boundaries",
      "Data model, hosting and deployment topology",
    ],
    value:
      "Brings research and outreach into one connected operating workflow, giving teams a clear path from identifying a relevant company to managing follow-up. Project-specific conversion and time-saving measurements have not yet been supplied.",
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
      "A new lead or incoming call needs a timely, useful response. Qualification, answering questions and arranging a meeting are connected parts of that first conversation.",
    built:
      "A production voice workflow for inbound calls and outbound follow-up to new website leads. It qualifies leads, answers questions and books meetings. The supplied demo shows the voice-agent configuration in Retell AI.",
    steps: [
      "Inbound call / new website lead",
      "Voice conversation",
      "Answer questions & qualify",
      "Book a meeting",
      "Continue the lead workflow",
    ],
    architecture:
      "Retell AI is visible in the supplied recording, including a voice-agent workflow and post-call extraction interface. The exact live integrations and deployment configuration still need documentation.",
    missing: [
      "Website lead trigger and webhook contract",
      "Telephony configuration and number routing",
      "Knowledge sources and calendar integration",
      "Fallback handling, monitoring and evaluation",
    ],
    value:
      "Connects the first conversation to a concrete commercial next step: a qualified lead or booked meeting. Call volumes, booking rates and response-time measurements have not yet been supplied.",
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
      "Outbound calling requires more than placing a call. Reps need the right lead, a usable calling flow, a way to record the outcome and a clear next action.",
    built:
      "A calling system connected to multiple phone numbers, bringing lead queues, dialing, call-status tracking and follow-up into a single workflow. The supplied mobile recording shows lead selection, number options, scripts and call-outcome controls.",
    steps: [
      "Select a lead queue",
      "Choose a calling number",
      "Place the call",
      "Record the call outcome",
      "Follow up / move to next lead",
    ],
    architecture:
      "The recording establishes the user-facing calling workflow and multiple number options. It does not establish the telephony provider, concurrency model or backend implementation.",
    missing: [
      "Telephony provider and number management",
      "Dialing orchestration and concurrency behavior",
      "Call-status events and retry rules",
      "Lead storage and CRM synchronization",
    ],
    value:
      "Gives outbound teams a structured way to move through leads and retain call outcomes for follow-up. Throughput and productivity improvements have not yet been measured in the supplied materials.",
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
      "Prospecting, calls and follow-ups create activity. A revenue team also needs a shared view of lead status, the next step and where conversations sit in the pipeline.",
    built:
      "Custom CRM and sales workflows that connect prospecting, calling, follow-up, pipeline management and reporting. The supplied recording shows leads organized by status, with next-step and call-activity information.",
    steps: [
      "Capture the prospect",
      "Track calls & conversations",
      "Set the next step",
      "Manage pipeline stages",
      "Report on sales activity",
    ],
    architecture:
      "The demo shows a CRM interface with lead status, next steps and activity records. The diagram describes that workflow; the underlying data model and integration contracts remain to be documented.",
    missing: [
      "Lead, activity and opportunity data model",
      "Calling integration and event handling",
      "User permissions and data access rules",
      "Reporting definitions and deployment setup",
    ],
    value:
      "Connects individual sales actions to a visible pipeline so teams can understand status and follow-up. The career-level commercial evidence on the homepage is separate from this project's results.",
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

export const process = [
  "Business problem",
  "Workflow design",
  "AI/system architecture",
  "Implementation",
  "Deployment",
  "User feedback",
  "Iteration",
  "Business outcome",
];
export const toolNames = [
  "Claude",
  "Cursor",
  "Next.js",
  "Supabase/Postgres",
  "Vercel",
  "APIs",
  "LLMs",
  "Voice AI",
  "CRM integrations",
];
export const companies = [
  "Incredibuild",
  "Epox.ai",
  "RampedUp",
  "Twingo.co.il",
  "SingleStore",
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
    title: "$367K. Recorded in Salesforce.",
    caption:
      "An original Salesforce snapshot of Eyal’s Closed Won dashboard. This is one recorded snapshot, separate from the career-wide figures above.",
    alt: "Salesforce dashboard titled Eyal’s Closed Won showing USD 367K",
    fit: "contain",
  },
  {
    id: "gdc",
    image: "gdc",
    category: "In the field",
    title: "Technical products. Real conversations.",
    caption:
      "Representing Incredibuild at GDC, connecting technical product capabilities with the people who use them.",
    alt: "Eyal at the Incredibuild booth at the Game Developers Conference",
  },
  {
    id: "discovery",
    image: "discovery-1",
    category: "Customer discovery",
    title: "Understanding the problem first.",
    caption:
      "An original customer / discovery meeting screenshot from Eyal’s commercial work.",
    alt: "Eyal participating in a remote customer discovery conversation",
  },
  {
    id: "pipeline",
    image: "pipeline",
    category: "Pipeline evidence",
    title: "From activity to opportunity.",
    caption:
      "Eyal’s Salesforce dashboard with meetings, opportunities and a USD 418K pipeline snapshot. A point-in-time record, not a project outcome.",
    alt: "Eyal’s Salesforce dashboard showing meetings, opportunities and USD 418K pipeline",
    fit: "contain",
  },
  {
    id: "sql",
    image: "sql",
    category: "Qualified opportunities",
    title: "A measurable contribution.",
    caption:
      "The supplied BDR dashboard shows Eyal Shoval’s SQL count alongside team opportunity and meeting activity.",
    alt: "Salesforce BDR SQL dashboard with Eyal Shoval at 15 and team activity charts",
    fit: "contain",
  },
  {
    id: "quarterly",
    image: "quarterly",
    category: "Sales operations",
    title: "The work behind the numbers.",
    caption:
      "A quarterly team report covering sales-qualified leads, opportunities and meetings. Team totals are not attributed to Eyal.",
    alt: "Incredibuild quarterly team dashboard for SQLs, opportunities and scheduled meetings",
    fit: "contain",
  },
  {
    id: "event",
    image: "event",
    category: "Commercial experience",
    title: "Business happens between people.",
    caption:
      "A supplied event photograph documenting in-person commercial conversations.",
    alt: "Eyal speaking with a group of people at a professional event",
  },
  {
    id: "discovery-2",
    image: "discovery-2",
    category: "Customer discovery",
    title: "Connecting with technical teams.",
    caption:
      "A supplied meeting screenshot showing Eyal in a conversation with technical stakeholders.",
    alt: "Eyal and technical stakeholders on an Incredibuild video meeting",
  },
  {
    id: "discovery-3",
    image: "discovery-3",
    category: "Customer discovery",
    title: "Listening before building.",
    caption:
      "An additional original meeting screenshot from Eyal’s commercial work.",
    alt: "Eyal listening during a remote technical discovery meeting",
  },
  {
    id: "discovery-4",
    image: "discovery-4",
    category: "Customer discovery",
    title: "From discovery to next steps.",
    caption:
      "An original customer conversation screenshot supplied as evidence of hands-on commercial work.",
    alt: "Eyal discussing business needs in a customer video call",
  },
];

// Edited from the supplied product recordings, with matching English subtitles.
export const workReel = {
  src: "/media/eyal-90-seconds-v2.mp4",
  poster: "/media/eyal-90-seconds-poster.webp",
};

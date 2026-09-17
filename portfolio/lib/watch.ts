import { projects, workReel } from "@/lib/content";

export const portfolioUrl = "https://www.meeting-scheduled.com/eyal";

export const watchVideos = [
  ...projects.map((project) => ({
    slug: project.slug,
    title: project.name,
    subtitle: project.subtitle,
    description: project.description,
    src: `/media/${project.media}-captioned.mp4`,
    poster: `/media/${project.media}-poster.webp`,
    image: `/social/${project.media}.jpg`,
    duration: project.duration,
    href: `/projects/${project.slug}/`,
    linkLabel: "Explore the case study",
  })),
  {
    slug: "overview",
    title: "90 Seconds of My Work",
    subtitle: "AI Deployment & GTM Builder",
    description:
      "Watch Eyal Taieb’s AI outbound system, voice agent, calling app and CRM workflows in action. Real product footage, English subtitles and commercial evidence.",
    src: workReel.src,
    poster: workReel.poster,
    image: "/social/eyal-90-seconds.jpg",
    duration: "1:30",
    href: "/#projects",
    linkLabel: "Explore all projects",
  },
];

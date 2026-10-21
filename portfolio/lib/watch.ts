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
      "See how AI research, relevant emails, faster lead responses and connected follow-up can reduce manual work and support more sales conversations. Real product footage, original narration and English subtitles.",
    src: workReel.src,
    poster: workReel.poster,
    image: "/social/eyal-90-seconds-v4.jpg",
    duration: "1:30",
    href: "/#projects",
    linkLabel: "Explore all projects",
  },
];

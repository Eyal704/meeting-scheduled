import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { WatchPlayer } from "@/components/watch-player";
import { assetPath } from "@/lib/paths";
import { portfolioUrl, watchVideos } from "@/lib/watch";

export const dynamicParams = false;

export function generateStaticParams() {
  return watchVideos.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const video = watchVideos.find((item) => item.slug === slug);
  if (!video) return {};
  const title = `${video.title} — ${video.subtitle}`;
  const url = `${portfolioUrl}/watch/${slug}/`;
  const image = `${portfolioUrl}${video.image}`;
  return {
    title,
    description: video.description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: video.description,
      url,
      type: "website",
      siteName: "Eyal Taieb — AI Deployment & GTM Builder",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: `${video.title} — original demo footage`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: video.description,
      images: [image],
    },
  };
}

export default async function WatchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const video = watchVideos.find((item) => item.slug === slug);
  if (!video) notFound();
  return (
    <main id="main-content" className="watch-page container">
      <Link href="/#projects" className="back-link">
        <ArrowLeft size={16} /> All projects
      </Link>
      <header className="watch-heading">
        <p className="eyebrow">EYAL TAIEB / PRODUCT DEMO</p>
        <h1>{video.title}</h1>
        <p>
          {video.subtitle} · {video.duration} · English subtitles
        </p>
      </header>
      <WatchPlayer
        src={assetPath(video.src)}
        poster={assetPath(video.poster)}
      />
      <div className="watch-details">
        <p>{video.description}</p>
        <Link href={video.href} className="button button-secondary">
          {video.linkLabel} <ArrowUpRight size={17} />
        </Link>
      </div>
    </main>
  );
}

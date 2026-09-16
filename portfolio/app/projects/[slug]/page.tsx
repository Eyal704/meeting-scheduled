import { assetPath } from "@/lib/paths";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  FileCode2,
  Play,
} from "lucide-react";
import { projects } from "@/lib/content";
import { MediaDialog } from "@/components/media-dialog";

export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.description,
    openGraph: {
      title: `${project.name} | Eyal Taieb`,
      description: project.description,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const nextProject =
    projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <main id="main-content" className="case-study container">
      <Link href="/#projects" className="back-link">
        <ArrowLeft size={16} /> All projects
      </Link>
      <header className="case-header">
        <span className="eyebrow">SELECTED WORK / {project.number}</span>
        <h1>{project.name}</h1>
        <p className="case-subtitle">{project.subtitle}</p>
        <p className="case-description">{project.description}</p>
        <div className="case-header-bottom">
          <ul className="tag-list" aria-label="Project focus">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <a className="text-link" href="#demo">
            Watch the full demo <ArrowDown size={16} />
          </a>
        </div>
      </header>
      <nav className="case-navigation" aria-label="Case study sections">
        <a href="#problem">Problem</a>
        <a href="#built">What I Built</a>
        <a href="#workflow">How It Works</a>
        <a href="#architecture">Architecture</a>
        <a href="#demo">Demo</a>
        <a href="#value">Business Value</a>
        <a href="#learned">What I Learned</a>
      </nav>
      <div className="case-overview">
        <section id="problem" className="case-text">
          <span className="eyebrow">01 / THE STARTING POINT</span>
          <h2>Problem</h2>
          <p>{project.problem}</p>
        </section>
        <section id="built" className="case-text">
          <span className="eyebrow">02 / THE IMPLEMENTATION</span>
          <h2>What I Built</h2>
          <p>{project.built}</p>
        </section>
      </div>
      <section id="workflow" className="case-section">
        <span className="eyebrow">03 / THE CONNECTED WORKFLOW</span>
        <h2>How It Works</h2>
        <ol className="workflow-diagram">
          {project.steps.map((step, index) => (
            <li key={step}>
              <span className="process-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{step}</h3>
              {index < project.steps.length - 1 ? (
                <ArrowRight size={17} aria-hidden="true" />
              ) : (
                <Check size={17} aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
      </section>
      <section id="architecture" className="case-section architecture-section">
        <div>
          <span className="eyebrow">04 / UNDER THE HOOD</span>
          <h2>Technical / Workflow Architecture</h2>
          <p>{project.architecture}</p>
        </div>
        <div className="architecture-placeholder">
          <div className="placeholder-label">
            <FileCode2 size={20} />
            <span>ARCHITECTURE DETAILS — TO BE ADDED</span>
          </div>
          <p>
            Placeholder: the following implementation details need to be
            supplied and verified.
          </p>
          <ul>
            {project.missing.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
      </section>
      <section id="demo" className="case-section">
        <div className="section-heading demo-heading">
          <div>
            <span className="eyebrow">05 / SEE IT WORK</span>
            <h2>Demo</h2>
          </div>
          <p>
            Full recording · {project.duration}
            <br />
            {project.portrait
              ? "Mobile calling workflow"
              : "Original product walkthrough"}
          </p>
        </div>
        <MediaDialog
          title={project.name}
          src={assetPath(`/media/${project.media}.mp4`)}
          poster={assetPath(`/media/${project.media}-poster.webp`)}
          className={`full-demo ${project.portrait ? "portrait-demo" : ""}`}
        >
          <Image
            src={assetPath(`/media/${project.media}-poster.webp`)}
            alt={`Preview of the ${project.name} demo`}
            width={project.portrait ? 640 : 1200}
            height={project.portrait ? 1387 : 778}
            sizes="(max-width: 680px) 90vw, 1100px"
          />
          <span className="full-demo-overlay">
            <span className="large-play">
              <Play size={28} fill="currentColor" />
            </span>
            <strong>Watch the full demo</strong>
            <span>{project.duration} · Sound on</span>
          </span>
        </MediaDialog>
      </section>
      <div className="case-overview case-outcomes">
        <section id="value" className="case-text">
          <span className="eyebrow">06 / THE COMMERCIAL CONTEXT</span>
          <h2>Business Value</h2>
          <p>{project.value}</p>
        </section>
        <section id="learned" className="case-text">
          <span className="eyebrow">07 / DESIGN TAKEAWAY</span>
          <h2>What I Learned</h2>
          <p>{project.takeaway}</p>
          <span className="takeaway-note">
            Design takeaway from the demonstrated workflow. Deployment-specific
            lessons and user feedback are still to be documented.
          </span>
        </section>
      </div>
      <Link className="next-project" href={`/projects/${nextProject.slug}`}>
        <span>
          <span className="eyebrow">NEXT PROJECT / {nextProject.number}</span>
          <strong>{nextProject.name}</strong>
          <span>{nextProject.subtitle}</span>
        </span>
        <ArrowUpRight size={34} />
      </Link>
    </main>
  );
}

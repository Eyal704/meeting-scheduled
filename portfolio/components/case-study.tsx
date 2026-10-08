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
import { caseCopy, getContent } from "@/lib/copy";
import { localePath, type Locale } from "@/lib/i18n";
import { MediaDialog } from "@/components/media-dialog";

export function caseStudyParams() {
  return getContent("en").projects.map((project) => ({ slug: project.slug }));
}

export function caseStudyMetadata(locale: Locale, slug: string): Metadata {
  const project = getContent(locale).projects.find(
    (item) => item.slug === slug,
  );
  if (!project) return {};
  return {
    title: project.name,
    description: project.description,
    openGraph: {
      title: `${project.name} | ${locale === "he" ? "אייל טייב" : "Eyal Taieb"}`,
      description: project.description,
    },
  };
}

export function CaseStudy({ locale, slug }: { locale: Locale; slug: string }) {
  const { projects } = getContent(locale);
  const t = caseCopy[locale];
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const nextProject =
    projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <main id="main-content" className="case-study container">
      <Link href={localePath(locale, "/#projects")} className="back-link">
        <ArrowLeft size={16} className="dir-icon" /> {t.allProjects}
      </Link>
      <header className="case-header">
        <span className="eyebrow">
          {t.selectedWork} / {project.number}
        </span>
        <h1>{project.name}</h1>
        <p className="case-subtitle">{project.subtitle}</p>
        <p className="case-description">{project.description}</p>
        <div className="case-header-bottom">
          <ul className="tag-list" aria-label={t.projectFocus}>
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <a className="text-link" href="#demo">
            {t.watchFullDemo} <ArrowDown size={16} />
          </a>
        </div>
      </header>
      <nav className="case-navigation" aria-label={t.sectionsLabel}>
        <a href="#problem">{t.problem}</a>
        <a href="#built">{t.built}</a>
        <a href="#workflow">{t.workflow}</a>
        <a href="#architecture">{t.architecture}</a>
        <a href="#demo">{t.demo}</a>
        <a href="#value">{t.value}</a>
        <a href="#learned">{t.learned}</a>
      </nav>
      <div className="case-overview">
        <section id="problem" className="case-text">
          <span className="eyebrow">{t.problemEyebrow}</span>
          <h2>{t.problem}</h2>
          <p>{project.problem}</p>
        </section>
        <section id="built" className="case-text">
          <span className="eyebrow">{t.builtEyebrow}</span>
          <h2>{t.built}</h2>
          <p>{project.built}</p>
        </section>
      </div>
      <section id="workflow" className="case-section">
        <span className="eyebrow">{t.workflowEyebrow}</span>
        <h2>{t.workflow}</h2>
        <ol className="workflow-diagram">
          {project.steps.map((step, index) => (
            <li key={step}>
              <span className="process-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{step}</h3>
              {index < project.steps.length - 1 ? (
                <ArrowRight size={17} className="dir-icon" aria-hidden="true" />
              ) : (
                <Check size={17} aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
      </section>
      <section id="architecture" className="case-section architecture-section">
        <div>
          <span className="eyebrow">{t.architectureEyebrow}</span>
          <h2>{t.architectureTitle}</h2>
          <p>{project.architecture}</p>
        </div>
        <div className="architecture-placeholder">
          <div className="placeholder-label">
            <FileCode2 size={20} />
            <span>{t.componentsLabel}</span>
          </div>
          <ul>
            {project.components.map((component) => (
              <li key={component}>{component}</li>
            ))}
          </ul>
        </div>
      </section>
      <section id="demo" className="case-section">
        <div className="section-heading demo-heading">
          <div>
            <span className="eyebrow">{t.demoEyebrow}</span>
            <h2>{t.demo}</h2>
          </div>
          <p>
            {t.fullRecording(project.duration)}
            <br />
            {project.portrait ? t.mobileDemo : t.desktopDemo}
          </p>
        </div>
        <MediaDialog
          title={project.name}
          autoOpenHash="demo"
          src={assetPath(`/media/${project.media}-captioned.mp4`)}
          poster={assetPath(`/media/${project.media}-poster.webp`)}
          className={`full-demo ${project.portrait ? "portrait-demo" : ""}`}
        >
          <Image
            src={assetPath(`/media/${project.media}-poster.webp`)}
            alt={t.previewAlt(project.name)}
            width={project.portrait ? 640 : 1200}
            height={project.portrait ? 1387 : 778}
            sizes="(max-width: 680px) 90vw, 1100px"
          />
          <span className="full-demo-overlay">
            <span className="large-play">
              <Play size={28} fill="currentColor" />
            </span>
            <strong>{t.watchFullDemo}</strong>
            <span>
              {project.duration} · {t.soundOn}
            </span>
          </span>
        </MediaDialog>
        <div className="demo-resources">
          <a
            className="text-link"
            href={assetPath(`/transcripts/${project.media}-transcript.txt`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.readTranscript} <ArrowUpRight size={16} />
          </a>
          <a
            className="text-link"
            href={assetPath(`/transcripts/${project.media}.srt`)}
            download
          >
            {t.downloadSubtitles} <ArrowDown size={16} />
          </a>
        </div>
      </section>
      <div className="case-overview case-outcomes">
        <section id="value" className="case-text">
          <span className="eyebrow">{t.valueEyebrow}</span>
          <h2>{t.value}</h2>
          <p>{project.value}</p>
        </section>
        <section id="learned" className="case-text">
          <span className="eyebrow">{t.learnedEyebrow}</span>
          <h2>{t.learned}</h2>
          <p>{project.takeaway}</p>
        </section>
      </div>
      <Link
        className="next-project"
        href={localePath(locale, `/projects/${nextProject.slug}`)}
      >
        <span>
          <span className="eyebrow">
            {t.nextProject} / {nextProject.number}
          </span>
          <strong>{nextProject.name}</strong>
          <span>{nextProject.subtitle}</span>
        </span>
        <ArrowUpRight size={34} className="dir-icon" />
      </Link>
    </main>
  );
}

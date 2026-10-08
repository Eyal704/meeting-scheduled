import { assetPath } from "@/lib/paths";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import type { Project } from "@/lib/content";
import { copy } from "@/lib/copy";
import { localePath, type Locale } from "@/lib/i18n";
import { MediaDialog } from "./media-dialog";

export function ProjectCard({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const t = copy[locale];
  const href = localePath(locale, `/projects/${project.slug}`);
  return (
    <article className="project-card">
      <MediaDialog
        title={project.name}
        src={assetPath(`/media/${project.media}-captioned.mp4`)}
        poster={assetPath(`/media/${project.media}-poster.webp`)}
        className={`project-preview ${project.portrait ? "portrait-preview" : ""}`}
      >
        <div className="preview-topbar">
          <span className="window-dots">
            <i />
            <i />
            <i />
          </span>
          <span>
            {project.portrait ? t.mobileWorkflow : t.productWalkthrough}
          </span>
          <span>{project.duration}</span>
        </div>
        <div className="preview-image">
          <Image
            src={assetPath(`/media/${project.media}-poster.webp`)}
            alt={t.recordingAlt(project.name)}
            width={project.portrait ? 640 : 1200}
            height={project.portrait ? 1387 : 778}
            sizes="(max-width: 680px) 90vw, (max-width: 1100px) 44vw, 570px"
          />
          <span className="preview-play">
            <Play size={22} fill="currentColor" />
          </span>
          {project.portrait && (
            <span className="portrait-note">
              {t.portraitNote[0]}
              <br />
              {t.portraitNote[1]}
            </span>
          )}
        </div>
        <span className="preview-caption">
          <span className="status-dot" /> {t.productFootage}{" "}
          <span>
            {t.watchDemo} <ArrowUpRight size={14} />
          </span>
        </span>
      </MediaDialog>
      <div className="project-content">
        <span className="project-number">
          {project.number} / {t.selectedWork}
        </span>
        <h3>
          <Link href={href}>{project.name}</Link>
          <ArrowUpRight size={23} aria-hidden="true" />
        </h3>
        <p className="project-subtitle">{project.subtitle}</p>
        <p className="project-description">{project.description}</p>
        <ul className="tag-list" aria-label={t.projectFocus}>
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <Link className="case-link" href={href}>
          {t.caseStudyLink} <ArrowUpRight size={17} />
        </Link>
      </div>
    </article>
  );
}

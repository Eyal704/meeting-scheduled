import { assetPath } from "@/lib/paths";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import type { Project } from "@/lib/content";
import { MediaDialog } from "./media-dialog";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <MediaDialog
        title={project.name}
        src={assetPath(`/media/${project.media}.mp4`)}
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
            {project.portrait ? "MOBILE WORKFLOW" : "PRODUCT WALKTHROUGH"}
          </span>
          <span>{project.duration}</span>
        </div>
        <div className="preview-image">
          <Image
            src={assetPath(`/media/${project.media}-poster.webp`)}
            alt={`${project.name} — actual product recording`}
            width={project.portrait ? 640 : 1200}
            height={project.portrait ? 1387 : 778}
            sizes="(max-width: 680px) 90vw, (max-width: 1100px) 44vw, 570px"
          />
          <span className="preview-play">
            <Play size={22} fill="currentColor" />
          </span>
          {project.portrait && (
            <span className="portrait-note">
              A clear next step.
              <br />
              After every call.
            </span>
          )}
        </div>
        <span className="preview-caption">
          <span className="status-dot" /> Actual product footage{" "}
          <span>
            Watch demo <ArrowUpRight size={14} />
          </span>
        </span>
      </MediaDialog>
      <div className="project-content">
        <span className="project-number">{project.number} / SELECTED WORK</span>
        <h3>
          <Link href={`/projects/${project.slug}`}>{project.name}</Link>
          <ArrowUpRight size={23} aria-hidden="true" />
        </h3>
        <p className="project-subtitle">{project.subtitle}</p>
        <p className="project-description">{project.description}</p>
        <ul className="tag-list" aria-label="Project focus">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <Link className="case-link" href={`/projects/${project.slug}`}>
          Explore the case study <ArrowUpRight size={17} />
        </Link>
      </div>
    </article>
  );
}

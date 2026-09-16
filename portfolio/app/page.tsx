import { assetPath } from "@/lib/paths";
import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Braces,
  Check,
  FileText,
  Layers3,
  Play,
  Route,
  Workflow,
} from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import { EvidenceGallery } from "@/components/evidence-gallery";
import { MediaDialog } from "@/components/media-dialog";
import {
  companies,
  metrics,
  process,
  projects,
  toolNames,
  workReel,
} from "@/lib/content";

export default function Home() {
  return (
    <main id="main-content">
      <section className="hero container" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="availability">
            <span className="status-dot" /> OPEN TO THE RIGHT OPPORTUNITY
          </div>
          <p className="eyebrow hero-eyebrow">AI DEPLOYMENT & GTM BUILDER</p>
          <h1 id="hero-title">
            I build and deploy AI systems that turn business workflows{" "}
            <span>into revenue.</span>
          </h1>
          <p className="hero-description">
            From outbound platforms and voice agents to calling systems and CRM
            workflows, I design, build and deploy software that companies
            actually use — and understand how those systems connect to real
            commercial outcomes.
          </p>
          <div className="hero-actions">
            <a href="#work-reel" className="button button-primary">
              <Play size={16} fill="currentColor" /> See My Work
            </a>
            <a href="#projects" className="button button-secondary">
              View Projects <ArrowDown size={17} />
            </a>
          </div>
          <div className="hero-footnote">
            <span>BUSINESS CONTEXT</span>
            <span className="small-cross">+</span>
            <span>TECHNICAL EXECUTION</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="portrait-frame">
            <Image
              className="hero-portrait"
              src={assetPath("/media/headshot.webp")}
              alt="Eyal Taieb, AI Deployment and GTM Builder"
              width={900}
              height={1352}
              sizes="(max-width: 680px) 90vw, (max-width: 1100px) 40vw, 440px"
              priority
            />
            <div className="portrait-label">
              <span className="portrait-label-icon">
                <Workflow size={24} />
              </span>
              <div>
                <strong>Built with business in mind.</strong>
                <span>From the first problem to the final mile.</span>
              </div>
              <ArrowUpRight size={18} />
            </div>
            <a
              className="text-link portfolio-download"
              href={assetPath("/documents/eyal-taieb-portfolio.pdf")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileText size={15} /> Download one-page portfolio{" "}
              <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="portrait-caption">
            <span>EYAL TAIEB</span>
            <span>BUSINESS ↔ TECHNOLOGY</span>
          </div>
          <span className="portrait-corner" aria-hidden="true">
            +
          </span>
        </div>
      </section>

      <section
        className="metrics-section container"
        aria-label="Career commercial highlights"
      >
        <div className="metrics-grid">
          {metrics.map((metric) => (
            <div className="metric" key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
        <p className="metrics-note">
          Career-wide commercial highlights. Original evidence below.
        </p>
      </section>

      <section
        id="projects"
        className="section container"
        aria-labelledby="projects-title"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">01 / SELECTED WORK</span>
            <h2 id="projects-title">
              Working systems,
              <br />
              <span className="muted">not prototypes.</span>
            </h2>
          </div>
          <p>
            These systems can be adapted and deployed into existing company
            workflows, data and infrastructure.
          </p>
        </div>
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section
        id="work-reel"
        className="reel-section container"
        aria-labelledby="reel-title"
      >
        <div className="reel-panel">
          <div className="reel-copy">
            <span className="eyebrow">THE WORK, IN MOTION</span>
            <h2 id="reel-title">
              90 Seconds
              <br />
              of My Work<span className="accent">.</span>
            </h2>
            <p>
              AI outbound. Voice agents. Calling systems. Connected revenue
              workflows.
            </p>
            {workReel.src ? (
              <MediaDialog
                title="90 Seconds of My Work"
                src={assetPath(workReel.src)}
                poster={assetPath(workReel.poster)}
                className="button button-primary"
              >
                <Play size={17} fill="currentColor" /> Watch the reel
              </MediaDialog>
            ) : (
              <>
                <span className="reel-status">
                  <span className="status-dot" /> Final edited reel coming soon
                </span>
                <a className="text-link" href="#projects">
                  Explore the full project demos <ArrowUpRight size={16} />
                </a>
              </>
            )}
          </div>
          <div className="reel-visual" aria-hidden="true">
            <div className="reel-browser">
              <div className="preview-topbar">
                <span className="window-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span>MEETINGSCHEDULED / PRODUCT FOOTAGE</span>
              </div>
              <Image
                src={assetPath(workReel.poster)}
                alt=""
                width={1200}
                height={778}
                sizes="(max-width: 680px) 80vw, 580px"
              />
              <span className="reel-time">
                01:30 <span>REEL IN PROGRESS</span>
              </span>
            </div>
            <div className="reel-track">
              <span>OUTBOUND</span>
              <span>VOICE AI</span>
              <span>CALLING</span>
              <span>CRM</span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="evidence"
        className="section evidence-section container"
        aria-labelledby="evidence-title"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">02 / COMMERCIAL PROOF</span>
            <h2 id="evidence-title">
              Before I built the systems,
              <br />
              <span className="muted">I did the work.</span>
            </h2>
          </div>
          <p>
            Customer conversations, technical sales and pipeline ownership. A
            commercial foundation behind every system I build.
          </p>
        </div>
        <div className="evidence-context">
          <Check size={16} />
          <p>
            Original photographs and dashboard screenshots. Select an image to
            inspect the evidence and its context.
          </p>
        </div>
        <EvidenceGallery />
      </section>

      <section
        id="approach"
        className="approach-section"
        aria-labelledby="approach-title"
      >
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">03 / HOW I WORK</span>
              <h2 id="approach-title">
                Start with the problem.
                <br />
                <span className="muted">Stay for the outcome.</span>
              </h2>
            </div>
            <p>
              A useful system needs more than a successful demo. It needs to fit
              the workflow, reach the user and improve through real use.
            </p>
          </div>
          <ol className="process-grid">
            {process.map((step, index) => (
              <li key={step}>
                <span className="process-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{step}</h3>
                {index < process.length - 1 ? (
                  <ArrowRight
                    className="process-arrow"
                    size={18}
                    aria-hidden="true"
                  />
                ) : (
                  <Check
                    className="process-arrow"
                    size={18}
                    aria-hidden="true"
                  />
                )}
              </li>
            ))}
          </ol>
          <div className="approach-note">
            <Route size={19} />
            <p>
              Business context guides the build. User feedback guides what comes
              next.
            </p>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="section about-section container"
        aria-labelledby="about-title"
      >
        <div className="about-grid">
          <div className="about-copy">
            <span className="eyebrow">04 / THE PERSON BEHIND THE WORK</span>
            <h2 id="about-title">
              The bridge between
              <br />
              business <span className="muted">and technology.</span>
            </h2>
            <p>
              I spent years building B2B pipeline and selling technical products
              before moving deeply into building AI systems myself. That
              combination means I approach software from both sides: what needs
              to be built technically, and what has to happen for someone to
              actually use it and create business value.
            </p>
            <a
              className="text-link"
              href={assetPath("/documents/eyal-taieb-cv.pdf")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileText size={17} /> View my CV <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="tools-panel">
            <div className="tools-header">
              <Braces size={22} />
              <span className="eyebrow">TECH & TOOLS</span>
            </div>
            <ul className="tools-list">
              {toolNames.map((tool, index) => (
                <li key={tool}>
                  <span className="tool-glyph" aria-hidden="true">
                    {index === 0 ? (
                      "✳"
                    ) : index === 1 ? (
                      "⌘"
                    ) : index === 2 ? (
                      "N"
                    ) : index === 3 ? (
                      "↯"
                    ) : index === 4 ? (
                      "▲"
                    ) : index === 5 ? (
                      "{ }"
                    ) : index === 6 ? (
                      <Layers3 size={19} />
                    ) : index === 7 ? (
                      <AudioLines size={19} />
                    ) : (
                      <Workflow size={19} />
                    )}
                  </span>
                  {tool}
                </li>
              ))}
            </ul>
            <p>
              Selected tools across my work. Project-specific architecture is
              documented in each case study.
            </p>
          </div>
        </div>
        <div className="experience">
          <span className="eyebrow">EXPERIENCE WITH</span>
          <ul>
            {companies.map((company) => (
              <li key={company}>{company}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

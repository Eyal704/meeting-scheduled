"use client";

import { assetPath } from "@/lib/paths";

import Image from "next/image";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";
import type { Evidence } from "@/lib/content";
import { ui } from "@/lib/i18n";
import { useLocale } from "@/lib/use-locale";
import { EvidenceZoom, MediaDialog } from "./media-dialog";

export function EvidenceGallery({ evidence }: { evidence: Evidence[] }) {
  const [expanded, setExpanded] = useState(false);
  const t = ui[useLocale()];
  return (
    <>
      <div id="evidence-gallery" className="evidence-grid">
        {evidence
          .slice(0, expanded ? evidence.length : 6)
          .map((item, index) => (
            <article
              className={`evidence-card evidence-${item.id}`}
              key={item.id}
            >
              <MediaDialog
                type="image"
                src={assetPath(`/media/${item.image}.webp`)}
                title={item.title}
                caption={item.caption}
                className={`evidence-image ${item.fit === "contain" ? "image-contain" : ""}`}
              >
                <Image
                  src={assetPath(`/media/${item.image}-thumb.webp`)}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 600px) 90vw, (max-width: 900px) 44vw, 370px"
                />
                <EvidenceZoom />
              </MediaDialog>
              <div className="evidence-copy">
                <span className="eyebrow">
                  {String(index + 1).padStart(2, "0")} / {item.category}
                </span>
                <h3>{item.title}</h3>
                <p>{item.caption}</p>
              </div>
            </article>
          ))}
      </div>
      <button
        className="button button-secondary evidence-more"
        aria-expanded={expanded}
        aria-controls="evidence-gallery"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? t.showLess : t.showAll(evidence.length)}
        {expanded ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
      </button>
    </>
  );
}

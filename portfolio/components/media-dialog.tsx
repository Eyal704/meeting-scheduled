"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Play, X, ZoomIn } from "lucide-react";
import { AutoplayVideo } from "@/components/autoplay-video";

type Props = {
  title: string;
  src: string;
  poster?: string;
  caption?: string;
  type?: "video" | "image";
  className?: string;
  children?: ReactNode;
  autoOpenHash?: string;
};

export function MediaDialog({
  title,
  src,
  poster,
  caption,
  type = "video",
  className = "",
  children,
  autoOpenHash,
}: Props) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!autoOpenHash || type !== "video") return;
    const openFromLink = () => {
      if (window.location.hash === `#${autoOpenHash}`) {
        setFailed(false);
        setOpen(true);
      }
    };
    openFromLink();
    window.addEventListener("hashchange", openFromLink);
    return () => window.removeEventListener("hashchange", openFromLink);
  }, [autoOpenHash, type]);

  function close() {
    setOpen(false);
    if (autoOpenHash && window.location.hash === `#${autoOpenHash}`) {
      window.history.replaceState(
        window.history.state,
        "",
        window.location.pathname + window.location.search,
      );
    }
  }

  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
      trigger.current?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      <button
        ref={trigger}
        className={`media-trigger ${className}`}
        onClick={() => {
          setFailed(false);
          setOpen(true);
        }}
        aria-label={`${type === "video" ? "Watch" : "View evidence:"} ${title}`}
        aria-haspopup="dialog"
      >
        {children || (
          <>
            <Play size={15} fill="currentColor" /> Watch demo
          </>
        )}
      </button>
      {open && (
        <dialog
          ref={dialog}
          className={`media-dialog ${type}-dialog`}
          aria-labelledby={titleId}
          onCancel={close}
          onClose={() => setOpen(false)}
          onKeyDown={(event) => {
            if (event.key !== "Tab") return;
            const focusable = event.currentTarget.querySelectorAll<HTMLElement>(
              'button:not([disabled]), a[href], video[controls], [tabindex="0"]',
            );
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first?.focus();
            }
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div className="dialog-panel">
            <div className="dialog-header">
              <div>
                <span className="eyebrow">
                  {type === "video"
                    ? "PRODUCT WALKTHROUGH"
                    : "COMMERCIAL EVIDENCE"}
                </span>
                <h2 id={titleId}>{title}</h2>
              </div>
              <button
                className="icon-button"
                aria-label="Close dialog"
                onClick={close}
                autoFocus
              >
                <X size={22} />
              </button>
            </div>
            {type === "video" ? (
              <AutoplayVideo src={src} poster={poster} onFailure={setFailed} />
            ) : (
              // Native image keeps the original screenshot readable and loads only on demand.
              // eslint-disable-next-line @next/next/no-img-element
              <img className="dialog-image" src={src} alt={caption || title} />
            )}
            <div className="dialog-footer">
              <p>
                {failed
                  ? "This browser could not play the demo. Open the video directly using the link."
                  : caption ||
                    "Full product recording. Use the player controls to pause, seek or enter full screen."}
              </p>
              <a href={src} target="_blank" rel="noopener noreferrer">
                Open {type === "video" ? "video" : "image"}{" "}
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}

export function EvidenceZoom() {
  return (
    <span className="evidence-zoom" aria-hidden="true">
      <ZoomIn size={18} />
    </span>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Volume2 } from "lucide-react";

export function AutoplayVideo({
  src,
  poster,
  onFailure,
}: {
  src: string;
  poster?: string;
  onFailure: (failed: boolean) => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [needsSound, setNeedsSound] = useState(false);
  const [needsPlay, setNeedsPlay] = useState(false);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let cancelled = false;
    async function start() {
      try {
        await element!.play();
      } catch (error) {
        if (cancelled || (error as DOMException).name === "AbortError") return;
        if ((error as DOMException).name !== "NotAllowedError") {
          onFailure(true);
          return;
        }
        // A PDF click may not carry user activation into the destination tab.
        element!.muted = true;
        setNeedsSound(true);
        try {
          await element!.play();
        } catch (mutedError) {
          if (cancelled || (mutedError as DOMException).name === "AbortError")
            return;
          if ((mutedError as DOMException).name === "NotAllowedError") {
            setNeedsPlay(true);
          } else {
            onFailure(true);
          }
        }
      }
    }
    void start();
    return () => {
      cancelled = true;
    };
  }, [src, onFailure]);

  async function playWithSound() {
    const element = video.current;
    if (!element) return;
    element.muted = false;
    try {
      await element.play();
      setNeedsSound(false);
      setNeedsPlay(false);
    } catch (error) {
      if ((error as DOMException).name === "NotAllowedError")
        setNeedsPlay(true);
      else if ((error as DOMException).name !== "AbortError") onFailure(true);
    }
  }

  return (
    <>
      <video
        ref={video}
        className="dialog-video"
        controls
        playsInline
        preload="none"
        poster={poster}
        onError={() => onFailure(true)}
        onVolumeChange={() => setNeedsSound(Boolean(video.current?.muted))}
        onPlaying={() => setNeedsPlay(false)}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support embedded video.{" "}
        <a href={src}>Open the demo.</a>
      </video>
      {(needsSound || needsPlay) && (
        <div className="playback-notice">
          <button className="button button-primary" onClick={playWithSound}>
            {needsPlay ? <Play size={17} /> : <Volume2 size={17} />}
            {needsPlay ? "Play video with sound" : "Turn sound on"}
          </button>
          <p role="status">
            {needsPlay
              ? "Your browser needs a tap to start playback."
              : "Playing muted. Your browser needs a tap to enable sound."}
          </p>
        </div>
      )}
    </>
  );
}

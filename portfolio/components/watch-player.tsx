"use client";

import { useState } from "react";
import { AutoplayVideo } from "@/components/autoplay-video";

export function WatchPlayer({ src, poster }: { src: string; poster: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="watch-player">
      <AutoplayVideo src={src} poster={poster} onFailure={setFailed} />
      {failed && (
        <p className="watch-error" role="status">
          This browser could not play the video.{" "}
          <a href={src}>Open the video directly.</a>
        </p>
      )}
    </div>
  );
}

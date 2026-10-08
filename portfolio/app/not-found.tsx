import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteShell } from "@/components/site-shell";

export default function NotFound() {
  return (
    <SiteShell locale="en">
      <main id="main-content" className="container not-found">
        <span className="eyebrow">404 / NOT FOUND</span>
        <h1>Page not found.</h1>
        <p>The page you requested does not exist or has moved.</p>
        <Link className="button button-primary" href="/">
          <ArrowLeft size={17} /> Back to the portfolio
        </Link>
      </main>
    </SiteShell>
  );
}

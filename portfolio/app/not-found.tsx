import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main-content" className="container not-found">
      <span className="eyebrow">404 / NOT FOUND</span>
      <h1>
        This page isn’t
        <br />
        part of the workflow.
      </h1>
      <p>Explore the projects, or head back to the portfolio.</p>
      <Link className="button button-primary" href="/">
        <ArrowLeft size={17} /> Back to the portfolio
      </Link>
    </main>
  );
}

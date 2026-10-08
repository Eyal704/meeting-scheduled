import type { Metadata } from "next";
import {
  CaseStudy,
  caseStudyMetadata,
  caseStudyParams,
} from "@/components/case-study";

export const dynamicParams = false;
export const generateStaticParams = caseStudyParams;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return caseStudyMetadata("en", (await params).slug);
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <CaseStudy locale="en" slug={(await params).slug} />;
}

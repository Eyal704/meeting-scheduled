// Next.js prefixes Link routes automatically; native media and document URLs
// need the same prefix explicitly when publishing below /eyal on GitHub Pages.
export const basePath = process.env.NEXT_PUBLIC_PORTFOLIO_BASE_PATH || "";

export function assetPath(path: string) {
  return path.startsWith("/") ? `${basePath}${path}` : path;
}

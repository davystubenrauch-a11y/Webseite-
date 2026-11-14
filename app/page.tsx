import { redirect } from "next/navigation";

// "/" is served from public/site/index.html (rewrite in next.config.mjs, beforeFiles).
// This page only answers if that rewrite is ever missing, and then sends visitors to the real start page.
export default function Home() {
  redirect("/site/index.html");
}

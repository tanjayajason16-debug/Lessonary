import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lessonary — Learning Studio",
  description: "Plan learning, practice with purpose, and see progress clearly.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

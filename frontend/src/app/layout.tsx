import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kamalesh D | DevOps Engineer & Technical Blogger",
  description: "Portfolio of Kamalesh D - DevOps Engineer specializing in cloud infrastructure, CI/CD, Kubernetes, and technical blogging on Medium.",
  keywords: ["DevOps", "Kubernetes", "Docker", "AWS", "Terraform", "CI/CD", "Cloud", "Infrastructure"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#09090b] text-white font-sans">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Travel Diaries | Plan Your Perfect Trip",
  description: "Track your travel adventures, plan trips with budgets, and discover amazing places around the world.",
  keywords: "travel, diary, trip planner, budget, vacation, adventure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}

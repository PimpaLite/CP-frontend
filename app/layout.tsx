import type { Metadata } from "next";
import { Righteous, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Initialize Righteous for headings
const righteous = Righteous({ 
  weight: '400',
  subsets: ["latin"],
  variable: '--font-righteous'
});

// Initialize Plus Jakarta Sans for body text & UI
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: '--font-jakarta'
});

export const metadata: Metadata = {
  title: "BACKISSUE",
  description: "An immersive digital comic bookstore.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${righteous.variable} ${jakarta.variable} font-sans bg-ghost-lavender text-deep-charcoal min-h-screen antialiased relative`}
      >
        {/* REFINED READING MODE OVERLAY (Soft Golden Amber) */}
        
        {/* Layer 1: Shifts the harsh blues to a warm yellow-amber without overpowering the dark woods. */}
        <div className="fixed inset-0 pointer-events-none z-[9998] bg-[#FFB74D] mix-blend-color opacity-[0.20]" />
        
        {/* Layer 2: Adds a gentle, warm physical glow to the screen. */}
        <div className="fixed inset-0 pointer-events-none z-[9999] bg-[#FF9800] mix-blend-soft-light opacity-[0.25]" />
        
        {children}
      </body>
    </html>
  );
}
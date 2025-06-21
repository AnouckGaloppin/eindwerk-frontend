import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { ReactNode } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import CookieBanner from "@/components/CookieBanner";

const inter = Inter({ subsets: ["latin"] });

export function NavItem({
  label,
  href,
  children,
}: {
  children: ReactNode;
  href: string;
  label?: string;
  className?: string;
}) {
  return (
    <Link href={href} className="flex flex-col items-center text-sm">
      <span className="text-2xl">{children}</span>
      {label && <span>{label}</span>}
    </Link>
  );
}

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="nl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Volovan - Your smart shopping companion for finding the best prices and managing your shopping list" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen bg-white text-gray-900`}>
        {/* Skip to main content link for screen readers */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Ga naar hoofdinhoud
        </a>

        <Providers>
          <CookieBanner />
          <div className="flex flex-col flex-grow">
            <div>
              <Breadcrumbs />
            </div>
            <main 
              id="main-content"
              className="pb-20"
              role="main"
            >
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

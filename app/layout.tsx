import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Use Alternatives Europeennes",
  description:
    "Des solutions alternatives aux produits Américains de la vie quotidienne",
  generator: "Use Alternatives Europeennes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={poppins.className} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

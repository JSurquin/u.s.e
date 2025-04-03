import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "U.S.E - Guide des Produits",
  description:
    "Trouvez facilement des alternatives européennes à vos produits américains préférés.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://use.andromed.fr",
    siteName: "U.S.E",
    title: "U.S.E - Guide des Produits",
    description:
      "Trouvez facilement des alternatives européennes à vos produits américains préférés.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}

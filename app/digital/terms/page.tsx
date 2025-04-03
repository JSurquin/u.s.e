"use client";

import { useState } from "react";
import Link from "next/link";
import { Code, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { translations } from "@/data/translations";

export default function TermsPage() {
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const t = translations[language];

  const terms =
    language === "fr"
      ? [
          {
            title: "Acceptation des conditions",
            content:
              "En accédant à ce site, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables.",
          },
          {
            title: "Licence d'utilisation",
            content:
              "Une licence limitée, non exclusive et non transférable vous est accordée pour accéder et utiliser le site conformément à ces conditions.",
          },
          {
            title: "Propriété intellectuelle",
            content:
              "Le contenu du site, y compris les textes, graphiques, logos et images, est protégé par le droit d'auteur et autres lois sur la propriété intellectuelle.",
          },
          {
            title: "Protection des données",
            content:
              "Nous nous engageons à protéger vos données personnelles conformément au RGPD et à notre politique de confidentialité.",
          },
          {
            title: "Modifications",
            content:
              "Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications entrent en vigueur dès leur publication sur le site.",
          },
        ]
      : [
          {
            title: "Terms Acceptance",
            content:
              "By accessing this site, you agree to be bound by these terms of use and all applicable laws and regulations.",
          },
          {
            title: "Usage License",
            content:
              "A limited, non-exclusive, non-transferable license is granted to access and use the site in accordance with these terms.",
          },
          {
            title: "Intellectual Property",
            content:
              "The site content, including text, graphics, logos, and images, is protected by copyright and other intellectual property laws.",
          },
          {
            title: "Data Protection",
            content:
              "We are committed to protecting your personal data in accordance with GDPR and our privacy policy.",
          },
          {
            title: "Modifications",
            content:
              "We reserve the right to modify these terms at any time. Modifications become effective immediately upon posting to the site.",
          },
        ];

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f7] dark:bg-[#1d1d1f]">
      <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-white/80 dark:bg-[#1d1d1f]/90 shadow-sm">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex items-center gap-2 text-2xl font-bold text-primary">
            <Link href="/" className="flex items-center">
              <span className="mr-2 text-3xl">🇪🇺</span>
              <span className="bg-gradient-to-r from-[#0066cc] to-[#5ac8fa] bg-clip-text font-medium text-transparent">
                U.S.E
              </span>
            </Link>
          </div>

          {/* Language Switcher */}
          <div className="!ml-4 mr-4 flex items-center">
            <button
              onClick={() => setLanguage("fr")}
              className={`px-3 py-1.5 text-xs rounded-l-full transition-all ${
                language === "fr"
                  ? "bg-gradient-to-r from-[#0066cc] to-[#5ac8fa] text-white font-medium shadow-md"
                  : "bg-[#f2f2f7] dark:bg-[#2c2c2e] hover:bg-[#e5e5ea] dark:hover:bg-[#3a3a3c]"
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1.5 text-xs rounded-r-full transition-all ${
                language === "en"
                  ? "bg-gradient-to-r from-[#0066cc] to-[#5ac8fa] text-white font-medium shadow-md"
                  : "bg-[#f2f2f7] dark:bg-[#2c2c2e] hover:bg-[#e5e5ea] dark:hover:bg-[#3a3a3c]"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full overflow-hidden bg-white py-12 dark:bg-[#1d1d1f] md:py-24 lg:py-32">
          <div className="container relative px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-[#34c759] to-[#30d158] text-white shadow-md">
                <Code className="h-10 w-10" />
              </div>
              <div className="max-w-3xl space-y-2">
                <h2 className="bg-gradient-to-r from-[#34c759] to-[#30d158] bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-5xl">
                  {t.digital.terms.title}
                </h2>
                <p className="text-[#6e6e73] dark:text-[#86868b] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t.digital.terms.description}
                </p>
              </div>
            </div>

            <div className="mx-auto mt-12 max-w-3xl">
              <div className="grid gap-8">
                {terms.map((term, index) => (
                  <div
                    key={index}
                    className="flex transform flex-col justify-center space-y-4 rounded-3xl border border-[#e5e5ea] bg-white p-8 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-[#3a3a3c] dark:bg-[#2c2c2e]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#34c759] to-[#30d158] text-white shadow-md">
                        <Check className="h-5 w-5" />
                      </div>
                      <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white">
                        {term.title}
                      </h3>
                    </div>
                    <p className="text-[#6e6e73] dark:text-[#86868b]">
                      {term.content}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-12 rounded-3xl border border-[#e5e5ea] bg-white p-8 text-center shadow-lg dark:border-[#3a3a3c] dark:bg-[#2c2c2e]">
                <p className="text-sm text-[#6e6e73] dark:text-[#86868b]">
                  {language === "fr"
                    ? "Dernière mise à jour : Avril 2024"
                    : "Last updated: April 2024"}
                </p>
                <Button
                  className="mt-4 rounded-xl bg-gradient-to-r from-[#34c759] to-[#30d158] px-6 py-2.5 text-white shadow-md hover:opacity-90"
                  onClick={() => window.print()}
                >
                  {language === "fr"
                    ? "Imprimer les conditions"
                    : "Print Terms"}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full shrink-0 border-t border-[#e5e5ea] bg-white py-12 dark:border-[#3a3a3c] dark:bg-[#1d1d1f]">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="mr-2 text-3xl">🇪🇺</span>
                <span className="bg-gradient-to-r from-[#0066cc] to-[#5ac8fa] bg-clip-text text-xl font-bold text-transparent">
                  U.S.E
                </span>
              </div>
              <p className="mt-2 text-sm text-[#6e6e73] dark:text-[#86868b]">
                {t.footer.rights}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold">{t.nav.about}</h3>
              <nav className="flex flex-col gap-3">
                <Link
                  className="text-sm text-[#6e6e73] transition-colors hover:text-[#0066cc] dark:text-[#86868b] dark:hover:text-[#5ac8fa]"
                  href="/about/privacy"
                >
                  {t.about.privacy.title}
                </Link>
                <Link
                  className="text-sm text-[#6e6e73] transition-colors hover:text-[#0066cc] dark:text-[#86868b] dark:hover:text-[#5ac8fa]"
                  href="/about/economy"
                >
                  {t.about.economy.title}
                </Link>
                <Link
                  className="text-sm text-[#6e6e73] transition-colors hover:text-[#0066cc] dark:text-[#86868b] dark:hover:text-[#5ac8fa]"
                  href="/about/quality"
                >
                  {t.about.quality.title}
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold">{t.nav.digital}</h3>
              <nav className="flex flex-col gap-3">
                <Link
                  className="text-sm text-[#6e6e73] transition-colors hover:text-[#0066cc] dark:text-[#86868b] dark:hover:text-[#5ac8fa]"
                  href="/digital/terms"
                >
                  {t.footer.terms}
                </Link>
                <Link
                  className="text-sm text-[#6e6e73] transition-colors hover:text-[#0066cc] dark:text-[#86868b] dark:hover:text-[#5ac8fa]"
                  href="/digital/privacy"
                >
                  {t.footer.privacy}
                </Link>
                <Link
                  className="text-sm text-[#6e6e73] transition-colors hover:text-[#0066cc] dark:text-[#86868b] dark:hover:text-[#5ac8fa]"
                  href="/digital/contact"
                >
                  {t.footer.contact}
                </Link>
              </nav>
            </div>
          </div>
          <div className="mt-12 border-t border-[#e5e5ea] pt-8 text-center dark:border-[#3a3a3c]">
            <div className="flex items-center justify-center gap-2">
              <p className="text-xs text-[#8e8e93] dark:text-[#98989d]">
                Designed with ❤️ for European alternatives
              </p>
              <Badge
                variant="outline"
                className="border-0 bg-gradient-to-r from-[#0066cc] to-[#5ac8fa] px-2 py-0.5 text-xs text-white shadow-sm"
              >
                v0.1
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

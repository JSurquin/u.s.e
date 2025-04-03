"use client";

import type React from "react";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ChevronLeft, Filter, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAllProducts } from "@/src/presentation/hooks/useAllProducts";
import { Product } from "@/types/products";
import { translations } from "@/data/translations";
import {
  CategoryTranslations,
  SubcategoryTranslations,
} from "@/types/translations";

type FilteredProduct = Product & {
  subcategoryTitle: string;
};

export default function AllProducts() {
  // État pour suivre si le composant est monté
  const [isMounted, setIsMounted] = useState(false);

  // Hooks de base - toujours appelés dans le même ordre
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<keyof CategoryTranslations>("all");
  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [debug, setDebug] = useState(false);

  const { products, categories, subcategories, loading, error } =
    useAllProducts({
      language,
      category: activeCategory,
      subcategory: activeSubcategory,
      searchQuery,
    });

  const t = translations[language];

  // Initialisation des états à partir des paramètres d'URL
  useEffect(() => {
    setIsMounted(true);

    const query = searchParams?.get("q");
    const category = searchParams?.get("category") as
      | keyof CategoryTranslations
      | null;
    const subcategory = searchParams?.get("subcategory");

    if (query) setSearchQuery(query);
    if (category) setActiveCategory(category);
    if (subcategory) setActiveSubcategory(subcategory);
  }, [searchParams]);

  // Fonction pour filtrer les produits
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.map((product) => ({
      ...product,
      subcategoryTitle:
        t.subcategories[product.category]?.[product.subcategory] ||
        product.subcategory,
    }));
  }, [products, t.subcategories]);

  // Fonction pour gérer la recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem("search") as HTMLInputElement;
    setSearchQuery(input.value);
  };

  // Fonction pour gérer le changement de catégorie
  const handleCategoryChange = (category: keyof CategoryTranslations) => {
    setActiveCategory(category);
    setActiveSubcategory("all");
  };

  // Fonction pour gérer le changement de sous-catégorie
  const handleSubcategoryChange = (subcategory: string) => {
    setActiveSubcategory(subcategory);
  };

  // Fonction pour réinitialiser les filtres
  const handleClearFilters = () => {
    setActiveCategory("all");
    setActiveSubcategory("all");
    setSearchQuery("");
  };

  // Fonction pour gérer le changement de langue
  const handleLanguageChange = (lang: "fr" | "en") => {
    setLanguage(lang);
  };

  // Fonction pour diviser une chaîne en tableau d'éléments
  const splitItems = (items: string): string[] => {
    return items.split(",").map((item) => item.trim());
  };

  // Helper function pour accéder aux traductions de manière sécurisée
  const getSubcategoryTranslation = (
    category: string,
    subcategory: string
  ): string => {
    const subcategories =
      t.subcategories[category as keyof typeof t.subcategories];
    if (typeof subcategories === "string") return "";

    const subcategoryObject = subcategories as Record<string, string>;
    return subcategoryObject[subcategory] || "";
  };

  // Afficher un état de chargement pendant le montage du composant
  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f7] dark:bg-[#1d1d1f]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e5e5ea] border-t-[#0066cc] dark:border-[#3a3a3c] dark:border-t-[#5ac8fa]"></div>
          <div className="font-medium text-[#0066cc] dark:text-[#5ac8fa]">
            {language === "fr" ? "Chargement en cours..." : "Loading..."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f7] dark:bg-[#1d1d1f]">
      <header className="sticky top-0 z-50 w-full bg-white/80 shadow-sm backdrop-blur-2xl dark:bg-[#1d1d1f]/90">
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
          <div className="ml-4 flex items-center">
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

          {/* Back to Home */}
          <div className="flex flex-1 justify-end">
            <Link href="/">
              <Button
                variant="ghost"
                className="flex items-center gap-1 rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
                {t.backToHome}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container max-w-[1800px] flex-1 px-4 py-8 md:px-6">
        <div className="mb-8 flex flex-col space-y-4">
          <h1 className="bg-gradient-to-r from-[#0066cc] to-[#5ac8fa] bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
            {t.title}
          </h1>
          <p className="max-w-3xl text-[#6e6e73] dark:text-[#86868b]">
            {t.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr] xl:gap-12">
          {/* Filters - Desktop */}
          <div className="sticky top-24 hidden space-y-6 self-start lg:block">
            <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm dark:bg-[#2c2c2e]">
              <h3 className="text-lg font-medium">{t.filters}</h3>

              <div className="space-y-2">
                <h4 className="text-sm text-[#6e6e73] dark:text-[#86868b]">
                  {t.categories.all}
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setActiveCategory("all");
                      setActiveSubcategory("all");
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                      activeCategory === "all"
                        ? "bg-[#0066cc] text-white"
                        : "hover:bg-[#f2f2f7] dark:hover:bg-[#3a3a3c]"
                    }`}
                  >
                    {t.categories.all}
                  </button>
                  {Object.keys(t.categories)
                    .filter((cat) => cat !== "all")
                    .map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setActiveCategory(
                            category as keyof CategoryTranslations
                          );
                          setActiveSubcategory("all");
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          activeCategory === category
                            ? "bg-[#0066cc] text-white"
                            : "hover:bg-[#f2f2f7] dark:hover:bg-[#3a3a3c]"
                        }`}
                      >
                        {t.categories[category]}
                      </button>
                    ))}
                </div>
              </div>

              {activeCategory !== "all" && (
                <div className="space-y-2">
                  <h4 className="text-sm text-[#6e6e73] dark:text-[#86868b]">
                    {t.subcategories.all}
                  </h4>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setActiveSubcategory("all");
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        activeSubcategory === "all"
                          ? "bg-[#0066cc] text-white"
                          : "hover:bg-[#f2f2f7] dark:hover:bg-[#3a3a3c]"
                      }`}
                    >
                      {t.subcategories.all}
                    </button>
                    {Object.keys(t.subcategories[activeCategory] || {}).map(
                      (subcategory) => (
                        <button
                          key={subcategory}
                          onClick={() => {
                            setActiveSubcategory(subcategory);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                            activeSubcategory === subcategory
                              ? "bg-[#0066cc] text-white"
                              : "hover:bg-[#f2f2f7] dark:hover:bg-[#3a3a3c]"
                          }`}
                        >
                          {getSubcategoryTranslation(
                            activeCategory as string,
                            subcategory
                          )}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="mt-4 w-full rounded-lg"
              >
                {t.clearFilters}
              </Button>

              {/* Debug toggle - hidden in production */}
              <div className="hidden">
                <label className="mt-4 flex items-center space-x-2 text-xs">
                  <input
                    type="checkbox"
                    checked={debug}
                    onChange={() => setDebug(!debug)}
                    className="rounded"
                  />
                  <span>Debug mode</span>
                </label>
              </div>
            </div>
          </div>

          {/* Filters - Mobile */}
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-full"
              onClick={() => setIsFiltersOpen(true)}
            >
              <Filter className="h-4 w-4" />
              {t.filters}
            </Button>

            <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="space-y-6 py-6">
                  <h3 className="text-lg font-medium">{t.filters}</h3>

                  <div className="space-y-2">
                    <h4 className="text-sm text-[#6e6e73] dark:text-[#86868b]">
                      {t.categories.all}
                    </h4>
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setActiveCategory("all");
                          setActiveSubcategory("all");
                          setIsFiltersOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          activeCategory === "all"
                            ? "bg-[#0066cc] text-white"
                            : "hover:bg-[#f2f2f7] dark:hover:bg-[#3a3a3c]"
                        }`}
                      >
                        {t.categories.all}
                      </button>
                      {Object.keys(t.categories)
                        .filter((cat) => cat !== "all")
                        .map((category) => (
                          <button
                            key={category}
                            onClick={() => {
                              setActiveCategory(
                                category as keyof CategoryTranslations
                              );
                              setActiveSubcategory("all");
                              setIsFiltersOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                              activeCategory === category
                                ? "bg-[#0066cc] text-white"
                                : "hover:bg-[#f2f2f7] dark:hover:bg-[#3a3a3c]"
                            }`}
                          >
                            {t.categories[category]}
                          </button>
                        ))}
                    </div>
                  </div>

                  {activeCategory !== "all" && (
                    <div className="space-y-2">
                      <h4 className="text-sm text-[#6e6e73] dark:text-[#86868b]">
                        {t.subcategories.all}
                      </h4>
                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            setActiveSubcategory("all");
                            setIsFiltersOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                            activeSubcategory === "all"
                              ? "bg-[#0066cc] text-white"
                              : "hover:bg-[#f2f2f7] dark:hover:bg-[#3a3a3c]"
                          }`}
                        >
                          {t.subcategories.all}
                        </button>
                        {Object.keys(t.subcategories[activeCategory] || {}).map(
                          (subcategory) => (
                            <button
                              key={subcategory}
                              onClick={() => {
                                setActiveSubcategory(subcategory);
                                setIsFiltersOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                                activeSubcategory === subcategory
                                  ? "bg-[#0066cc] text-white"
                                  : "hover:bg-[#f2f2f7] dark:hover:bg-[#3a3a3c]"
                              }`}
                            >
                              {getSubcategoryTranslation(
                                activeCategory as string,
                                subcategory
                              )}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleClearFilters();
                      setIsFiltersOpen(false);
                    }}
                    className="mt-4 w-full rounded-lg"
                  >
                    {t.clearFilters}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="mb-6 flex flex-col gap-2 sm:flex-row"
            >
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-[#8e8e93]" />
                <Input
                  type="text"
                  placeholder={t.search}
                  className="h-12 rounded-full border-[#d1d1d6] bg-white/90 py-2 pl-10 pr-4 backdrop-blur-sm dark:border-[#3a3a3c] dark:bg-[#2c2c2e]/90"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transform text-[#8e8e93] hover:text-[#3a3a3c] dark:hover:text-[#d1d1d6]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button
                type="submit"
                className="h-12 rounded-full bg-gradient-to-r from-[#0066cc] to-[#5ac8fa] text-white shadow-md transition-all duration-300 hover:from-[#0055aa] hover:to-[#4ab8ea] hover:shadow-lg"
              >
                {t.searchButton}
              </Button>
            </form>

            {/* Results Count */}
            <div className="mb-4 text-sm text-[#6e6e73] dark:text-[#86868b]">
              {filteredProducts.length} {t.resultsCount}
            </div>

            {/* Results */}
            {filteredProducts.length > 0 ? (
              <div className="grid max-w-[1800px] gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredProducts.map((product, index) => (
                  <Card
                    key={index}
                    className="transform overflow-hidden rounded-2xl border-0 bg-white shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-lg dark:bg-[#2c2c2e]"
                  >
                    {(product.popular ||
                      product.new ||
                      product.recommended) && (
                      <div className="absolute right-4 top-4">
                        {product.popular && (
                          <Badge className="border-0 bg-gradient-to-r from-[#0066cc] to-[#5ac8fa] py-0.5 text-xs shadow-sm hover:from-[#0055aa] hover:to-[#4ab8ea]">
                            {t.popular}
                          </Badge>
                        )}
                        {product.new && (
                          <Badge className="border-0 bg-gradient-to-r from-[#af52de] to-[#5856d6] py-0.5 text-xs shadow-sm hover:from-[#9f42ce] hover:to-[#4846c6]">
                            {t.new}
                          </Badge>
                        )}
                        {product.recommended && (
                          <Badge className="border-0 bg-gradient-to-r from-[#34c759] to-[#30d158] py-0.5 text-xs shadow-sm hover:from-[#2eb350] hover:to-[#28bd4c]">
                            {t.recommended}
                          </Badge>
                        )}
                      </div>
                    )}
                    <CardHeader className="px-5 pb-0 pt-5">
                      <CardTitle className="text-xl font-medium">
                        {product.subcategoryTitle}
                      </CardTitle>
                      <CardDescription className="text-[#6e6e73] dark:text-[#86868b]">
                        {t.categories[product.category]}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-5 pb-5 pt-3">
                      <div className="space-y-4 rounded-xl bg-[#f2f2f7] p-4 dark:bg-[#3a3a3c]">
                        {/* Improved layout for multiple alternatives */}
                        <div className="grid grid-cols-1 gap-4">
                          {/* American Products */}
                          <div>
                            <h4 className="mb-1 text-xs font-medium text-[#8e8e93]">
                              {t.americanProducts}
                            </h4>
                            <div className="flex items-start gap-2">
                              <span className="mt-0.5 shrink-0 font-medium text-[#ff3b30]">
                                🇺🇸
                              </span>
                              <span className="break-words text-sm font-medium sm:text-base">
                                {product.title}
                              </span>
                            </div>
                          </div>

                          {/* European Alternatives */}
                          <div>
                            <h4 className="mb-1 text-xs font-medium text-[#8e8e93]">
                              {t.alternatives}
                            </h4>
                            <div className="flex items-start gap-2">
                              <span className="mt-0.5 shrink-0 font-medium text-[#0066cc]">
                                🇪🇺
                              </span>
                              <div className="flex flex-col gap-1">
                                {splitItems(product.eu).map((item, i) => (
                                  <span
                                    key={i}
                                    className="break-words text-sm font-medium sm:text-base"
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Notes */}
                          <div>
                            <h4 className="mb-1 text-xs font-medium text-[#8e8e93]">
                              {t.notes}
                            </h4>
                            <p className="text-sm italic text-[#6e6e73] dark:text-[#86868b]">
                              {product.note}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-between">
                        <Button
                          variant="ghost"
                          className="h-auto rounded-full px-3 py-1 text-xs text-[#0066cc] hover:bg-[#f2f2f7] dark:text-[#5ac8fa] dark:hover:bg-[#3a3a3c]"
                        >
                          {t.discover}
                        </Button>
                        <Button
                          variant="ghost"
                          className="h-auto rounded-full px-3 py-1 text-xs text-[#0066cc] hover:bg-[#f2f2f7] dark:text-[#5ac8fa] dark:hover:bg-[#3a3a3c]"
                        >
                          {t.compare}
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="mb-4 text-[#6e6e73] dark:text-[#86868b]">
                  {t.noResults}
                </p>
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="rounded-full"
                >
                  {t.clearFilters}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="w-full shrink-0 border-t border-[#e5e5ea] bg-white py-8 dark:border-[#3a3a3c] dark:bg-[#1d1d1f]">
        <div className="container px-4 text-center md:px-6">
          <p className="text-xs text-[#8e8e93] dark:text-[#98989d]">
            Designed with ❤️ for European alternatives
          </p>
        </div>
      </footer>
    </div>
  );
}

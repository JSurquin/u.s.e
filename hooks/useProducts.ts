"use client";
import { useState, useEffect } from "react";
import { AllProductsData, Language, LanguageData } from "@/types/products";
import productsData from "@/data/products.json";

const isAllProductsData = (data: unknown): data is AllProductsData => {
  if (!data || typeof data !== "object") return false;

  const typedData = data as Record<string, unknown>;
  return Object.values(typedData).every((langData) => {
    if (!langData || typeof langData !== "object") return false;
    const typedLangData = langData as Record<string, unknown>;
    return "products" in typedLangData;
  });
};

export const useProducts = (language: Language = "fr") => {
  const [products, setProducts] = useState<AllProductsData>(
    {} as AllProductsData
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        if (isAllProductsData(productsData)) {
          setProducts(productsData);
        } else {
          throw new Error("Format de données invalide");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [language]);

  return {
    products: products[language]?.products || {},
    loading,
    error,
  };
};

import { useState, useEffect } from "react";
import { Product } from "../../domain/entities/Product";
import { JsonProductRepository } from "../../infrastructure/repositories/JsonProductRepository";
import { CategoryTranslations } from "../../../types/translations";

const productRepository = new JsonProductRepository();

interface UseAllProductsParams {
  language: "fr" | "en";
  category: keyof CategoryTranslations;
  subcategory: string;
  searchQuery: string;
}

export const useAllProducts = ({
  language,
  category,
  subcategory,
  searchQuery,
}: UseAllProductsParams) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Récupérer tous les produits
        let allProducts = productRepository.getAllProducts();

        // Filtrer par catégorie si nécessaire
        if (category !== "all") {
          allProducts = allProducts.filter((p) => p.category === category);
        }

        // Filtrer par sous-catégorie si nécessaire
        if (subcategory !== "all") {
          allProducts = allProducts.filter(
            (p) => p.subcategory === subcategory
          );
        }

        // Filtrer par recherche si nécessaire
        if (searchQuery.trim() !== "") {
          const searchResults = productRepository.searchProducts(searchQuery);
          if (category !== "all") {
            allProducts = searchResults.filter((p) => p.category === category);
          } else {
            allProducts = searchResults;
          }
        }

        // Récupérer les catégories et sous-catégories
        const allCategories = productRepository.getCategories();
        const currentSubcategories =
          category === "all"
            ? []
            : productRepository.getSubcategories(category);

        setProducts(allProducts);
        setCategories(allCategories);
        setSubcategories(currentSubcategories);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          err instanceof Error ? err : new Error("Une erreur est survenue")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language, category, subcategory, searchQuery]);

  return {
    products,
    categories,
    subcategories,
    loading,
    error,
  };
};

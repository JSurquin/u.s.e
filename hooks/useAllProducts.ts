"use client";

import { useState, useEffect } from "react";
import {
  GetAllProductsUseCase,
  FilteredProduct,
} from "../src/application/use-cases/GetAllProductsUseCase";
import { JsonProductRepository } from "../src/infrastructure/repositories/JsonProductRepository";

const productRepository = new JsonProductRepository();
const getAllProductsUseCase = new GetAllProductsUseCase(productRepository);

interface UseAllProductsParams {
  language: string;
  category?: string;
  subcategory?: string;
  searchQuery?: string;
}

export const useAllProducts = ({
  language,
  category = "all",
  subcategory = "all",
  searchQuery = "",
}: UseAllProductsParams) => {
  const [products, setProducts] = useState<FilteredProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = () => {
      try {
        setLoading(true);

        // Récupérer les produits filtrés
        const filteredProducts = getAllProductsUseCase.execute({
          language,
          category,
          subcategory,
          searchQuery,
        });

        // Récupérer les catégories
        const availableCategories =
          getAllProductsUseCase.getCategories(language);

        // Récupérer les sous-catégories si une catégorie est sélectionnée
        const availableSubcategories =
          category !== "all"
            ? getAllProductsUseCase.getSubcategories(language, category)
            : [];

        setProducts(filteredProducts);
        setCategories(availableCategories);
        setSubcategories(availableSubcategories);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Une erreur est survenue")
        );
        setProducts([]);
        setCategories([]);
        setSubcategories([]);
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

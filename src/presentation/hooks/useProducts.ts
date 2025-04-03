"use client";

import { useState, useEffect } from "react";
import { Product } from "../../domain/entities/Product";
import { JsonProductRepository } from "../../infrastructure/repositories/JsonProductRepository";

const productRepository = new JsonProductRepository();

export const useProducts = () => {
  const [products, setProducts] = useState<Record<string, Record<string, any>>>(
    {}
  );
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = () => {
      try {
        console.log("Fetching data...");
        const allCategories = productRepository.getCategories();
        const productsData: Record<string, Record<string, any>> = {};

        // Construire l'objet des produits par catégorie et sous-catégorie
        allCategories.forEach((category) => {
          productsData[category] = {};
          const subcategories = productRepository.getSubcategories(category);
          subcategories.forEach((subcategory) => {
            const products = productRepository.getProductsByCategory(category);
            if (products && products.length > 0) {
              productsData[category][subcategory] = products[0];
            }
          });
        });

        console.log("Products:", productsData);
        console.log("Categories:", allCategories);
        setProducts(productsData);
        setCategories(allCategories);
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
  }, []);

  const getProductsByCategory = (category: string) => {
    return productRepository.getProductsByCategory(category);
  };

  const getSubcategories = (category: string) => {
    return productRepository.getSubcategories(category);
  };

  const searchProducts = (query: string) => {
    return productRepository.searchProducts(query);
  };

  return {
    products,
    categories,
    loading,
    error,
    getProductsByCategory,
    getSubcategories,
    searchProducts,
  };
};

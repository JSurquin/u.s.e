"use client";
import { useState, useEffect } from "react";
import { Product } from "../src/domain/entities/Product";
import { GetProductsUseCase } from "../src/application/use-cases/GetProductsUseCase";
import { JsonProductRepository } from "../src/infrastructure/repositories/JsonProductRepository";

const productRepository = new JsonProductRepository();
const getProductsUseCase = new GetProductsUseCase(productRepository);

export const useProducts = (language: "fr" | "en" = "fr") => {
  const [products, setProducts] = useState<
    Record<string, Record<string, Product>>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = () => {
      try {
        setLoading(true);
        const allProducts = getProductsUseCase.execute({ language });

        // Convertir le tableau plat en structure imbriquée
        const structuredProducts = allProducts.reduce((acc, product) => {
          if (!product.category) return acc;

          if (!acc[product.category]) {
            acc[product.category] = {};
          }

          if (product.subcategory) {
            acc[product.category][product.subcategory] = {
              title: product.title,
              description: product.description,
              us: product.us,
              eu: product.eu,
              note: product.note || "",
            };
          }

          return acc;
        }, {} as Record<string, Record<string, Product>>);

        setProducts(structuredProducts);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Une erreur est survenue")
        );
        setProducts({});
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [language]);

  return {
    products,
    loading,
    error,
  };
};

"use client";

import React, { useState, useEffect } from "react";
import { ProductList } from "../components/ProductList";
import { useProducts } from "../hooks/useProducts";
import "../styles/globals.css";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export const HomePage: React.FC = () => {
  const {
    products,
    categories,
    loading,
    error,
    getProductsByCategory,
    searchProducts,
  } = useProducts();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);

  useEffect(() => {
    console.log("Products updated:", products);
    console.log("Categories updated:", categories);
    if (activeCategory === "all") {
      setDisplayedProducts(products);
    } else {
      const filteredProducts = getProductsByCategory(activeCategory);
      setDisplayedProducts(filteredProducts);
    }
  }, [products, activeCategory, getProductsByCategory]);

  const handleCategoryChange = (category: string) => {
    console.log("Category changed to:", category);
    setActiveCategory(category);
  };

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    setSearchQuery(query);
    if (query.trim() === "") {
      if (activeCategory === "all") {
        setDisplayedProducts(products);
      } else {
        setDisplayedProducts(getProductsByCategory(activeCategory));
      }
    } else {
      const searchResults = searchProducts(query);
      if (activeCategory !== "all") {
        setDisplayedProducts(
          searchResults.filter((p) => p.category === activeCategory)
        );
      } else {
        setDisplayedProducts(searchResults);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Guide des Produits</h1>

      <div className="mb-8">
        <Input
          type="text"
          placeholder="Rechercher un produit..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full max-w-md"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <Button
          variant={activeCategory === "all" ? "default" : "outline"}
          onClick={() => handleCategoryChange("all")}
        >
          Toutes les catégories
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <ProductList
        products={displayedProducts}
        loading={loading}
        error={error}
      />
    </div>
  );
};

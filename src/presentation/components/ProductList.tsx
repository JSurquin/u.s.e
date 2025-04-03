"use client";

import React from "react";
import { Product } from "../../domain/entities/Product";

interface ProductListProps {
  products: Product[];
  loading: boolean;
  error: Error | null;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  loading,
  error,
}) => {
  console.log("ProductList rendering with:", { products, loading, error });

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error.message}</div>;
  }

  if (products.length === 0) {
    return <div className="text-center py-8">Aucun produit trouvé</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={`${product.category}-${product.subcategory}-${product.title}`}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">US:</span>
              <span className="text-blue-600">{product.us}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">EU:</span>
              <span className="text-green-600">{product.eu}</span>
            </div>
            {product.note && (
              <div className="mt-4 text-sm text-gray-500">
                <span className="font-medium">Note:</span> {product.note}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

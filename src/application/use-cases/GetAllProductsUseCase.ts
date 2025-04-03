import { Product } from "../../domain/entities/Product";
import { JsonProductRepository } from "../../infrastructure/repositories/JsonProductRepository";

export interface FilteredProduct extends Product {
  category: string;
  subcategory: string;
  subcategoryTitle: string;
}

interface GetAllProductsParams {
  language: string;
  category?: string;
  subcategory?: string;
  searchQuery?: string;
}

export class GetAllProductsUseCase {
  constructor(private productRepository: JsonProductRepository) {}

  execute({
    language,
    category,
    subcategory,
    searchQuery,
  }: GetAllProductsParams): FilteredProduct[] {
    const allProducts = this.productRepository.getAllProducts(language);
    const filteredProducts: FilteredProduct[] = [];

    Object.entries(allProducts).forEach(([categoryKey, categoryData]) => {
      if (category && category !== "all" && category !== categoryKey) return;

      Object.entries(categoryData).forEach(([subcategoryKey, productData]) => {
        if (
          subcategory &&
          subcategory !== "all" &&
          subcategory !== subcategoryKey
        )
          return;

        if (typeof productData === "object" && productData !== null) {
          const product = productData as Product;

          // Vérifier si le produit correspond à la recherche
          const matchesSearch =
            !searchQuery ||
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.eu.toLowerCase().includes(searchQuery.toLowerCase());

          if (matchesSearch) {
            filteredProducts.push({
              ...product,
              category: categoryKey,
              subcategory: subcategoryKey,
              subcategoryTitle: product.title,
            });
          }
        }
      });
    });

    return filteredProducts;
  }

  getCategories(language: string): string[] {
    return this.productRepository.getCategories();
  }

  getSubcategories(language: string, category: string): string[] {
    if (category === "all") return [];
    return this.productRepository.getSubcategories(language, category);
  }
}

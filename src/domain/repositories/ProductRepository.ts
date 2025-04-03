import { Product } from "../entities/Product";

export interface ProductRepository {
  getAllProducts(): Product[];
  getCategories(): string[];
  getSubcategories(category: string): string[];
  getProductsByCategory(category: string): Product[];
  searchProducts(query: string): Product[];
}

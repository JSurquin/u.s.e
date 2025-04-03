import { Product, ProductsData } from "../../domain/entities/Product";
import { JsonProductRepository } from "../../infrastructure/repositories/JsonProductRepository";

interface GetProductsParams {
  language: string;
  category?: string;
  searchQuery?: string;
}

export class GetProductsUseCase {
  constructor(private productRepository: JsonProductRepository) {}

  execute({ language, category, searchQuery }: GetProductsParams): Product[] {
    if (searchQuery) {
      return this.productRepository.searchProducts(searchQuery, language);
    }

    if (category) {
      const categoryProducts =
        this.productRepository.getProductsByCategory(category);
      return Object.entries(categoryProducts).map(([subcategory, product]) => ({
        ...product,
        category,
        subcategory,
      }));
    }

    const allProducts = this.productRepository.getAllProducts(language);
    const products: Product[] = [];

    Object.entries(allProducts).forEach(([category, categoryData]) => {
      Object.entries(categoryData).forEach(([subcategory, product]) => {
        products.push({
          ...product,
          category,
          subcategory,
        });
      });
    });

    return products;
  }

  getCategories(): string[] {
    return this.productRepository.getCategories();
  }

  async getAvailableLanguages(): Promise<string[]> {
    try {
      return await this.productRepository.getAvailableLanguages();
    } catch (error: any) {
      throw new Error(`Failed to get available languages: ${error.message}`);
    }
  }
}

import { ProductRepository } from "../../domain/repositories/ProductRepository";
import { Product, ProductsData } from "../../domain/entities/Product";
import productsData from "../../../data/products.json";

export class JsonProductRepository implements ProductRepository {
  private data: ProductsData;

  constructor() {
    this.data = productsData as ProductsData;
  }

  private splitItems(items: string): string[] {
    return items.split(",").map((item) => item.trim());
  }

  async createProduct(product: Omit<Product, "id">): Promise<Product> {
    throw new Error("Not implemented: This is a read-only repository");
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    throw new Error("Not implemented: This is a read-only repository");
  }

  async deleteProduct(id: string): Promise<void> {
    throw new Error("Not implemented: This is a read-only repository");
  }

  async getProductById(id: string): Promise<Product> {
    const products = this.getAllProducts();
    const product = products.find((p) => p.id === id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return product;
  }

  getAllProducts(): Product[] {
    const products: Product[] = [];
    const language = "fr";

    if (!this.data[language]?.products) {
      return products;
    }

    Object.entries(this.data[language].products).forEach(
      ([category, categoryData]) => {
        Object.entries(categoryData).forEach(([subcategory, productData]) => {
          products.push({
            ...productData,
            category,
            subcategory,
          });
        });
      }
    );

    return products;
  }

  getCategories(): string[] {
    const language = "fr";
    if (!this.data[language]?.products) {
      return [];
    }
    return Object.keys(this.data[language].products);
  }

  getSubcategories(category: string): string[] {
    const language = "fr";
    if (!this.data[language]?.products?.[category]) {
      return [];
    }
    return Object.keys(this.data[language].products[category]);
  }

  getProductsByCategory(category: string): Product[] {
    const language = "fr";
    if (!this.data[language]?.products?.[category]) {
      return [];
    }

    const products: Product[] = [];
    Object.entries(this.data[language].products[category]).forEach(
      ([subcategory, productData]) => {
        products.push({
          ...productData,
          category,
          subcategory,
        });
      }
    );

    return products;
  }

  searchProducts(query: string): Product[] {
    const products = this.getAllProducts();
    const searchTerms = query.toLowerCase().split(" ");

    return products.filter((product) => {
      const productText = [
        product.title,
        product.description,
        product.us,
        product.eu,
        product.note,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchTerms.every((term) => productText.includes(term));
    });
  }

  async getProductsByLanguage(language: string): Promise<Product[]> {
    if (!this.data[language]) {
      throw new Error(`Language ${language} not found`);
    }
    const products: Product[] = [];
    Object.values(this.data[language].products).forEach((category) => {
      Object.values(category).forEach((product) => {
        products.push(product);
      });
    });
    return products;
  }

  async getProductsByFilters(filters: {
    language?: string;
    category?: string;
    subcategory?: string;
  }): Promise<Product[]> {
    let products: Product[] = [];
    const language = filters.language || "fr";

    if (filters.subcategory && filters.category) {
      products = await this.getProductsBySubcategory(
        language,
        filters.category,
        filters.subcategory
      );
    } else if (filters.category) {
      products = await this.getProductsByCategory(filters.category);
    } else if (filters.language) {
      products = await this.getProductsByLanguage(filters.language);
    } else {
      products = await this.getAllProducts();
    }

    return products;
  }

  async getProductsBySubcategory(
    language: string,
    categoryId: string,
    subcategoryId: string
  ): Promise<Product[]> {
    const category = await this.getProductsByCategory(language, categoryId);
    return category.filter((p) => p.subcategory === subcategoryId);
  }

  async getAvailableLanguages(): Promise<string[]> {
    return Object.keys(this.data);
  }

  async setDefaultLanguage(language: string): Promise<void> {
    if (!this.data[language]) {
      throw new Error(`Language ${language} not found`);
    }
    // Implementation would depend on how we want to handle default language
    // For now, we'll just ensure the language exists
  }
}

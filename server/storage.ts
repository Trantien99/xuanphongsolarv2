import { type User, type InsertUser, type Category, type InsertCategory, type Product, type InsertProduct, type News, type InsertNews, type CartItem, type InsertCartItem } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(filters?: { categoryId?: string; featured?: boolean; search?: string; limit?: number; offset?: number }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined>;

  // News
  getNews(filters?: { limit?: number; offset?: number }): Promise<News[]>;
  getNewsItem(id: string): Promise<News | undefined>;
  getNewsBySlug(slug: string): Promise<News | undefined>;
  createNews(news: InsertNews): Promise<News>;

  // Cart
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addCartItem(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: string): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private categories: Map<string, Category> = new Map();
  private products: Map<string, Product> = new Map();
  private news: Map<string, News> = new Map();
  private cartItems: Map<string, CartItem> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed categories
    const categories: Category[] = [
      { id: "1", name: "Power Tools", slug: "power-tools", description: "Professional-grade power tools", icon: "fas fa-wrench", imageUrl: "", parentId: null, itemCount: 245 },
      { id: "2", name: "Safety Equipment", slug: "safety-equipment", description: "Industrial safety gear", icon: "fas fa-hard-hat", imageUrl: "", parentId: null, itemCount: 189 },
      { id: "3", name: "Machinery", slug: "machinery", description: "Heavy machinery and equipment", icon: "fas fa-cogs", imageUrl: "", parentId: null, itemCount: 75 },
      { id: "4", name: "Electronics", slug: "electronics", description: "Electronic tools and equipment", icon: "fas fa-bolt", imageUrl: "", parentId: null, itemCount: 321 },
      { id: "5", name: "Materials", slug: "materials", description: "Construction and industrial materials", icon: "fas fa-cubes", imageUrl: "", parentId: null, itemCount: 456 },
      { id: "6", name: "Hand Tools", slug: "hand-tools", description: "Manual tools and implements", icon: "fas fa-tools", imageUrl: "", parentId: null, itemCount: 123 },
    ];

    categories.forEach(cat => this.categories.set(cat.id, cat));

    // Seed products
    const products: Product[] = [
      {
        id: "1",
        name: "DeWalt 20V Max Cordless Drill",
        slug: "dewalt-20v-max-cordless-drill",
        description: "Professional-grade cordless drill with lithium-ion battery technology. Features high-performance motor, LED work light, and ergonomic design for extended use.",
        shortDescription: "Professional-grade power tool with lithium-ion battery",
        price: "189.99",
        originalPrice: "219.99",
        sku: "DW-20V-001",
        brand: "DeWalt",
        categoryId: "1",
        images: ["https://images.unsplash.com/photo-1572981779307-38b8cabb2407?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800"],
        specifications: {
          "Voltage": "20V Max",
          "Battery Type": "Lithium-Ion",
          "Chuck Size": "1/2 inch",
          "Max Torque": "300 UWO",
          "Weight": "3.6 lbs"
        },
        features: ["LED work light", "Ergonomic handle", "Variable speed trigger", "Belt hook"],
        inStock: true,
        stockQuantity: 25,
        rating: "4.8",
        reviewCount: 324,
        isActive: true,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "2",
        name: "3M Hard Hat with Face Shield",
        slug: "3m-hard-hat-face-shield",
        description: "ANSI Z89.1 certified protection helmet with integrated face shield. Provides superior head and face protection for industrial environments.",
        shortDescription: "ANSI Z89.1 certified protection helmet",
        price: "45.99",
        originalPrice: null,
        sku: "3M-HH-001",
        brand: "3M",
        categoryId: "2",
        images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800"],
        specifications: {
          "Certification": "ANSI Z89.1",
          "Material": "High-density polyethylene",
          "Weight": "1.2 lbs",
          "Size": "Universal"
        },
        features: ["Face shield included", "Adjustable suspension", "Electrical insulation", "Impact resistant"],
        inStock: true,
        stockQuantity: 50,
        rating: "4.6",
        reviewCount: 156,
        isActive: true,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "3",
        name: "Fluke 117 Digital Multimeter",
        slug: "fluke-117-digital-multimeter",
        description: "True RMS digital multimeter designed for electricians. Features VoltAlert technology, AutoV/LoZ function, and easy-to-use interface.",
        shortDescription: "True RMS digital multimeter for electricians",
        price: "239.99",
        originalPrice: null,
        sku: "FL-117-001",
        brand: "Fluke",
        categoryId: "4",
        images: ["https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800"],
        specifications: {
          "Display": "6000 count digital",
          "True RMS": "Yes",
          "Voltage Range": "600V AC/DC",
          "Current Range": "10A AC/DC",
          "Safety Rating": "CAT III 600V"
        },
        features: ["VoltAlert technology", "AutoV/LoZ function", "Min/Max recording", "Data hold"],
        inStock: true,
        stockQuantity: 15,
        rating: "4.9",
        reviewCount: 89,
        isActive: true,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "4",
        name: "Lincoln MIG Welder 180C",
        slug: "lincoln-mig-welder-180c",
        description: "Professional MIG welder with digital display and advanced wire feed system. Perfect for industrial welding applications.",
        shortDescription: "Professional MIG welder with digital display",
        price: "899.99",
        originalPrice: null,
        sku: "LN-180C-001",
        brand: "Lincoln",
        categoryId: "3",
        images: ["https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800"],
        specifications: {
          "Amperage Range": "30-180A",
          "Duty Cycle": "20% at 180A",
          "Wire Size": ".023-.035 inch",
          "Input Power": "208/230V",
          "Weight": "46 lbs"
        },
        features: ["Digital display", "Advanced wire feed", "Thermal overload protection", "Easy setup"],
        inStock: true,
        stockQuantity: 8,
        rating: "4.7",
        reviewCount: 203,
        isActive: true,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "5",
        name: "Bosch 4.5\" Angle Grinder",
        slug: "bosch-45-angle-grinder",
        description: "11 Amp corded angle grinder with auxiliary handle for enhanced control and comfort during extended use.",
        shortDescription: "11 Amp corded grinder with auxiliary handle",
        price: "79.99",
        originalPrice: "89.99",
        sku: "BS-AG-001",
        brand: "Bosch",
        categoryId: "1",
        images: ["https://pixabay.com/get/gd1a82529b05c70d0e161e090b67201cef8c68317ecb09b78842736b3877257bf0e70f64b6fd33a6968824072d37b76855fdd4cfd8026917b15a5e0e0cf866722_1280.jpg"],
        specifications: {
          "Amperage": "11 Amp",
          "Disc Size": "4.5 inch",
          "No Load Speed": "11,000 RPM",
          "Weight": "4.2 lbs"
        },
        features: ["Auxiliary handle", "Tool-free guard adjustment", "Restart protection", "Spiral bevel gears"],
        inStock: true,
        stockQuantity: 30,
        rating: "4.4",
        reviewCount: 67,
        isActive: true,
        isFeatured: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    products.forEach(product => this.products.set(product.id, product));

    // Seed news
    const newsItems: News[] = [
      {
        id: "1",
        title: "New Safety Regulations for Industrial Equipment",
        slug: "new-safety-regulations-industrial-equipment",
        excerpt: "Updated OSHA guidelines for industrial equipment safety standards effective 2024.",
        content: "The Occupational Safety and Health Administration (OSHA) has announced new safety regulations for industrial equipment...",
        imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        author: "Safety Team",
        publishedAt: new Date("2024-01-15"),
        isPublished: true,
        tags: ["safety", "regulations", "OSHA"],
        createdAt: new Date()
      },
      {
        id: "2",
        title: "Top 10 Power Tools for 2024",
        slug: "top-10-power-tools-2024",
        excerpt: "Our comprehensive review of the best power tools for professional use in 2024.",
        content: "As we enter 2024, the power tool industry continues to innovate with new technologies and improved performance...",
        imageUrl: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        author: "Product Team",
        publishedAt: new Date("2024-01-10"),
        isPublished: true,
        tags: ["power tools", "review", "2024"],
        createdAt: new Date()
      }
    ];

    newsItems.forEach(item => this.news.set(item.id, item));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Product methods
  async getProducts(filters?: { categoryId?: string; featured?: boolean; search?: string; limit?: number; offset?: number }): Promise<Product[]> {
    let products = Array.from(this.products.values()).filter(p => p.isActive);

    if (filters?.categoryId) {
      products = products.filter(p => p.categoryId === filters.categoryId);
    }

    if (filters?.featured !== undefined) {
      products = products.filter(p => p.isFeatured === filters.featured);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.brand.toLowerCase().includes(searchLower)
      );
    }

    // Sort by featured first, then by name
    products.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return a.name.localeCompare(b.name);
    });

    const offset = filters?.offset || 0;
    const limit = filters?.limit || products.length;

    return products.slice(offset, offset + limit);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(p => p.slug === slug);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct = { 
      ...product, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  // News methods
  async getNews(filters?: { limit?: number; offset?: number }): Promise<News[]> {
    let news = Array.from(this.news.values()).filter(n => n.isPublished);
    
    // Sort by published date (newest first)
    news.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const offset = filters?.offset || 0;
    const limit = filters?.limit || news.length;

    return news.slice(offset, offset + limit);
  }

  async getNewsItem(id: string): Promise<News | undefined> {
    return this.news.get(id);
  }

  async getNewsBySlug(slug: string): Promise<News | undefined> {
    return Array.from(this.news.values()).find(n => n.slug === slug);
  }

  async createNews(insertNews: InsertNews): Promise<News> {
    const id = randomUUID();
    const news: News = { 
      ...insertNews, 
      id, 
      createdAt: new Date() 
    };
    this.news.set(id, news);
    return news;
  }

  // Cart methods
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
  }

  async addCartItem(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.sessionId === insertCartItem.sessionId && item.productId === insertCartItem.productId
    );

    if (existingItem) {
      // Update quantity
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + insertCartItem.quantity
      };
      this.cartItems.set(existingItem.id, updatedItem);
      return updatedItem;
    }

    const id = randomUUID();
    const cartItem: CartItem = { 
      ...insertCartItem, 
      id, 
      createdAt: new Date() 
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;

    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeCartItem(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const items = Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
    items.forEach(item => this.cartItems.delete(item.id));
    return true;
  }
}

export const storage = new MemStorage();

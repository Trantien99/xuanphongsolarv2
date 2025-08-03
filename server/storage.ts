import { type User, type InsertUser, type Category, type InsertCategory, type Product, type InsertProduct, type News, type InsertNews, type CartItem, type InsertCartItem, type Consultation, type InsertConsultation } from "@shared/schema";
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
  getProductsWithCount(filters?: { categoryId?: string; featured?: boolean; search?: string; limit?: number; offset?: number }): Promise<{ products: Product[]; total: number }>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined>;

  // News
  getNews(filters?: { limit?: number; offset?: number; featured?: boolean }): Promise<News[]>;
  getNewsWithCount(filters?: { limit?: number; offset?: number; featured?: boolean }): Promise<{ news: News[]; total: number; hasMore: boolean }>;
  getNewsItem(id: string): Promise<News | undefined>;
  getNewsBySlug(slug: string): Promise<News | undefined>;
  createNews(news: InsertNews): Promise<News>;

  // Cart
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addCartItem(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: string): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;

  // Consultations
  getConsultations(): Promise<Consultation[]>;
  getConsultation(id: string): Promise<Consultation | undefined>;
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  updateConsultation(id: string, updates: Partial<Consultation>): Promise<Consultation | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private categories: Map<string, Category> = new Map();
  private products: Map<string, Product> = new Map();
  private news: Map<string, News> = new Map();
  private cartItems: Map<string, CartItem> = new Map();
  private consultations: Map<string, Consultation> = new Map();

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
      { id: "7", name: "Solar Energy", slug: "solar-energy", description: "Solar panels, batteries, water heaters and renewable energy solutions", icon: "fas fa-sun", imageUrl: "", parentId: null, itemCount: 87 },
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
        images: [
          "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800"
        ],
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
      },
      {
        id: "6",
        name: "Solar Panel 400W Monocrystalline",
        slug: "solar-panel-400w-monocrystalline",
        description: "High-efficiency 400W monocrystalline solar panel with 25-year warranty. Perfect for residential and commercial solar installations.",
        shortDescription: "High-efficiency 400W solar panel with 25-year warranty",
        price: "299.99",
        originalPrice: "349.99",
        sku: "SP-400W-001",
        brand: "SolarTech",
        categoryId: "7",
        images: ["https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800"],
        specifications: {
          "Power Output": "400W",
          "Panel Type": "Monocrystalline",
          "Efficiency": "22.1%",
          "Voltage": "24V",
          "Dimensions": "79.1 x 39.4 x 1.6 inches",
          "Weight": "44 lbs",
          "Warranty": "25 years"
        },
        features: ["High efficiency", "Weather resistant", "Anti-reflective coating", "Bypass diodes"],
        inStock: true,
        stockQuantity: 50,
        rating: "4.9",
        reviewCount: 89,
        isActive: true,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "7",
        name: "Lithium Solar Battery 100Ah",
        slug: "lithium-solar-battery-100ah",
        description: "Deep cycle lithium iron phosphate battery for solar energy storage. Long-lasting and maintenance-free with built-in BMS.",
        shortDescription: "100Ah LiFePO4 battery for solar storage",
        price: "599.99",
        originalPrice: "699.99",
        sku: "LB-100AH-001",
        brand: "PowerStore",
        categoryId: "7", 
        images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800"],
        specifications: {
          "Capacity": "100Ah",
          "Voltage": "12.8V",
          "Battery Type": "LiFePO4",
          "Cycle Life": "6000+ cycles",
          "Operating Temperature": "-4°F to 140°F",
          "Weight": "29 lbs",
          "Warranty": "10 years"
        },
        features: ["Built-in BMS", "Maintenance-free", "Fast charging", "Lightweight design"],
        inStock: true,
        stockQuantity: 35,
        rating: "4.8",
        reviewCount: 156,
        isActive: true,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "8",
        name: "Solar Water Heater 200L",
        slug: "solar-water-heater-200l",
        description: "Thermosiphon solar water heating system with 200L capacity. Eco-friendly solution for hot water needs with evacuated tube collectors.",
        shortDescription: "200L thermosiphon solar water heating system",
        price: "1299.99",
        originalPrice: "1499.99",
        sku: "SWH-200L-001",
        brand: "EcoHeat",
        categoryId: "7",
        images: ["https://images.unsplash.com/photo-1497436072909-f5e4be5c89f0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800"],
        specifications: {
          "Capacity": "200 Liters",
          "Collector Type": "Evacuated Tube",
          "Efficiency": "95%+",
          "Max Temperature": "212°F",
          "Installation": "Roof-mounted",
          "Material": "Stainless Steel Tank",
          "Warranty": "15 years"
        },
        features: ["Evacuated tube technology", "Thermosiphon circulation", "Frost protection", "High efficiency"],
        inStock: true,
        stockQuantity: 12,
        rating: "4.7",
        reviewCount: 43,
        isActive: true,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "9",
        name: "Solar Inverter 3000W",
        slug: "solar-inverter-3000w",
        description: "Pure sine wave solar inverter with MPPT charge controller. Converts DC power from solar panels to AC power for home use.",
        shortDescription: "3000W pure sine wave inverter with MPPT",
        price: "449.99",
        originalPrice: null,
        sku: "SI-3000W-001",
        brand: "SolarPower",
        categoryId: "7",
        images: ["https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800"],
        specifications: {
          "Power Output": "3000W",
          "Input Voltage": "12V/24V DC",
          "Output Voltage": "110V/220V AC",
          "Efficiency": "95%",
          "Wave Form": "Pure Sine Wave",
          "MPPT Range": "60V-150V",
          "Weight": "22 lbs"
        },
        features: ["MPPT charge controller", "LCD display", "Multiple protections", "Remote monitoring"],
        inStock: true,
        stockQuantity: 28,
        rating: "4.6",
        reviewCount: 94,
        isActive: true,
        isFeatured: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "10",
        name: "Solar-Powered Elevator System",
        slug: "solar-powered-elevator-system",
        description: "Energy-efficient elevator system powered by solar panels. Complete solution for low-rise buildings with backup battery system.",
        shortDescription: "Solar-powered elevator with backup battery",
        price: "15999.99",
        originalPrice: "18999.99",
        sku: "SPE-001",
        brand: "GreenLift",
        categoryId: "7",
        images: ["https://images.unsplash.com/photo-1581091870621-0c632462e2c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800"],
        specifications: {
          "Capacity": "1000 kg",
          "Travel Height": "Up to 20m",
          "Speed": "1.0 m/s",
          "Solar Panels": "2kW system included",
          "Battery Backup": "48V 200Ah",
          "Power Consumption": "80% solar powered",
          "Installation": "Professional required"
        },
        features: ["Solar powered", "Battery backup", "Energy efficient motor", "Smart controls"],
        inStock: true,
        stockQuantity: 3,
        rating: "4.9",
        reviewCount: 12,
        isActive: true,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "11",
        name: "Solar-Powered Elevator System",
        slug: "solar-powered-elevator-system",
        description: "Energy-efficient elevator system powered by solar panels. Complete solution for low-rise buildings with backup battery system.",
        shortDescription: "Solar-powered elevator with backup battery",
        price: "15999.99",
        originalPrice: "18999.99",
        sku: "SPE-001",
        brand: "GreenLift",
        categoryId: "7",
        images: ["https://images.unsplash.com/photo-1581091870621-0c632462e2c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800"],
        specifications: {
          "Capacity": "1000 kg",
          "Travel Height": "Up to 20m",
          "Speed": "1.0 m/s",
          "Solar Panels": "2kW system included",
          "Battery Backup": "48V 200Ah",
          "Power Consumption": "80% solar powered",
          "Installation": "Professional required"
        },
        features: ["Solar powered", "Battery backup", "Energy efficient motor", "Smart controls"],
        inStock: true,
        stockQuantity: 3,
        rating: "4.9",
        reviewCount: 12,
        isActive: true,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "12",
        name: "Solar-Powered Elevator System",
        slug: "solar-powered-elevator-system",
        description: "Energy-efficient elevator system powered by solar panels. Complete solution for low-rise buildings with backup battery system.",
        shortDescription: "Solar-powered elevator with backup battery",
        price: "15999.99",
        originalPrice: "18999.99",
        sku: "SPE-001",
        brand: "GreenLift",
        categoryId: "7",
        images: ["https://images.unsplash.com/photo-1581091870621-0c632462e2c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800"],
        specifications: {
          "Capacity": "1000 kg",
          "Travel Height": "Up to 20m",
          "Speed": "1.0 m/s",
          "Solar Panels": "2kW system included",
          "Battery Backup": "48V 200Ah",
          "Power Consumption": "80% solar powered",
          "Installation": "Professional required"
        },
        features: ["Solar powered", "Battery backup", "Energy efficient motor", "Smart controls"],
        inStock: true,
        stockQuantity: 3,
        rating: "4.9",
        reviewCount: 12,
        isActive: true,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "13",
        name: "Solar-Powered Elevator System",
        slug: "solar-powered-elevator-system",
        description: "Energy-efficient elevator system powered by solar panels. Complete solution for low-rise buildings with backup battery system.",
        shortDescription: "Solar-powered elevator with backup battery",
        price: "15999.99",
        originalPrice: "18999.99",
        sku: "SPE-001",
        brand: "GreenLift",
        categoryId: "7",
        images: ["https://images.unsplash.com/photo-1581091870621-0c632462e2c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800"],
        specifications: {
          "Capacity": "1000 kg",
          "Travel Height": "Up to 20m",
          "Speed": "1.0 m/s",
          "Solar Panels": "2kW system included",
          "Battery Backup": "48V 200Ah",
          "Power Consumption": "80% solar powered",
          "Installation": "Professional required"
        },
        features: ["Solar powered", "Battery backup", "Energy efficient motor", "Smart controls"],
        inStock: true,
        stockQuantity: 3,
        rating: "4.9",
        reviewCount: 12,
        isActive: true,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "14",
        name: "Solar-Powered Elevator System",
        slug: "solar-powered-elevator-system",
        description: "Energy-efficient elevator system powered by solar panels. Complete solution for low-rise buildings with backup battery system.",
        shortDescription: "Solar-powered elevator with backup battery",
        price: "15999.99",
        originalPrice: "18999.99",
        sku: "SPE-001",
        brand: "GreenLift",
        categoryId: "7",
        images: ["https://images.unsplash.com/photo-1581091870621-0c632462e2c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800"],
        specifications: {
          "Capacity": "1000 kg",
          "Travel Height": "Up to 20m",
          "Speed": "1.0 m/s",
          "Solar Panels": "2kW system included",
          "Battery Backup": "48V 200Ah",
          "Power Consumption": "80% solar powered",
          "Installation": "Professional required"
        },
        features: ["Solar powered", "Battery backup", "Energy efficient motor", "Smart controls"],
        inStock: true,
        stockQuantity: 3,
        rating: "4.9",
        reviewCount: 12,
        isActive: true,
        isFeatured: true,
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
        content: "The Occupational Safety and Health Administration (OSHA) has announced new safety regulations for industrial equipment that will take effect throughout 2024. These comprehensive updates focus on improving workplace safety standards across manufacturing, construction, and industrial facilities.\n\nKey changes include mandatory safety training programs for equipment operators, enhanced personal protective equipment requirements, and stricter maintenance protocols for heavy machinery. Companies must implement these new standards within 90 days of the effective date.\n\nThe regulations also introduce digital reporting systems for safety incidents and require regular third-party inspections of critical equipment. Industry experts estimate that while implementation costs may be significant initially, the long-term benefits include reduced workplace accidents and improved operational efficiency.\n\nEmployers are encouraged to review their current safety protocols and work with certified safety consultants to ensure full compliance with the new regulations.",
        imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        author: "Safety Team",
        publishedAt: new Date("2024-01-15"),
        isPublished: true,
        isFeatured: true,
        tags: ["safety", "regulations", "OSHA"],
        createdAt: new Date()
      },
      {
        id: "2",
        title: "Top 10 Power Tools for 2024",
        slug: "top-10-power-tools-2024",
        excerpt: "Our comprehensive review of the best power tools for professional use in 2024.",
        content: "As we enter 2024, the power tool industry continues to innovate with new technologies and improved performance features. Our expert team has thoroughly tested and evaluated hundreds of power tools to bring you this definitive list of the top 10 power tools for professional use.\n\nThis year's standout features include longer battery life, more precise control systems, and enhanced safety mechanisms. Cordless tools have reached new levels of power and efficiency, making them viable alternatives to corded tools in most applications.\n\nThe top performers in our testing include the DeWalt 20V Max series for versatility, Milwaukee M18 FUEL for heavy-duty applications, and Makita's XGT 40V platform for professional contractors. Each tool was evaluated based on performance, durability, value, and user feedback from industry professionals.\n\nWhether you're a contractor, manufacturer, or serious DIY enthusiast, investing in quality power tools remains one of the most important decisions for productivity and safety.",
        imageUrl: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        author: "Product Team",
        publishedAt: new Date("2024-01-10"),
        isPublished: true,
        isFeatured: false,
        tags: ["power tools", "review", "2024"],
        createdAt: new Date()
      },
      {
        id: "3",
        title: "The Future of Smart Manufacturing Technology",
        slug: "future-smart-manufacturing-technology",
        excerpt: "How IoT, AI, and automation are transforming industrial manufacturing processes and improving efficiency.",
        content: "Smart manufacturing represents the next evolution in industrial production, combining Internet of Things (IoT) sensors, artificial intelligence, and advanced automation to create more efficient, responsive, and sustainable manufacturing processes.\n\nThe integration of IoT sensors throughout production lines enables real-time monitoring of equipment performance, environmental conditions, and product quality. This data-driven approach allows manufacturers to predict maintenance needs, optimize energy consumption, and reduce waste significantly.\n\nArtificial intelligence algorithms analyze vast amounts of production data to identify patterns and optimize processes automatically. Machine learning models can predict equipment failures before they occur, schedule maintenance during optimal windows, and adjust production parameters in real-time to maintain quality standards.\n\nAdvanced robotics and automation systems are becoming more flexible and collaborative, working alongside human operators to enhance productivity while maintaining safety. These systems can adapt to different products and production requirements without extensive reprogramming.\n\nEarly adopters of smart manufacturing technologies report efficiency improvements of 20-30%, reduced operational costs, and significantly improved product quality. As these technologies mature and become more accessible, we expect widespread adoption across all manufacturing sectors.",
        imageUrl: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        author: "Technology Team",
        publishedAt: new Date("2024-01-05"),
        isPublished: true,
        isFeatured: true,
        tags: ["smart manufacturing", "IoT", "automation", "AI"],
        createdAt: new Date()
      },
      {
        id: "4",
        title: "Sustainable Energy Solutions in Industrial Applications",
        slug: "sustainable-energy-solutions-industrial",
        excerpt: "Exploring renewable energy integration and energy efficiency improvements in industrial operations.",
        content: "The industrial sector is increasingly adopting sustainable energy solutions to reduce environmental impact and operational costs. This comprehensive guide explores the latest developments in renewable energy integration, energy efficiency technologies, and sustainable practices for industrial operations.\n\nSolar panel installations on industrial facilities have become more cost-effective, with many companies achieving significant reductions in electricity costs. Wind energy solutions, particularly for large manufacturing plants, offer another viable renewable energy source.\n\nEnergy efficiency improvements through LED lighting upgrades, smart HVAC systems, and optimized equipment scheduling can reduce energy consumption by 15-25%. Advanced energy management systems provide real-time monitoring and automated optimization of energy usage patterns.\n\nGovernment incentives and tax credits for sustainable energy investments make these upgrades financially attractive for many businesses. The long-term benefits include reduced operational costs, improved corporate sustainability ratings, and compliance with environmental regulations.",
        imageUrl: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        author: "Sustainability Team",
        publishedAt: new Date("2024-01-20"),
        isPublished: true,
        isFeatured: false,
        tags: ["sustainability", "renewable energy", "efficiency"],
        createdAt: new Date()
      },
      {
        id: "5",
        title: "Maintenance Best Practices for Heavy Machinery",
        slug: "maintenance-best-practices-heavy-machinery",
        excerpt: "Essential maintenance strategies to maximize equipment lifespan and minimize downtime.",
        content: "Proper maintenance of heavy machinery is crucial for operational efficiency, safety, and cost control. This guide outlines proven maintenance strategies that help maximize equipment lifespan while minimizing unexpected downtime and repair costs.\n\nPreventive maintenance schedules based on manufacturer recommendations and usage patterns are the foundation of effective maintenance programs. Regular inspections, lubrication, and component replacements prevent minor issues from becoming major failures.\n\nPredictive maintenance technologies, including vibration analysis, thermal imaging, and oil analysis, enable early detection of potential problems. These technologies allow maintenance teams to address issues before they cause equipment failure.\n\nDigital maintenance management systems help track maintenance schedules, parts inventory, and equipment performance metrics. Mobile applications enable technicians to access maintenance information and update records in real-time from the field.\n\nTraining programs for maintenance personnel ensure proper procedures are followed and safety standards are maintained. Regular training updates keep staff current with new technologies and best practices.",
        imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        author: "Maintenance Team",
        publishedAt: new Date("2024-01-18"),
        isPublished: true,
        isFeatured: false,
        tags: ["maintenance", "heavy machinery", "best practices"],
        createdAt: new Date()
      },
      {
        id: "6",
        title: "Digital Transformation in Industrial Operations",
        slug: "digital-transformation-industrial-operations",
        excerpt: "How digital technologies are revolutionizing traditional industrial processes and workflows.",
        content: "Digital transformation is reshaping industrial operations through the integration of advanced technologies, data analytics, and automated systems. This transformation enables companies to improve efficiency, reduce costs, and enhance competitiveness in the global market.\n\nCloud-based systems provide scalable infrastructure for data storage and processing, enabling real-time access to operational information from anywhere. Integration with existing systems ensures seamless data flow across all operational areas.\n\nMobile applications empower field workers with instant access to technical documentation, work orders, and communication tools. Augmented reality applications assist with complex maintenance procedures and training programs.\n\nData analytics platforms process vast amounts of operational data to identify trends, optimize processes, and predict future needs. Machine learning algorithms continuously improve system performance and decision-making capabilities.\n\nCybersecurity measures protect digital systems and sensitive data from threats. Regular security assessments and employee training programs ensure comprehensive protection against cyber risks.",
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        author: "Digital Team",
        publishedAt: new Date("2024-01-12"),
        isPublished: true,
        isFeatured: false,
        tags: ["digital transformation", "technology", "operations"],
        createdAt: new Date()
      },
      {
        id: "7",
        title: "Digital Transformation in Industrial Operations",
        slug: "digital-transformation-industrial-operations",
        excerpt: "How digital technologies are revolutionizing traditional industrial processes and workflows.",
        content: "Digital transformation is reshaping industrial operations through the integration of advanced technologies, data analytics, and automated systems. This transformation enables companies to improve efficiency, reduce costs, and enhance competitiveness in the global market.\n\nCloud-based systems provide scalable infrastructure for data storage and processing, enabling real-time access to operational information from anywhere. Integration with existing systems ensures seamless data flow across all operational areas.\n\nMobile applications empower field workers with instant access to technical documentation, work orders, and communication tools. Augmented reality applications assist with complex maintenance procedures and training programs.\n\nData analytics platforms process vast amounts of operational data to identify trends, optimize processes, and predict future needs. Machine learning algorithms continuously improve system performance and decision-making capabilities.\n\nCybersecurity measures protect digital systems and sensitive data from threats. Regular security assessments and employee training programs ensure comprehensive protection against cyber risks.",
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        author: "Digital Team",
        publishedAt: new Date("2024-01-12"),
        isPublished: true,
        isFeatured: false,
        tags: ["digital transformation", "technology", "operations"],
        createdAt: new Date()
      },
      {
        id: "8",
        title: "Digital Transformation in Industrial Operations",
        slug: "digital-transformation-industrial-operations",
        excerpt: "How digital technologies are revolutionizing traditional industrial processes and workflows.",
        content: "Digital transformation is reshaping industrial operations through the integration of advanced technologies, data analytics, and automated systems. This transformation enables companies to improve efficiency, reduce costs, and enhance competitiveness in the global market.\n\nCloud-based systems provide scalable infrastructure for data storage and processing, enabling real-time access to operational information from anywhere. Integration with existing systems ensures seamless data flow across all operational areas.\n\nMobile applications empower field workers with instant access to technical documentation, work orders, and communication tools. Augmented reality applications assist with complex maintenance procedures and training programs.\n\nData analytics platforms process vast amounts of operational data to identify trends, optimize processes, and predict future needs. Machine learning algorithms continuously improve system performance and decision-making capabilities.\n\nCybersecurity measures protect digital systems and sensitive data from threats. Regular security assessments and employee training programs ensure comprehensive protection against cyber risks.",
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        author: "Digital Team",
        publishedAt: new Date("2024-01-12"),
        isPublished: true,
        isFeatured: false,
        tags: ["digital transformation", "technology", "operations"],
        createdAt: new Date()
      },
      {
        id: "9",
        title: "Digital Transformation in Industrial Operations",
        slug: "digital-transformation-industrial-operations",
        excerpt: "How digital technologies are revolutionizing traditional industrial processes and workflows.",
        content: "Digital transformation is reshaping industrial operations through the integration of advanced technologies, data analytics, and automated systems. This transformation enables companies to improve efficiency, reduce costs, and enhance competitiveness in the global market.\n\nCloud-based systems provide scalable infrastructure for data storage and processing, enabling real-time access to operational information from anywhere. Integration with existing systems ensures seamless data flow across all operational areas.\n\nMobile applications empower field workers with instant access to technical documentation, work orders, and communication tools. Augmented reality applications assist with complex maintenance procedures and training programs.\n\nData analytics platforms process vast amounts of operational data to identify trends, optimize processes, and predict future needs. Machine learning algorithms continuously improve system performance and decision-making capabilities.\n\nCybersecurity measures protect digital systems and sensitive data from threats. Regular security assessments and employee training programs ensure comprehensive protection against cyber risks.",
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        author: "Digital Team",
        publishedAt: new Date("2024-01-12"),
        isPublished: true,
        isFeatured: false,
        tags: ["digital transformation", "technology", "operations"],
        createdAt: new Date()
      },
      {
        id: "10",
        title: "Digital Transformation in Industrial Operations",
        slug: "digital-transformation-industrial-operations",
        excerpt: "How digital technologies are revolutionizing traditional industrial processes and workflows.",
        content: "Digital transformation is reshaping industrial operations through the integration of advanced technologies, data analytics, and automated systems. This transformation enables companies to improve efficiency, reduce costs, and enhance competitiveness in the global market.\n\nCloud-based systems provide scalable infrastructure for data storage and processing, enabling real-time access to operational information from anywhere. Integration with existing systems ensures seamless data flow across all operational areas.\n\nMobile applications empower field workers with instant access to technical documentation, work orders, and communication tools. Augmented reality applications assist with complex maintenance procedures and training programs.\n\nData analytics platforms process vast amounts of operational data to identify trends, optimize processes, and predict future needs. Machine learning algorithms continuously improve system performance and decision-making capabilities.\n\nCybersecurity measures protect digital systems and sensitive data from threats. Regular security assessments and employee training programs ensure comprehensive protection against cyber risks.",
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        author: "Digital Team",
        publishedAt: new Date("2024-01-12"),
        isPublished: true,
        isFeatured: false,
        tags: ["digital transformation", "technology", "operations"],
        createdAt: new Date()
      },
      {
        id: "11",
        title: "Digital Transformation in Industrial Operations",
        slug: "digital-transformation-industrial-operations",
        excerpt: "How digital technologies are revolutionizing traditional industrial processes and workflows.",
        content: "Digital transformation is reshaping industrial operations through the integration of advanced technologies, data analytics, and automated systems. This transformation enables companies to improve efficiency, reduce costs, and enhance competitiveness in the global market.\n\nCloud-based systems provide scalable infrastructure for data storage and processing, enabling real-time access to operational information from anywhere. Integration with existing systems ensures seamless data flow across all operational areas.\n\nMobile applications empower field workers with instant access to technical documentation, work orders, and communication tools. Augmented reality applications assist with complex maintenance procedures and training programs.\n\nData analytics platforms process vast amounts of operational data to identify trends, optimize processes, and predict future needs. Machine learning algorithms continuously improve system performance and decision-making capabilities.\n\nCybersecurity measures protect digital systems and sensitive data from threats. Regular security assessments and employee training programs ensure comprehensive protection against cyber risks.",
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        author: "Digital Team",
        publishedAt: new Date("2024-01-12"),
        isPublished: true,
        isFeatured: false,
        tags: ["digital transformation", "technology", "operations"],
        createdAt: new Date()
      },
      {
        id: "12",
        title: "Digital Transformation in Industrial Operations",
        slug: "digital-transformation-industrial-operations",
        excerpt: "How digital technologies are revolutionizing traditional industrial processes and workflows.",
        content: "Digital transformation is reshaping industrial operations through the integration of advanced technologies, data analytics, and automated systems. This transformation enables companies to improve efficiency, reduce costs, and enhance competitiveness in the global market.\n\nCloud-based systems provide scalable infrastructure for data storage and processing, enabling real-time access to operational information from anywhere. Integration with existing systems ensures seamless data flow across all operational areas.\n\nMobile applications empower field workers with instant access to technical documentation, work orders, and communication tools. Augmented reality applications assist with complex maintenance procedures and training programs.\n\nData analytics platforms process vast amounts of operational data to identify trends, optimize processes, and predict future needs. Machine learning algorithms continuously improve system performance and decision-making capabilities.\n\nCybersecurity measures protect digital systems and sensitive data from threats. Regular security assessments and employee training programs ensure comprehensive protection against cyber risks.",
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        author: "Digital Team",
        publishedAt: new Date("2024-01-12"),
        isPublished: true,
        isFeatured: false,
        tags: ["digital transformation", "technology", "operations"],
        createdAt: new Date()
      },
      {
        id: "13",
        title: "Digital Transformation in Industrial Operations",
        slug: "digital-transformation-industrial-operations",
        excerpt: "How digital technologies are revolutionizing traditional industrial processes and workflows.",
        content: "Digital transformation is reshaping industrial operations through the integration of advanced technologies, data analytics, and automated systems. This transformation enables companies to improve efficiency, reduce costs, and enhance competitiveness in the global market.\n\nCloud-based systems provide scalable infrastructure for data storage and processing, enabling real-time access to operational information from anywhere. Integration with existing systems ensures seamless data flow across all operational areas.\n\nMobile applications empower field workers with instant access to technical documentation, work orders, and communication tools. Augmented reality applications assist with complex maintenance procedures and training programs.\n\nData analytics platforms process vast amounts of operational data to identify trends, optimize processes, and predict future needs. Machine learning algorithms continuously improve system performance and decision-making capabilities.\n\nCybersecurity measures protect digital systems and sensitive data from threats. Regular security assessments and employee training programs ensure comprehensive protection against cyber risks.",
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        author: "Digital Team",
        publishedAt: new Date("2024-01-12"),
        isPublished: true,
        isFeatured: false,
        tags: ["digital transformation", "technology", "operations"],
        createdAt: new Date()
      },
      {
        id: "14",
        title: "Digital Transformation in Industrial Operations",
        slug: "digital-transformation-industrial-operations",
        excerpt: "How digital technologies are revolutionizing traditional industrial processes and workflows.",
        content: "Digital transformation is reshaping industrial operations through the integration of advanced technologies, data analytics, and automated systems. This transformation enables companies to improve efficiency, reduce costs, and enhance competitiveness in the global market.\n\nCloud-based systems provide scalable infrastructure for data storage and processing, enabling real-time access to operational information from anywhere. Integration with existing systems ensures seamless data flow across all operational areas.\n\nMobile applications empower field workers with instant access to technical documentation, work orders, and communication tools. Augmented reality applications assist with complex maintenance procedures and training programs.\n\nData analytics platforms process vast amounts of operational data to identify trends, optimize processes, and predict future needs. Machine learning algorithms continuously improve system performance and decision-making capabilities.\n\nCybersecurity measures protect digital systems and sensitive data from threats. Regular security assessments and employee training programs ensure comprehensive protection against cyber risks.",
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        author: "Digital Team",
        publishedAt: new Date("2024-01-12"),
        isPublished: true,
        isFeatured: false,
        tags: ["digital transformation", "technology", "operations"],
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

  async getProductsWithCount(filters?: { categoryId?: string; featured?: boolean; search?: string; limit?: number; offset?: number }): Promise<{ products: Product[]; total: number }> {
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

    const total = products.length;
    const offset = filters?.offset || 0;
    const limit = filters?.limit || products.length;

    return {
      products: products.slice(offset, offset + limit),
      total
    };
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
  async getNews(filters?: { limit?: number; offset?: number; featured?: boolean }): Promise<News[]> {
    let news = Array.from(this.news.values()).filter(n => n.isPublished);
    
    // Filter by featured if specified
    if (filters?.featured !== undefined) {
      news = news.filter(n => n.isFeatured === filters.featured);
    }
    
    // Sort by published date (newest first)
    news.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const offset = filters?.offset || 0;
    const limit = filters?.limit || news.length;

    return news.slice(offset, offset + limit);
  }

  async getNewsWithCount(filters?: { limit?: number; offset?: number; featured?: boolean }): Promise<{ news: News[]; total: number; hasMore: boolean }> {
    let allNews = Array.from(this.news.values()).filter(n => n.isPublished);
    
    // Filter by featured if specified
    if (filters?.featured !== undefined) {
      allNews = allNews.filter(n => n.isFeatured === filters.featured);
    }
    
    // Sort by published date (newest first)
    allNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const total = allNews.length;
    const offset = filters?.offset || 0;
    const limit = filters?.limit || total;
    const news = allNews.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return { news, total, hasMore };
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

  // Consultations
  async getConsultations(): Promise<Consultation[]> {
    return Array.from(this.consultations.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getConsultation(id: string): Promise<Consultation | undefined> {
    return this.consultations.get(id);
  }

  async createConsultation(insertConsultation: InsertConsultation): Promise<Consultation> {
    const id = randomUUID();
    const now = new Date();
    
    const consultation: Consultation = { 
      ...insertConsultation, 
      id, 
      status: insertConsultation.status || "pending",
      createdAt: now,
      updatedAt: now
    };
    
    this.consultations.set(id, consultation);
    return consultation;
  }

  async updateConsultation(id: string, updates: Partial<Consultation>): Promise<Consultation | undefined> {
    const consultation = this.consultations.get(id);
    if (!consultation) return undefined;

    const updatedConsultation = { 
      ...consultation, 
      ...updates, 
      updatedAt: new Date() 
    };
    
    this.consultations.set(id, updatedConsultation);
    return updatedConsultation;
  }
}

export const storage = new MemStorage();

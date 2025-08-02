import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Camera, ArrowRight, Wrench, HardHat, ServerCog, Zap, Package, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductGrid } from "@/components/product/product-grid";
import { useState } from "react";
import { VisualSearchModal } from "@/components/search/visual-search-modal";
import type { Product, Category } from "@shared/schema";

const categoryIcons = {
  "Power Tools": Wrench,
  "Safety Equipment": HardHat,
  "Machinery": ServerCog,
  "Electronics": Zap,
  "Materials": Package,
  "Hand Tools": Gavel,
};

export default function Home() {
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: featuredProducts = [], isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: () => fetch("/api/products?featured=true&limit=4").then(res => res.json()),
  });

  const { data: news = [] } = useQuery({
    queryKey: ["/api/news"],
    queryFn: () => fetch("/api/news?limit=2").then(res => res.json()),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Find Products Faster with Visual Search
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Upload a photo or sketch of what you need. Our AI-powered visual search 
                finds exact matches from thousands of industrial products.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100"
                  onClick={() => setIsVisualSearchOpen(true)}
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Try Visual Search
                </Button>
                <Link href="/products">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-primary"
                  >
                    Browse Catalog
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Professional industrial workspace"
                className="rounded-xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600">
              Find exactly what you need from our comprehensive product categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => {
              const IconComponent = categoryIcons[category.name as keyof typeof categoryIcons] || Package;
              
              return (
                <Link key={category.id} href={`/products?category=${category.slug}`}>
                  <Card className="cursor-pointer hover:shadow-lg transition-all group hover:bg-primary/5">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl text-primary mb-3 group-hover:text-primary/80">
                        <IconComponent className="h-8 w-8 mx-auto" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {category.itemCount} items
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-lg text-gray-600">
                Top-rated products trusted by industry professionals
              </p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="group">
                View All Products
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <ProductGrid products={featuredProducts} isLoading={isLoadingProducts} />
        </div>
      </section>

      {/* News Section */}
      {news.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Industry News</h2>
                <p className="text-lg text-gray-600">
                  Stay updated with the latest industry trends and product updates
                </p>
              </div>
              <Link href="/news">
                <Button variant="outline" className="group">
                  View All News
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {news.map((article: any) => (
                <Link key={article.id} href={`/news/${article.slug}`}>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={article.imageUrl || "https://via.placeholder.com/600x300"}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>By {article.author}</span>
                        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <VisualSearchModal
        isOpen={isVisualSearchOpen}
        onClose={() => setIsVisualSearchOpen(false)}
      />
    </div>
  );
}

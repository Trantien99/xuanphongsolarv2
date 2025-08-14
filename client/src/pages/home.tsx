import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Camera, ArrowRight, Wrench, HardHat, ServerCog, Zap, Package, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductGrid } from "@/components/product/product-grid";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { useTitle, useMetaDescription } from "@/hooks/use-title";
import { Category } from "@/model/category.model";
import { useMeta } from "@/components/seo/meta-manager";
import { ProductService } from "@/service/product.service";
import Product from "@/model/product.model";
import { VisualSearchModal } from "@/components/search/visual-search-modal";

const categoryIcons = {
  "Công cụ điện": Wrench,
  "Thiết bị an toàn": HardHat,
  "Máy móc": ServerCog,
  "Thiết bị điện tử": Zap,
  "Vật liệu": Package,
  "Công cụ cầm tay": Gavel,
};

interface HomeProps {
  categories: Category[];
}

export default function Home({ categories }: HomeProps) {
  const { t } = useTranslation();
  
  // Set dynamic title and meta description
  useTitle("meta.title");
  useMetaDescription("meta.description");

  // Dynamic SEO meta tags for SPA
  useMeta({
    title: "Xuân Phong Solar - Khám phá sản phẩm trực quan cho các chuyên gia ngành",
    description: "Tìm sản phẩm công nghiệp nhanh hơn với tìm kiếm hình ảnh. Nền tảng thương mại điện tử chuyên nghiệp cho các chuyên gia ngành với công cụ khám phá sản phẩm tiên tiến.",
    keywords: "sản phẩm công nghiệp, tìm kiếm hình ảnh, thị trường B2B, công cụ chuyên nghiệp, tìm nguồn cung thiết bị",
    ogTitle: "Xuân Phong Solar - Khám phá sản phẩm trực quan cho các chuyên gia ngành",
    ogDescription: "Tìm sản phẩm công nghiệp nhanh hơn với tìm kiếm hình ảnh. Nền tảng thương mại điện tử chuyên nghiệp cho các chuyên gia ngành.",
    ogImage: "https://xuanphongsolar.com/og-image.jpg",
    ogUrl: window.location.href,
    canonical: window.location.href
  });

  const { data: featuredProducts = [], isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const searchModel = {
        filter: { isFeatured: true },
        page: 1,
        pageSize: 4,
      };
      const result = await ProductService.findByCondition(searchModel);
      return Array.isArray(result.data) ? result.data : [];
    },
  });

  const { data: news = [] } = useQuery({
    queryKey: ["/api/news"],
    queryFn: () => fetch("/api/news?limit=2").then(res => res.json()),
  });

  const sectionProductRef = useRef<HTMLDivElement | null>(null);
  const sectionNewsRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="md:bg-gradient-to-r md:from-primary md:to-primary/80 bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                {t('home.heroTitle')}
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                {t('home.heroSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100"
                  onClick={() => sectionProductRef.current?.scrollIntoView({ behavior: "smooth" })}
                >
                  {/* <Camera className="h-5 w-5 mr-2" /> */}
                  {t('home.featuredProducts')}
                </Button>
                {/* <Link href="/products"> */}
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-primary hover:bg-white hover:text-primary"
                    onClick={() => sectionNewsRef.current?.scrollIntoView({ behavior: "smooth" })}
                  >
                    {t('home.featuredNews')}
                  </Button>
                {/* </Link> */}
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('home.shopByCategory')}</h2>
            <p className="text-lg text-gray-600">
              {t('home.shopByCategoryDesc')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => {
              const IconComponent = categoryIcons[category.label as keyof typeof categoryIcons] || Package;
              
              return (
                <Link key={category.id} to={`/products?category=${category.key}`}>
                  <Card className="cursor-pointer hover:shadow-lg transition-all group hover:bg-primary/5 h-full">
                    <CardContent className="p-6 text-center h-full">
                      <div className="text-3xl text-primary mb-3 group-hover:text-primary/80">
                        <IconComponent className="h-8 w-8 mx-auto" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {category.label}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {category.itemCount || 0} {t('home.items')}
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
      <section className="py-16 bg-gray-50" ref={sectionProductRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('home.featuredProducts')}</h2>
              <p className="text-lg text-gray-600">
                {t('home.featuredProductsDesc')}
              </p>
            </div>
            <Link to="/products">
              <Button variant="outline" className="group">
                {t('home.viewAllProducts')}
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <ProductGrid products={featuredProducts} isLoading={isLoadingProducts} />
        </div>
      </section>

      {/* News Section */}
      {news.length > 0 && (
        <section className="py-16 bg-white" ref={sectionNewsRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('home.featuredNews')}</h2>
                <p className="text-lg text-gray-600">
                  {t('home.industryNewsDesc')}
                </p>
              </div>
              <Link to="/news">
                <Button variant="outline" className="group">
                  {t('home.viewAllNews')}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {news.map((article: any) => (
                <Link key={article.id} to={`/news/${article.slug}`}>
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

      {/* <VisualSearchModal
        isOpen={falsx}
        onClose={() => setIsVisualSearchOpen(false)}
      /> */}
    </div>
  );
}

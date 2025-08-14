import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Calendar, User, Star, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { useTitle } from "@/hooks/use-title";
import { useMeta } from "@/components/seo/meta-manager";
import { useState, useRef } from "react";
import { scrollToElement } from "@/lib/utils";
import type { News } from "@shared/schema";
import { t } from "@/lib/i18n";

interface NewsResponse {
  news: News[];
  total: number;
  hasMore: boolean;
}

function NewsCard({ article }: { article: News }) {
  return (
    <Link to={`/news/${article.slug}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
        {article.imageUrl && (
          <div className="aspect-video overflow-hidden rounded-t-lg">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </div>
        )}
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            {article.isFeatured && (
              <Badge variant="default" className="bg-orange-500 hover:bg-orange-600">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
            {article.title}
          </h2>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {article.excerpt}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {article.author}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'No date'}
            </div>
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-4">
              {article.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {article.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{article.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

function FeaturedNews() {
  const { data: featuredNews = [], isLoading } = useQuery<News[]>({
    queryKey: ["/api/news", "featured"],
    queryFn: () => fetch("/api/news?featured=true&limit=3").then(res => res.json()),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <Skeleton className="aspect-video w-full" />
            <CardContent className="p-6">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (featuredNews.length === 0) {
    return null;
  }

  return (
    <section className="mb-16">
      <div className="flex items-center gap-2 mb-8">
        <Star className="h-6 w-6 text-orange-500" />
        <h2 className="text-3xl font-bold text-gray-900">Tin tức nổi bật</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredNews.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}

function LatestNews() {
  const { data: latestNews = [], isLoading } = useQuery<News[]>({
    queryKey: ["/api/news", "latest"],
    queryFn: () => fetch("/api/news?limit=4").then(res => res.json()),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <Skeleton className="aspect-video w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-3 w-2/3 mb-3" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (latestNews.length === 0) {
    return null;
  }

  return (
    <section className="mb-16">
      <div className="flex items-center gap-2 mb-8">
        <TrendingUp className="h-6 w-6 text-blue-500" />
        <h2 className="text-3xl font-bold text-gray-900">Bài viết mới nhất</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {latestNews.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}

function AllNewsList() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const sectionRef = useRef<HTMLElement>(null);

  const { data: newsResponse, isLoading } = useQuery<NewsResponse>({
    queryKey: ["/api/news", "all", currentPage],
    queryFn: () => 
      fetch(`/api/news?withCount=true&limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}`)
        .then(res => res.json()),
  });

  const totalPages = newsResponse ? Math.ceil(newsResponse.total / itemsPerPage) : 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    // Scroll to the top of the AllNewsList component with mobile optimization
    scrollToElement(sectionRef.current, {
      headerOffset: 80, // Desktop offset
      mobileHeaderOffset: 100, // Extra offset for mobile to account for mobile action buttons
      delay: 150 // Slightly longer delay for mobile
    });
  };

  if (isLoading) {
    return (
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Tất cả bài viết</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="aspect-video w-full" />
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (!newsResponse || newsResponse.news.length === 0) {
    return (
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Tất cả bài viết</h2>
        <div className="text-center py-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Không có bài viết nào khả dụng</h3>
          <p className="text-gray-600">Hãy quay lại sớm để cập nhật những tin tức và thông tin mới nhất trong ngành.</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef}>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        Tất cả ({newsResponse.total} bài viết)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {newsResponse.news.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          hasMore={newsResponse.hasMore}
          onPageChange={handlePageChange}
          className="mt-12"
        />
      )}
    </section>
  );
}

function NewsList() {
  // Set dynamic title
  useTitle("pageTitle.news");

  // Dynamic SEO meta tags for news page
  useMeta({
    title: "Tin tức ngành công nghiệp - Cập nhật xu hướng mới nhất | Xuân Phong Solar",
    description: "Đọc tin tức và xu hướng mới nhất trong ngành công nghiệp. Cập nhật thông tin về công nghệ, sản phẩm mới và thị trường từ Xuân Phong Solar.",
    keywords: "tin tức công nghiệp, xu hướng ngành, công nghệ mới, thị trường công nghiệp, cập nhật ngành",
    ogTitle: "Tin tức ngành công nghiệp | Xuân Phong Solar",
    ogDescription: "Đọc tin tức và xu hướng mới nhất trong ngành công nghiệp. Cập nhật thông tin về công nghệ, sản phẩm mới và thị trường.",
    ogImage: "https://xuanphongsolar.com/og-news.jpg",
    ogUrl: window.location.href,
    canonical: window.location.href
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("home.industryNews")}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t("home.industryNewsDesc")}
          </p>
        </div>

        {/* Featured News Section */}
        <FeaturedNews />

        {/* Latest News Section */}
        <LatestNews />

        {/* All News Section with Pagination */}
        <AllNewsList />
      </div>
    </div>
  );
}

export default function News() {
  return <NewsList />;
}

import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { ArrowLeft, Calendar, User, Tag, Clock, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useShare } from "@/hooks/use-share";
import { t } from "@/lib/i18n";
import type { News } from "@shared/schema";

export default function NewsDetail() {
  const [match, params] = useRoute("/news/:slug");
  const { share, isSharing, isMobileDevice, hasWebShareSupport } = useShare();
  
  const { data: article, isLoading, error } = useQuery<News>({
    queryKey: ["/api/news/slug", params?.slug],
    enabled: !!params?.slug,
  });

  const { data: relatedNews = [] } = useQuery<News[]>({
    queryKey: ["/api/news"],
    select: (data) => data.filter(item => item.id !== article?.id).slice(0, 3),
    enabled: !!article,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-64 w-full mb-6 rounded-lg" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-8" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link href="/news">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to News
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    await share({
      title: article.title,
      text: article.excerpt,
      url: window.location.href,
    });
  };

  const estimatedReadTime = Math.ceil(article.content.split(' ').length / 200); // 200 words per minute

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <Link href="/news">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to News
            </Button>
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              {article.author}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'No date'}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {estimatedReadTime} min read
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              disabled={isSharing}
              className="sm:ml-auto w-full sm:w-auto mt-2 sm:mt-0"
              title={hasWebShareSupport && isMobileDevice ? 
                'Nhấn để hiển thị các ứng dụng có thể chia sẻ' : 
                t('share')}
            >
              <Share2 className={`h-4 w-4 mr-2 ${isSharing ? 'animate-spin' : ''}`} />
              {isSharing ? t('sharing') : 
               (isMobileDevice && hasWebShareSupport ? 'Chia sẻ bài viết' : t('share'))}
            </Button>
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
              <Tag className="h-4 w-4 text-gray-500 flex-shrink-0" />
              {article.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        <article className="bg-white rounded-xl shadow-sm overflow-hidden">
          {article.imageUrl && (
            <div className="aspect-video overflow-hidden">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                {article.title}
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed font-medium">
                {article.excerpt}
              </p>
            </header>

            <Separator className="my-6 sm:my-8" />

            <div className="prose prose-base sm:prose-lg max-w-none">
              {article.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.trim() === '') return null;
                
                return (
                  <p key={index} className="mb-4 sm:mb-6 text-gray-700 leading-relaxed text-base sm:text-lg">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedNews.length > 0 && (
          <div className="mt-8 sm:mt-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {relatedNews.map((relatedArticle) => (
                <Link key={relatedArticle.id} href={`/news/${relatedArticle.slug}`}>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                    {relatedArticle.imageUrl && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={relatedArticle.imageUrl}
                          alt={relatedArticle.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {relatedArticle.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                        <span>{relatedArticle.author}</span>
                        <span>
                          {relatedArticle.publishedAt ? new Date(relatedArticle.publishedAt).toLocaleDateString() : 'No date'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Top */}
        <div className="mt-8 sm:mt-12 text-center">
          <Link href="/news">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All News
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
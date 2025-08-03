import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Star, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { t, formatCurrency } from "@/lib/i18n";
import type { Product } from "@shared/schema";

interface RelatedProductsProps {
  currentProductId: string;
  categoryId: string;
}

export function RelatedProducts({ currentProductId, categoryId }: RelatedProductsProps) {
  const { data: relatedProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/related", categoryId, currentProductId],
    queryFn: async () => {
      const response = await fetch(`/api/products/related/${categoryId}?exclude=${currentProductId}&limit=8`);
      if (!response.ok) {
        throw new Error(t('relatedProducts') + " loading error");
      }
      return response.json();
    },
  });

  const renderStars = (rating: string) => {
    const ratingNum = parseFloat(rating);
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-3 w-3 ${
            i <= ratingNum ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
        />
      );
    }
    
    return stars;
  };

  if (isLoading) {
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('relatedProducts')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{t('relatedProducts')}</h2>
        <Link href="/products">
          <Button variant="outline">{t('viewAll')}</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <Card key={product.id} className="group product-card-hover">
            <CardContent className="p-0">
              <Link href={`/products/${product.slug}`}>
                <div className="relative">
                  <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100">
                    <img
                      src={product.images[0] || "https://via.placeholder.com/300x300"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  
                  {product.isFeatured && (
                    <Badge className="absolute top-2 left-2">
                      {t('featured')}
                    </Badge>
                  )}
                  
                  {product.originalPrice && (
                    <Badge variant="destructive" className="absolute top-2 right-2">
                      {t('discount')}
                    </Badge>
                  )}

                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                      <span className="text-white font-medium">{t('outOfStock')}</span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-4 space-y-3">
                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-primary transition-colors group-hover:text-primary">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center space-x-1">
                  {renderStars(product.rating)}
                  <span className="text-xs text-gray-500 ml-1">
                    ({product.reviewCount})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{product.brand}</p>
                  </div>
                </div>

                <Button 
                  size="sm" 
                  className="w-full"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.inStock ? t('addToCart') : t('outOfStock')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
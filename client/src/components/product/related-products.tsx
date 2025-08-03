import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { t } from "@/lib/i18n";
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

  if (isLoading) {
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('relatedProducts')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-full" />
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 auto-rows-fr">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
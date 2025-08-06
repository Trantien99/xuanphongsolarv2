import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Star, ShoppingCart, Heart, Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCart } from "@/components/cart/cart-context";
import { useShare } from "@/hooks/use-share";
import { ImageGallery } from "@/components/product/image-gallery";
import { RelatedProducts } from "@/components/product/related-products";
import { t, formatCurrency } from "@/lib/i18n";
import { useTitle } from "@/hooks/use-title";
import { useMeta } from "@/components/seo/meta-manager";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const [match, params] = useRoute("/products/:slug");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { share, isSharing, isMobileDevice, hasWebShareSupport } = useShare();

  const handleShare = async () => {
    if (!product) return;

    await share({
      title: product.name,
      text: product.description,
      url: window.location.href,
    });
  };

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products/slug", params?.slug],
    enabled: !!params?.slug,
  });

  // Set dynamic title based on product name
  useTitle("pageTitle.productDetail", product?.name);

  // Dynamic SEO meta tags for product
  if (product) {
    useMeta({
      title: `${product.name} - ${formatCurrency(product.price)} | IndustrialSource`,
      description: `${product.description}. Mua ${product.name} chính hãng với giá ${formatCurrency(product.price)} tại IndustrialSource. Miễn phí vận chuyển.`,
      keywords: `${product.name}, ${product.brand}, ${product.categoryId}, sản phẩm công nghiệp, mua ${product.name}`,
      ogTitle: `${product.name} - ${formatCurrency(product.price)}`,
      ogDescription: product.description,
      ogImage: product.images?.[0] || "https://industrialsource.com/og-product.jpg",
      ogUrl: window.location.href,
      canonical: window.location.href
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('productNotFound')}</h1>
          <Link href="/products">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('backToProducts')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    await addToCart(product.id, quantity);
  };

  const renderStars = (rating: string) => {
    const ratingNum = parseFloat(rating);
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-5 w-5 ${i <= ratingNum ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
        />
      );
    }

    return stars;
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-primary">{t('breadcrumb.home')}</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary">{t('breadcrumb.products')}</Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>

          {/* Back Button */}
          <Link href="/products">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('backToProducts')}
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <ImageGallery images={product.images || []} productName={product.name} />

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                  <div className="flex space-x-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('favorite')}</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size={isMobileDevice ? "sm" : "icon"}
                          onClick={handleShare}
                          disabled={isSharing}
                          className={isMobileDevice ? "flex items-center space-x-2" : ""}
                        >
                          <Share2 className={`h-4 w-4 ${isSharing ? 'animate-spin' : ''}`} />
                          {isMobileDevice && (
                            <span className="text-sm">
                              {isSharing ? t('sharing') : (hasWebShareSupport ? 'Chia sẻ' : 'Sao chép')}
                            </span>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {isSharing ? t('sharing') :
                            (hasWebShareSupport && isMobileDevice ?
                              'Nhấn để hiển thị các ứng dụng có thể chia sẻ' :
                              t('share'))}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(product.rating)}
                    <span className="ml-2 text-sm text-gray-600">
                      ({product.reviewCount} {t('reviewCount')})
                    </span>
                  </div>
                  <Badge variant="secondary">{product.brand}</Badge>
                  {product.isFeatured && <Badge>{t('featured')}</Badge>}
                </div>

                <p className="text-gray-600 mb-6">{product.description}</p>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className={`text-sm font-medium ${product.inStock ? "text-green-600" : "text-red-600"
                }`}>
                {product.inStock
                  ? `${t('inStock')} (${product.stockQuantity} ${t('stockAvailable')})`
                  : t('outOfStock')
                }
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= product.stockQuantity}
                  >
                    +
                  </Button>
                </div>

                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 max-w-sm"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {t('addToCart')}
                </Button>
              </div>

              {/* Product Details Tabs */}
              <Tabs defaultValue="specifications" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="specifications">{t('specifications')}</TabsTrigger>
                  <TabsTrigger value="features">{t('features')}</TabsTrigger>
                  <TabsTrigger value="reviews">{t('reviews')}</TabsTrigger>
                </TabsList>

                <TabsContent value="specifications" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('specifications')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {Object.keys(product.specifications).length > 0 ? (
                        <dl className="space-y-3">
                          {Object.entries(product.specifications).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <dt className="font-medium text-gray-900">{key}:</dt>
                              <dd className="text-gray-600">{value}</dd>
                            </div>
                          ))}
                        </dl>
                      ) : (
                        <p className="text-gray-600">Chưa có thông số kỹ thuật.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="features" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('features')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {product.features.length > 0 ? (
                        <ul className="space-y-2">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span className="text-gray-600">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600">Chưa có tính năng nào được liệt kê.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('reviews')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">
                          Tính năng đánh giá sẽ sớm có mặt. Sản phẩm này có {product.reviewCount} {t('reviewCount')}
                          với điểm đánh giá trung bình {product.rating}/5.
                        </p>
                        <Button variant="outline">{t('writeReview')}</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Related Products */}
          <RelatedProducts
            currentProductId={product.id}
            categoryId={product.categoryId}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}

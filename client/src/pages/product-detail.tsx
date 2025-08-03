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
import { toast } from "@/hooks/use-toast";
import { ImageGallery } from "@/components/product/image-gallery";
import { RelatedProducts } from "@/components/product/related-products";
import { ConsultationPopup } from "@/components/product/consultation-popup";
import { t, formatCurrency } from "@/lib/i18n";
import { useTitle } from "@/hooks/use-title";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const [match, params] = useRoute("/products/:slug");
  const [quantity, setQuantity] = useState(1);
  const [isSharing, setIsSharing] = useState(false);
  const { addToCart } = useCart();

  const handleShare = async () => {
    if (isSharing) return;
    
    setIsSharing(true);
    try {
      const shareData = {
        title: product?.name || 'Product',
        text: product?.description || 'Check out this product',
        url: window.location.href,
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({
          title: t('success'),
          description: t('sharedSuccessfully'),
        });
      } else {
        // Fallback: copy to clipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(window.location.href);
          toast({
            title: t('success'),
            description: t('linkCopied'),
          });
        } else {
          // Manual fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = window.location.href;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          try {
            document.execCommand('copy');
            toast({
              title: t('success'),
              description: t('linkCopied'),
            });
          } catch (err) {
                          toast({
                title: 'Error',
                description: t('shareError'),
                variant: 'destructive',
              });
          } finally {
            document.body.removeChild(textArea);
          }
        }
      }
    } catch (error) {
      // Handle user cancellation or other errors
      if (error instanceof Error && error.name !== 'AbortError') {
        // AbortError means user cancelled the share dialog, which is normal
        toast({
          title: 'Error',
          description: t('shareError'),
          variant: 'destructive',
        });
      }
    } finally {
      setIsSharing(false);
    }
  };

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products/slug", params?.slug],
    enabled: !!params?.slug,
  });

  // Set dynamic title based on product name
  useTitle("pageTitle.productDetail", product?.name);

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
          className={`h-5 w-5 ${
            i <= ratingNum ? "text-yellow-400 fill-current" : "text-gray-300"
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
          <ImageGallery images={product.images} productName={product.name} />

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
                        size="icon" 
                        onClick={handleShare}
                        disabled={isSharing}
                      >
                        <Share2 className={`h-4 w-4 ${isSharing ? 'animate-spin' : ''}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isSharing ? t('sharing') : t('share')}</p>
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
            <div className={`text-sm font-medium ${
              product.inStock ? "text-green-600" : "text-red-600"
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

      {/* Consultation Popup */}
      <ConsultationPopup />
      </div>
    </TooltipProvider>
  );
}

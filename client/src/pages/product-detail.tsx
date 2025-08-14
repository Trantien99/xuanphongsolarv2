import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, ShoppingCart, Heart, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
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
import { ProductService } from "@/service/product.service";
import Product from "@/model/product.model";
import { AppUtils } from "@/utils/AppUtils";

export default function ProductDetail() {
  const params = useParams();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { share, isSharing, isMobileDevice, hasWebShareSupport } = useShare();
  const [product, setProduct] = useState<Product>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleShare = async () => {
    if (!product) return;

    await share({
      title: product.name,
      text: product.description,
      url: window.location.href,
    });
  };

  useEffect(() => {
    if (params?.id) {
      setIsLoading(true);
      ProductService.getProductById(params.id).then((response) => {
        response && setProduct({...new Product(), ...response});
        setIsLoading(false);
      });
    }
  }, [params?.id]);

  // Set dynamic title based on product name
  useTitle("pageTitle.productDetail", product?.name);

  // Dynamic SEO meta tags for product
  // if (product) {
    useMeta({
      title: `${product?.name} - ${formatCurrency(product?.price || 0)} | Xuân Phong Solar`,
      description: `${product?.description}. Mua ${product?.name} chính hãng với giá ${formatCurrency(product?.price || 0)} tại Xuân Phong Solar. Miễn phí vận chuyển.`,
      keywords: `${product?.name}, ${product?.brand}, ${product?.category}, sản phẩm công nghiệp, mua ${product?.name}`,
      ogTitle: `${product?.name} - ${formatCurrency(product?.price || 0)}`,
      ogDescription: product?.description,
      ogImage: window.location.href + "/" + product?.avatar || "https://xuanphongsolar.com/og-product.jpg",
      ogUrl: window.location.href,
      canonical: window.location.href
    });
  // }

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
          <Link to="/products">
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
            <Link to="/" className="hover:text-primary">{t('breadcrumb.home')}</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary">{t('breadcrumb.products')}</Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>

          {/* Back Button */}
          <Link to="/products">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('backToProducts')}
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <ImageGallery images={product.imageUrls || []} productName={product.name} />

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
                    {renderStars(product.rating?.toString() || "5")}
                    <span className="ml-2 text-sm text-gray-600">
                      ({product.reviewCount || 0} {t('reviewCount')})
                    </span>
                  </div>
                  <Badge variant="secondary">{product.brand || ""}</Badge>
                  {product.isFeatured && <Badge>{t('featured')}</Badge>}
                </div>

                <p className="text-gray-600 mb-6">{product.description || ""}</p>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">
                  {AppUtils.calculateDiscountString(product.price || 0, product?.discount?.value || 0, product?.discount?.type || '')}
                </span>
                {product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    {AppUtils.formatCurrency(product.price)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className={`text-sm font-medium ${product.inStock ? "text-green-600" : "text-red-600"
                }`}>
                {product.inStock
                  ? `${t('inStock')} (${product.stockQuantity || 0} ${t('stockAvailable')})`
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
                    disabled={quantity >= (product.stockQuantity || 0)}
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
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 md:gap-0 h-auto">
                  <TabsTrigger value="specifications">{t('specifications')}</TabsTrigger>
                  <TabsTrigger value="features">{t('features')}</TabsTrigger>
                  <TabsTrigger value="additional">{t('additionalInfo')}</TabsTrigger>
                  <TabsTrigger value="reviews">{t('reviews')}</TabsTrigger>
                </TabsList>

                <TabsContent value="specifications" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('specifications')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {product.specifications && Object.keys(product.specifications).length > 0 ? (
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
                      {product.features && product.features.length > 0 ? (
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

                <TabsContent value="additional" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('additionalInfo')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-3">
                        {product.warranty && (
                          <div className="flex justify-between">
                            <dt className="font-medium text-gray-900">{t('warranty')}:</dt>
                            <dd className="text-gray-600">{product.warranty}</dd>
                          </div>
                        )}
                        {product.warrantyType && (
                          <div className="flex justify-between">
                            <dt className="font-medium text-gray-900">{t('warrantyType')}:</dt>
                            <dd className="text-gray-600">{product.warrantyType}</dd>
                          </div>
                        )}
                        {product.origin && (
                          <div className="flex justify-between">
                            <dt className="font-medium text-gray-900">{t('origin')}:</dt>
                            <dd className="text-gray-600">{product.origin}</dd>
                          </div>
                        )}
                        {product.material && (
                          <div className="flex justify-between">
                            <dt className="font-medium text-gray-900">{t('material')}:</dt>
                            <dd className="text-gray-600">{product.material}</dd>
                          </div>
                        )}
                        {product.style && (
                          <div className="flex justify-between">
                            <dt className="font-medium text-gray-900">{t('style')}:</dt>
                            <dd className="text-gray-600">{product.style}</dd>
                          </div>
                        )}
                        {/* {product.weight && (
                          <div className="flex justify-between">
                            <dt className="font-medium text-gray-900">{t('weight')}:</dt>
                            <dd className="text-gray-600">{product.weight} kg</dd>
                          </div>
                        )} */}
                        {/* {product.dimensions && (
                          <div className="flex justify-between">
                            <dt className="font-medium text-gray-900">{t('dimensions')}:</dt>
                            <dd className="text-gray-600">
                              {product.dimensions.length && product.dimensions.width && product.dimensions.height
                                ? `${product.dimensions.length} × ${product.dimensions.width} × ${product.dimensions.height} ${product.dimensions.unit || 'cm'}`
                                : t('notAvailable')
                              }
                            </dd>
                          </div>
                        )}
                        {product.color && (
                          <div className="flex justify-between">
                            <dt className="font-medium text-gray-900">{t('color')}:</dt>
                            <dd className="text-gray-600">{product.color}</dd>
                          </div>
                        )}
                        {product.model && (
                          <div className="flex justify-between">
                            <dt className="font-medium text-gray-900">{t('model')}:</dt>
                            <dd className="text-gray-600">{product.model}</dd>
                          </div>
                        )}
                        {product.year && (
                          <div className="flex justify-between">
                            <dt className="font-medium text-gray-900">{t('year')}:</dt>
                            <dd className="text-gray-600">{product.year}</dd>
                          </div>
                        )}
                        {product.sku && (
                          <div className="flex justify-between">
                            <dt className="font-medium text-gray-900">{t('sku')}:</dt>
                            <dd className="text-gray-600">{product.sku}</dd>
                          </div>
                        )} */}
                      </dl>
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
                          {`Tính năng đánh giá sẽ sớm có mặt. Sản phẩm này có ${product.reviewCount || 0} ${t('reviewCount')} với điểm đánh giá trung bình ${product.rating || 5}/5.`}
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
            categoryId={product.category}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}

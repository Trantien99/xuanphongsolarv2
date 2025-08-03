import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Sun, Battery, Zap, Droplets, ArrowUp, Shield, Leaf, Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Product, Category } from "@shared/schema";
import { useCart } from "@/components/cart/cart-context";
import { useToast } from "@/hooks/use-toast";
import { useTitle } from "@/hooks/use-title";
import { t } from "@/lib/i18n";

const getFeatures = () => [
  {
    icon: Sun,
    title: t("solarEnergy.features.cleanEnergy.title"),
    description: t("solarEnergy.features.cleanEnergy.description")
  },
  {
    icon: Zap,
    title: t("solarEnergy.features.costSaving.title"),
    description: t("solarEnergy.features.costSaving.description")
  },
  {
    icon: Shield,
    title: t("solarEnergy.features.longWarranty.title"),
    description: t("solarEnergy.features.longWarranty.description")
  },
  {
    icon: Leaf,
    title: t("solarEnergy.features.ecoFriendly.title"),
    description: t("solarEnergy.features.ecoFriendly.description")
  }
];

const getCategories = () => [
  {
    icon: Sun,
    title: t("solarEnergy.categories.solarPanels.title"),
    description: t("solarEnergy.categories.solarPanels.description"),
    items: ["Pin 300W-600W", "Hiệu suất 20-22%", "Bảo hành 25 năm"]
  },
  {
    icon: Battery,
    title: t("solarEnergy.categories.batteries.title"),
    description: t("solarEnergy.categories.batteries.description"),
    items: ["Pin LiFePO4", "Tuổi thọ 6000+ chu kỳ", "BMS tích hợp"]
  },
  {
    icon: Droplets,
    title: t("solarEnergy.categories.waterHeater.title"),
    description: t("solarEnergy.categories.waterHeater.description"),
    items: ["Dung tích 100-300L", "Ống chân không", "Hiệu suất 95%+"]
  },
  {
    icon: ArrowUp,
    title: t("solarEnergy.categories.solarElevator.title"),
    description: t("solarEnergy.categories.solarElevator.description"),
    items: ["Động cơ hiệu suất cao", "Pin dự phòng", "Điều khiển thông minh"]
  }
];

export default function SolarEnergyLanding() {
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  // Set dynamic title
  useTitle("pageTitle.products", "Năng lượng mặt trời");

  const { data: solarProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { categoryId: "7" }],
    queryFn: async () => {
      const response = await fetch("/api/products?categoryId=7");
      if (!response.ok) throw new Error("Failed to fetch solar products");
      return response.json();
    }
  });

  const { data: solarCategory } = useQuery<Category>({
    queryKey: ["/api/categories", "7"],
    queryFn: async () => {
      const response = await fetch("/api/categories/7");
      if (!response.ok) throw new Error("Failed to fetch category");
      return response.json();
    }
  });

  const handleAddToCart = async (product: Product) => {
    await addToCart(product.id, 1);
    
    toast({
      title: t("solarEnergy.addedToCart"),
      description: `${product.name} đã được thêm vào giỏ hàng của bạn.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-yellow-600 to-orange-500 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Sun className="h-16 w-16" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Giải Pháp Năng Lượng Mặt Trời
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Chuyên cung cấp hệ thống pin mặt trời, máy nước nóng, thang máy và thiết bị vệ sinh 
              tiết kiệm năng lượng cho gia đình và doanh nghiệp
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-yellow-600 hover:bg-gray-100">
                Xem Sản Phẩm
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-yellow-600">
                Tư Vấn Miễn Phí
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tại Sao Chọn Năng Lượng Mặt Trời?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Năng lượng mặt trời là giải pháp tương lai cho nhu cầu năng lượng bền vững
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {getFeatures().map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <feature.icon className="h-8 w-8 text-yellow-600" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Danh Mục Sản Phẩm
            </h2>
            <p className="text-xl text-gray-600">
              Giải pháp năng lượng mặt trời toàn diện cho mọi nhu cầu
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getCategories().map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <category.icon className="h-6 w-6 text-yellow-600" />
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-sm text-gray-500">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-2"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sản Phẩm Nổi Bật
            </h2>
            <p className="text-xl text-gray-600">
              Những sản phẩm năng lượng mặt trời chất lượng cao được khách hàng tin tưởng
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {solarProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={product.images?.[0] || '/placeholder-image.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{product.brand}</Badge>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium ml-1">{product.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({product.reviewCount})</span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.shortDescription}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-yellow-600">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-lg text-gray-500 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      {product.originalPrice && (
                        <Badge variant="destructive">
                          Giảm {Math.round((1 - parseFloat(product.price) / parseFloat(product.originalPrice)) * 100)}%
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link href={`/products/${product.slug}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          Xem Chi Tiết
                        </Button>
                      </Link>
                      <Button 
                        onClick={() => handleAddToCart(product)}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products?categoryId=7">
              <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700">
                Xem Tất Cả Sản Phẩm
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-600 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Sẵn Sàng Chuyển Sang Năng Lượng Mặt Trời?
          </h2>
          <p className="text-xl mb-8">
            Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí và nhận báo giá tốt nhất
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-yellow-600 hover:bg-gray-100">
              Gọi Ngay: 1900-SOLAR
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-yellow-600">
              Đăng Ký Tư Vấn
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
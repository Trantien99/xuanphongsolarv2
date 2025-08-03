import { Link } from "wouter";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/components/cart/cart-context";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product.id);
  };

  const renderStars = (rating: string) => {
    const ratingNum = parseFloat(rating);
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= ratingNum ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
        />
      );
    }
    
    return stars;
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="group cursor-pointer hover:shadow-lg transition-shadow border border-gray-200 h-full flex flex-col">
        <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100">
          <img
            src={product.images[0] || "https://via.placeholder.com/400x400?text=No+Image"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
        <CardContent className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1 min-h-[3rem]">
              {product.name}
            </h3>
            {product.isFeatured && (
              <Badge variant="secondary" className="ml-2 shrink-0">
                Featured
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem]">
            {product.shortDescription}
          </p>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-gray-500">
              ({product.reviewCount} reviews)
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">
              {product.brand}
            </span>
            <span className={`text-sm ${product.inStock ? "text-green-600" : "text-red-600"}`}>
              {product.inStock ? `${product.stockQuantity} in stock` : "Out of stock"}
            </span>
          </div>
          
          <div className="mt-auto">
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="bg-primary hover:bg-primary/90 w-full"
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

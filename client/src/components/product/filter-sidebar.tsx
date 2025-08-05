import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FilterSidebarProps {
  selectedBrands: string[];
  onBrandToggle: (brand: string) => void;
  priceRange: string;
  onPriceRangeChange: (range: string) => void;
  uniqueBrands: string[];
  onClearFilters: () => void;
}

export function FilterSidebar({
  selectedBrands,
  onBrandToggle,
  priceRange,
  onPriceRangeChange,
  uniqueBrands,
  onClearFilters
}: FilterSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Brands Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Thương hiệu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {uniqueBrands.map(brand => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => onBrandToggle(brand)}
              />
              <label htmlFor={`brand-${brand}`} className="text-sm font-medium">
                {brand}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Khoảng giá</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { value: "under-50", label: "Dưới 50$" },
            { value: "50-200", label: "50$ - 200$" },
            { value: "200-500", label: "200$ - 500$" },
            { value: "over-500", label: "Trên 500$" }
          ].map(option => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`price-${option.value}`}
                checked={priceRange === option.value}
                onCheckedChange={() => onPriceRangeChange(option.value)}
              />
              <label htmlFor={`price-${option.value}`} className="text-sm font-medium">
                {option.label}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Clear Filters */}
      <Button variant="outline" onClick={onClearFilters} className="w-full">
        Xóa bộ lọc
      </Button>
    </div>
  );
}
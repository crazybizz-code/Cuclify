'use client';

import { useState, useMemo } from 'react';
import type { Product, ProductsPageConfig, Category } from '@/types';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ProductCard } from '@/components/ProductCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';

interface ProductsGridProps {
  config: ProductsPageConfig;
  locale: string;
  products: Product[];
  categories: Category[];
  className?: string;
}

export function ProductsGrid({
  config,
  locale,
  products,
  categories,
  className,
}: ProductsGridProps) {
  const { addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortValue, setSortValue] = useState('featured');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.some(
          (cat) => product.category.toLowerCase() === cat.toLowerCase()
        )
      );
    }

    // Price filter
    const priceRange = config.priceRanges.find((r) => r.id === selectedPriceRange);
    if (priceRange) {
      if (priceRange.min !== undefined) {
        result = result.filter((product) => product.price >= priceRange.min!);
      }
      if (priceRange.max !== undefined) {
        result = result.filter((product) => product.price <= priceRange.max!);
      }
    }

    // Sorting
    switch (sortValue) {
      case 'newest':
        // Assuming products are already sorted by newest
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      default:
        // Featured - keep original order
        break;
    }

    return result;
  }, [products, searchQuery, sortValue, selectedCategories, selectedPriceRange, config.priceRanges]);

  const handleCategoryToggle = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedPriceRange('all');
    setSortValue('featured');
  };

  const hasActiveFilters =
    searchQuery || selectedCategories.length > 0 || selectedPriceRange !== 'all';

  const uniqueCategories = useMemo(() => {
    const categorySet = new Set(products.map((p) => p.category));
    return Array.from(categorySet);
  }, [products]);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="font-medium mb-3">{config.categoryFilterLabel}</h4>
        <div className="space-y-2">
          {uniqueCategories.map((category) => (
            <div key={category} className="flex items-center gap-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => handleCategoryToggle(category)}
              />
              <Label
                htmlFor={`category-${category}`}
                className="text-sm font-normal cursor-pointer"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium mb-3">{config.priceFilterLabel}</h4>
        <div className="space-y-2">
          {config.priceRanges.map((range) => (
            <div key={range.id} className="flex items-center gap-2">
              <Checkbox
                id={`price-${range.id}`}
                checked={selectedPriceRange === range.id}
                onCheckedChange={() =>
                  setSelectedPriceRange(
                    selectedPriceRange === range.id ? 'all' : range.id
                  )
                }
              />
              <Label
                htmlFor={`price-${range.id}`}
                className="text-sm font-normal cursor-pointer"
              >
                {range.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <section className={cn('py-12 md:py-16', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-2">
            {config.title}
          </h1>
          {config.subtitle && (
            <p className="text-lg text-muted-foreground">{config.subtitle}</p>
          )}
        </div>

        {/* Search and Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={config.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            {/* Mobile Filter */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  {config.filterTitle}
                  {hasActiveFilters && (
                    <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {selectedCategories.length + (selectedPriceRange !== 'all' ? 1 : 0)}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle>{config.filterTitle}</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <Select value={sortValue} onValueChange={setSortValue}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {config.sortOptions.map((option) => (
                  <SelectItem key={option.id} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-32">
              <h3 className="font-semibold mb-4">{config.filterTitle}</h3>
              <FilterContent />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                </p>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      locale={locale}
                      labels={config.productCardLabels}
                      onAddToCart={(p) => addItem(p)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">{config.noResultsText}</p>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

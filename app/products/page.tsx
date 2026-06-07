import { storeConfig } from '@/config/store-config';
import { ProductsPreview } from '@/components/preview/ProductsPreview';

export const metadata = {
  title: `${storeConfig.productsPage.title} | ${storeConfig.brand.name}`,
  description: storeConfig.productsPage.subtitle,
};

export default function ProductsPage() {
  return <ProductsPreview />;
}

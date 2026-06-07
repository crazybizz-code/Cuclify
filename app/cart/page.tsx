import { storeConfig } from '@/config/store-config';
import { CartPreview } from '@/components/preview/CartPreview';

export const metadata = {
  title: `${storeConfig.cart.title} | ${storeConfig.brand.name}`,
  description: storeConfig.cart.metadataDescription,
};

export default function CartPage() {
  return <CartPreview />;
}

import { storeConfig } from '@/config/store-config';
import { CheckoutPreview } from '@/components/preview/CheckoutPreview';

export const metadata = {
  title: `${storeConfig.checkout.title} | ${storeConfig.brand.name}`,
  description: storeConfig.checkout.metadataDescription,
};

export default function CheckoutPage() {
  return <CheckoutPreview />;
}

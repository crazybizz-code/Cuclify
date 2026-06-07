import { notFound } from 'next/navigation';
import { storeConfig } from '@/config/store-config';
import { ProductPreview } from '@/components/preview/ProductPreview';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return storeConfig.products.products.map((product) => ({
    slug: product.href.split('/').pop(),
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = storeConfig.products.products.find(
    (p) => p.href.split('/').pop() === slug
  );

  if (!product) {
    return {
      title: storeConfig.seo.productNotFoundTitle,
    };
  }

  return {
    title: `${product.name} | ${storeConfig.brand.name}`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = storeConfig.products.products.find(
    (p) => p.href.split('/').pop() === slug
  );

  if (!product) {
    notFound();
  }

  return <ProductPreview slug={slug} />;
}

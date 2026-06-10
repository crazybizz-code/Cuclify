import type { StoreConfig } from '@/types';

export const hero: StoreConfig['hero'] = {
    badge: 'New Collection 2024',
    headline: 'Elevate Your Everyday',
    subheadline:
      'Discover curated pieces that blend timeless elegance with contemporary design. Each item thoughtfully selected for the modern lifestyle.',
    buttons: [
      { label: 'Shop Collection', href: '/collections', variant: 'primary' },
      { label: 'Our Story', href: '/about', variant: 'outline' },
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop',
      alt: 'Elegant lifestyle products arrangement',
    },
    backgroundImage: null,
    alignment: 'left',
    overlayOpacity: null,
  };

export const benefits: StoreConfig['benefits'] = {
    title: 'Why Choose Us',
    subtitle: 'The Lumière difference',
    benefits: [
      {
        id: 'shipping',
        icon: 'truck',
        title: 'Free Shipping',
        description: 'Complimentary shipping on all orders over $100',
      },
      {
        id: 'quality',
        icon: 'shield',
        title: 'Quality Guaranteed',
        description: 'Every item inspected for excellence before shipping',
      },
      {
        id: 'returns',
        icon: 'refresh',
        title: 'Easy Returns',
        description: '30-day hassle-free return policy',
      },
      {
        id: 'support',
        icon: 'headphones',
        title: '24/7 Support',
        description: 'Our team is here to help anytime you need',
      },
    ],
    layout: 'grid',
  };

export const promo: StoreConfig['promo'] = {
    headline: 'Summer Sale',
    subheadline: 'Up to 40% off on selected items. Limited time only.',
    backgroundImage:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&h=600&fit=crop',
    backgroundColor: null,
    textColor: null,
    button: {
      label: 'Shop the Sale',
      href: '/sale',
    },
    countdown: {
      endDate: '2024-12-31T23:59:59',
      label: 'Sale ends in',
      units: {
        days: 'Days',
        hours: 'Hours',
        minutes: 'Mins',
        seconds: 'Secs',
      },
    },
  };

export const testimonials: StoreConfig['testimonials'] = {
    title: 'What Our Customers Say',
    subtitle: 'Real stories from our community',
    testimonials: [
      {
        id: 'test-1',
        content:
          'The quality of the products exceeded my expectations. The attention to detail is remarkable, and the customer service was outstanding.',
        author: {
          name: 'Sarah Mitchell',
          title: 'Interior Designer',
          avatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        },
        rating: 5,
        productId: null,
      },
      {
        id: 'test-2',
        content:
          'I have been shopping here for years. The curated selection makes it easy to find unique pieces that elevate any space.',
        author: {
          name: 'James Chen',
          title: 'Architect',
          avatar:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        },
        rating: 5,
        productId: null,
      },
      {
        id: 'test-3',
        content:
          'Fast shipping, beautiful packaging, and the products look even better in person. This is my go-to for home decor.',
        author: {
          name: 'Emma Rodriguez',
          title: 'Home Stylist',
          avatar:
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        },
        rating: 5,
        productId: null,
      },
    ],
    layout: 'grid',
  };

export const faq: StoreConfig['faq'] = {
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know',
    items: [
      {
        id: 'faq-1',
        question: 'What are your shipping options?',
        answer:
          'We offer standard shipping (5-7 business days), express shipping (2-3 business days), and next-day delivery for select areas. Orders over $100 qualify for free standard shipping.',
      },
      {
        id: 'faq-2',
        question: 'What is your return policy?',
        answer:
          'We accept returns within 30 days of purchase. Items must be unused and in original packaging. We provide a prepaid return label for your convenience.',
      },
      {
        id: 'faq-3',
        question: 'Do you offer international shipping?',
        answer:
          'Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by destination. All duties and taxes are calculated at checkout.',
      },
      {
        id: 'faq-4',
        question: 'How can I track my order?',
        answer:
          'Once your order ships, you will receive an email with tracking information. You can also track your order by logging into your account or contacting our support team.',
      },
      {
        id: 'faq-5',
        question: 'Do you offer gift wrapping?',
        answer:
          'Yes! We offer premium gift wrapping for $8 per item. You can add gift wrapping during checkout and include a personalized message.',
      },
    ],
    contactLink: {
      label: 'Still have questions? Contact us',
      href: '/contact',
    },
  };

export const productsPage: StoreConfig['productsPage'] = {
    title: 'All Products',
    subtitle: 'Explore our complete collection',
    searchPlaceholder: 'Search products...',
    sortOptions: [
      { id: 'featured', label: 'Featured', value: 'featured' },
      { id: 'newest', label: 'Newest', value: 'newest' },
      { id: 'price-asc', label: 'Price: Low to High', value: 'price-asc' },
      { id: 'price-desc', label: 'Price: High to Low', value: 'price-desc' },
      { id: 'rating', label: 'Top Rated', value: 'rating' },
    ],
    filterTitle: 'Filters',
    categoryFilterLabel: 'Category',
    priceFilterLabel: 'Price',
    priceRanges: [
      { id: 'all', label: 'All Prices' },
      { id: 'under-50', label: 'Under $50', max: 50 },
      { id: '50-100', label: '$50 - $100', min: 50, max: 100 },
      { id: '100-200', label: '$100 - $200', min: 100, max: 200 },
      { id: 'over-200', label: 'Over $200', min: 200 },
    ],
    noResultsText: 'No products found matching your criteria.',
    resultsPerPage: 12,
    productCardLabels: {
      quickAddLabel: 'Quick Add',
      outOfStockLabel: 'Out of stock',
    },
  };

export const productDetail: StoreConfig['productDetail'] = {
    addToCartLabel: 'Add to Cart',
    buyNowLabel: 'Buy Now',
    outOfStockLabel: 'Out of Stock',
    quantityLabel: 'Quantity',
    variantLabel: 'Select Option',
    descriptionLabel: 'Description',
    detailsLabel: 'Details',
    shippingLabel: 'Shipping',
    returnsLabel: 'Returns',
    breadcrumbs: {
      homeLabel: 'Home',
      productsLabel: 'Products',
    },
    detailsCopyLabels: {
      categoryLabel: 'Category',
      tagsLabel: 'Tags',
      skuLabel: 'SKU',
    },
    shippingCopy: {
      standardShipping: 'Free standard shipping on orders over $100.',
      expressShipping: 'Express shipping available at checkout.',
      estimatedDelivery: 'Estimated delivery: 3-7 business days.',
    },
    reviewCountLabel: 'reviews',
    saveLabel: 'Save',
    trustBadges: {
      freeShippingLabel: 'Free Shipping',
      easyReturnsLabel: 'Easy Returns',
      securePaymentLabel: 'Secure Payment',
    },
    relatedProductsTitle: 'You May Also Like',
    relatedProductsSubtitle: 'Based on your selection',
    productCardLabels: {
      quickAddLabel: 'Quick Add',
      outOfStockLabel: 'Out of stock',
    },
  };

export const cart: StoreConfig['cart'] = {
    title: 'Shopping Cart',
    metadataDescription: 'View and manage items in your shopping cart.',
    emptyState: {
      title: 'Your cart is empty',
      description: 'Looks like you have not added anything to your cart yet.',
      buttonLabel: 'Continue Shopping',
      buttonHref: '/products',
    },
    itemCountLabel: {
      singular: 'item',
      plural: 'items',
      suffix: 'in your cart',
    },
    summary: {
      title: 'Order Summary',
      subtotalLabel: 'Subtotal',
      shippingLabel: 'Shipping',
      shippingValue: 'Calculated at checkout',
      taxLabel: 'Tax',
      totalLabel: 'Total',
    },
    checkoutButton: {
      label: 'Proceed to Checkout',
      href: '/checkout',
    },
    continueShoppingLink: {
      label: 'Continue Shopping',
      href: '/products',
    },
  };

export const checkout: StoreConfig['checkout'] = {
    title: 'Checkout',
    metadataDescription: 'Complete your purchase securely.',
    steps: [
      { id: 'info', title: 'Information', description: 'Contact details' },
      { id: 'shipping', title: 'Shipping', description: 'Delivery address' },
      { id: 'payment', title: 'Payment', description: 'Payment method' },
    ],
    emptyState: {
      title: 'Your cart is empty',
      description: 'Add some items to your cart before checking out.',
      continueShoppingLabel: 'Continue Shopping',
      continueShoppingHref: '/products',
    },
    customerInfo: {
      title: 'Contact Information',
      emailLabel: 'Email',
      emailPlaceholder: 'your@email.com',
      phoneLabel: 'Phone',
      phonePlaceholder: '+1 (555) 123-4567',
    },
    shippingInfo: {
      title: 'Shipping Address',
      firstNameLabel: 'First Name',
      firstNamePlaceholder: 'John',
      lastNameLabel: 'Last Name',
      lastNamePlaceholder: 'Doe',
      addressLabel: 'Address',
      addressPlaceholder: '123 Main Street',
      apartmentLabel: 'Apartment, suite, etc.',
      apartmentPlaceholder: 'Apt 4B',
      cityLabel: 'City',
      cityPlaceholder: 'New York',
      stateLabel: 'State',
      statePlaceholder: 'NY',
      zipLabel: 'ZIP Code',
      zipPlaceholder: '10001',
      countryLabel: 'Country',
      countryPlaceholder: 'United States',
    },
    paymentInfo: {
      title: 'Payment Method',
      cardNumberLabel: 'Card Number',
      cardNumberPlaceholder: '1234 5678 9012 3456',
      expiryLabel: 'Expiry Date',
      expiryPlaceholder: 'MM/YY',
      cvvLabel: 'CVV',
      cvvPlaceholder: '123',
      nameOnCardLabel: 'Name on Card',
      nameOnCardPlaceholder: 'John Doe',
    },
    orderSummary: {
      title: 'Order Summary',
      subtotalLabel: 'Subtotal',
      shippingLabel: 'Shipping',
      taxLabel: 'Tax',
      totalLabel: 'Total',
      freeShippingLabel: 'Free',
    },
    labels: {
      secure: 'Secure',
      back: 'Back',
      continue: 'Continue',
    },
    placeOrderButton: 'Place Order',
    successState: {
      title: 'Order Confirmed!',
      description: 'Thank you for your purchase. You will receive an email confirmation shortly.',
      orderNumberLabel: 'Order Number',
      continueShoppingLabel: 'Continue Shopping',
      continueShoppingHref: '/products',
    },
  };

export const homeSections: StoreConfig['pages']['home']['sections'] = [
  { type: 'hero' },
  { type: 'categoryGrid' },
  { type: 'featuredProducts' },
  { type: 'benefits' },
  { type: 'promoBanner' },
  { type: 'testimonials' },
  { type: 'faq' },
];

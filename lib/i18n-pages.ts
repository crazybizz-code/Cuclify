export const uzPages = {
  products: {
    title: 'Barcha Mahsulotlar',
    subtitle: 'Kolleksiyamizni o\'rganing',
    searchPlaceholder: 'Mahsulotlarni qidirish...',
    sortOptions: [
      { id: 'featured', label: 'Tavsiya etilgan', value: 'featured' },
      { id: 'newest', label: 'Eng yangi', value: 'newest' },
      { id: 'price-asc', label: 'Narx: Arzonidan qimmatiga', value: 'price-asc' },
      { id: 'price-desc', label: 'Narx: Qimmatidan arzoniga', value: 'price-desc' },
    ],
    filterTitle: 'Filtrlar',
    categoryFilterLabel: 'Kategoriya',
    priceFilterLabel: 'Narx',
    priceRanges: [
      { id: 'all', label: 'Barcha narxlar' },
    ],
    noResultsText: 'Mahsulotlar topilmadi.',
    resultsPerPage: 12,
    productCardLabels: {
      quickAddLabel: 'Savatga qo\'shish',
      outOfStockLabel: 'Sotuvda yo\'q',
    },
  },
  productDetail: {
    addToCartLabel: 'Savatga qo\'shish',
    buyNowLabel: 'Hozir sotib olish',
    outOfStockLabel: 'Sotuvda yo\'q',
    quantityLabel: 'Miqdor',
    variantLabel: 'Tanlovlar',
    descriptionLabel: 'Tavsif',
    detailsLabel: 'Batafsil',
    shippingLabel: 'Yetkazib berish',
    returnsLabel: 'Qaytarish',
    breadcrumbs: {
      homeLabel: 'Bosh sahifa',
      productsLabel: 'Mahsulotlar',
    },
    detailsCopyLabels: {
      categoryLabel: 'Kategoriya',
      tagsLabel: 'Teglar',
      skuLabel: 'SKU',
    },
    shippingCopy: {
      standardShipping: 'Standart yetkazib berish mavjud.',
      expressShipping: 'Tezkor yetkazib berish mavjud.',
      estimatedDelivery: '3-7 ish kuni.',
    },
    reviewCountLabel: 'sharhlar',
    saveLabel: 'Tejamkorlik',
    trustBadges: {
      freeShippingLabel: 'Bepul yetkazib berish',
      easyReturnsLabel: 'Oson qaytarish',
      securePaymentLabel: 'Xavfsiz to\'lov',
    },
    relatedProductsTitle: 'Tavsiya etilgan',
    productCardLabels: {
      quickAddLabel: 'Savatga qo\'shish',
      outOfStockLabel: 'Sotuvda yo\'q',
    },
  },
  cart: {
    title: 'Savat',
    metadataDescription: 'Sizning xarid savatingiz.',
    emptyState: {
      title: 'Savat bo\'sh',
      description: 'Xaridni boshlash uchun mahsulot qo\'shing.',
      buttonLabel: 'Xaridni davom ettirish',
      buttonHref: '/products',
    },
    itemCountLabel: {
      singular: 'mahsulot',
      plural: 'mahsulotlar',
      suffix: 'savatda',
    },
    summary: {
      title: 'Buyurtma tafsiloti',
      subtotalLabel: 'Oraliq jami',
      shippingLabel: 'Yetkazib berish',
      shippingValue: 'To\'lov bosqichida hisoblanadi',
      taxLabel: 'Soliq',
      totalLabel: 'Jami',
    },
    checkoutButton: {
      label: 'Rasmiylashtirish',
      href: '/checkout',
    },
    continueShoppingLink: {
      label: 'Xaridni davom ettirish',
      href: '/products',
    },
  },
  checkout: {
    title: 'To\'lov',
    metadataDescription: 'Buyurtmani yakunlash.',
    steps: [
      { id: 'info', title: 'Ma\'lumot' },
      { id: 'shipping', title: 'Yetkazib berish' },
      { id: 'payment', title: 'To\'lov' },
    ],
    emptyState: {
      title: 'Savat bo\'sh',
      description: 'To\'lov qilishdan oldin mahsulot qo\'shing.',
      continueShoppingLabel: 'Xaridni davom ettirish',
      continueShoppingHref: '/products',
    },
    customerInfo: {
      title: 'Kontakt ma\'lumotlari',
      emailLabel: 'Email',
      emailPlaceholder: 'email@example.com',
      phoneLabel: 'Telefon',
      phonePlaceholder: 'Telefon raqamingiz',
    },
    shippingInfo: {
      title: 'Yetkazib berish manzili',
      firstNameLabel: 'Ism',
      firstNamePlaceholder: '',
      lastNameLabel: 'Familiya',
      lastNamePlaceholder: '',
      addressLabel: 'Manzil',
      addressPlaceholder: '',
      apartmentLabel: 'Xonadon / Uy',
      apartmentPlaceholder: '',
      cityLabel: 'Shahar',
      cityPlaceholder: '',
      stateLabel: 'Viloyat',
      statePlaceholder: '',
      zipLabel: 'Pochta indeksi',
      zipPlaceholder: '',
      countryLabel: 'Mamlakat',
      countryPlaceholder: '',
    },
    paymentInfo: {
      title: 'To\'lov ma\'lumotlari',
      cardNumberLabel: 'Karta raqami',
      cardNumberPlaceholder: '',
      expiryLabel: 'Amal qilish muddati',
      expiryPlaceholder: 'OO/YY',
      cvvLabel: 'CVV',
      cvvPlaceholder: '',
      nameOnCardLabel: 'Karta egasining ismi',
      nameOnCardPlaceholder: '',
    },
    orderSummary: {
      title: 'Buyurtma tafsiloti',
      subtotalLabel: 'Oraliq jami',
      shippingLabel: 'Yetkazib berish',
      taxLabel: 'Soliq',
      totalLabel: 'Jami',
      freeShippingLabel: 'Bepul',
    },
    labels: {
      secure: 'Xavfsiz',
      back: 'Orqaga',
      continue: 'Davom etish',
    },
    placeOrderButton: 'Buyurtma berish',
    successState: {
      title: 'Rahmat!',
      description: 'Buyurtmangiz qabul qilindi.',
      orderNumberLabel: 'Buyurtma #',
      continueShoppingLabel: 'Xaridni davom ettirish',
      continueShoppingHref: '/products',
    },
  },
};

export const ruPages = {
  products: {
    title: 'Все товары',
    subtitle: 'Исследуйте нашу коллекцию',
    searchPlaceholder: 'Поиск товаров...',
    sortOptions: [
      { id: 'featured', label: 'Рекомендуемые', value: 'featured' },
      { id: 'newest', label: 'Новинки', value: 'newest' },
      { id: 'price-asc', label: 'Цена: от дешевых к дорогим', value: 'price-asc' },
      { id: 'price-desc', label: 'Цена: от дорогих к дешевым', value: 'price-desc' },
    ],
    filterTitle: 'Фильтры',
    categoryFilterLabel: 'Категория',
    priceFilterLabel: 'Цена',
    priceRanges: [
      { id: 'all', label: 'Все цены' },
    ],
    noResultsText: 'Товары не найдены.',
    resultsPerPage: 12,
    productCardLabels: {
      quickAddLabel: 'В корзину',
      outOfStockLabel: 'Нет в наличии',
    },
  },
  productDetail: {
    addToCartLabel: 'В корзину',
    buyNowLabel: 'Купить сейчас',
    outOfStockLabel: 'Нет в наличии',
    quantityLabel: 'Количество',
    variantLabel: 'Варианты',
    descriptionLabel: 'Описание',
    detailsLabel: 'Детали',
    shippingLabel: 'Доставка',
    returnsLabel: 'Возврат',
    breadcrumbs: {
      homeLabel: 'Главная',
      productsLabel: 'Товары',
    },
    detailsCopyLabels: {
      categoryLabel: 'Категория',
      tagsLabel: 'Теги',
      skuLabel: 'Артикул',
    },
    shippingCopy: {
      standardShipping: 'Доступна стандартная доставка.',
      expressShipping: 'Доступна экспресс-доставка.',
      estimatedDelivery: '3-7 рабочих дней.',
    },
    reviewCountLabel: 'отзывов',
    saveLabel: 'Скидка',
    trustBadges: {
      freeShippingLabel: 'Бесплатная доставка',
      easyReturnsLabel: 'Простой возврат',
      securePaymentLabel: 'Безопасная оплата',
    },
    relatedProductsTitle: 'Рекомендуемые',
    productCardLabels: {
      quickAddLabel: 'В корзину',
      outOfStockLabel: 'Нет в наличии',
    },
  },
  cart: {
    title: 'Корзина',
    metadataDescription: 'Ваша корзина покупок.',
    emptyState: {
      title: 'Ваша корзина пуста',
      description: 'Добавьте товары, чтобы начать покупки.',
      buttonLabel: 'Продолжить покупки',
      buttonHref: '/products',
    },
    itemCountLabel: {
      singular: 'товар',
      plural: 'товаров',
      suffix: 'в корзине',
    },
    summary: {
      title: 'Детали заказа',
      subtotalLabel: 'Подытог',
      shippingLabel: 'Доставка',
      shippingValue: 'Рассчитывается при оформлении',
      taxLabel: 'Налог',
      totalLabel: 'Итого',
    },
    checkoutButton: {
      label: 'Оформить заказ',
      href: '/checkout',
    },
    continueShoppingLink: {
      label: 'Продолжить покупки',
      href: '/products',
    },
  },
  checkout: {
    title: 'Оформление заказа',
    metadataDescription: 'Завершите ваш заказ.',
    steps: [
      { id: 'info', title: 'Информация' },
      { id: 'shipping', title: 'Доставка' },
      { id: 'payment', title: 'Оплата' },
    ],
    emptyState: {
      title: 'Ваша корзина пуста',
      description: 'Добавьте товары перед оформлением заказа.',
      continueShoppingLabel: 'Продолжить покупки',
      continueShoppingHref: '/products',
    },
    customerInfo: {
      title: 'Контактная информация',
      emailLabel: 'Email',
      emailPlaceholder: 'email@example.com',
      phoneLabel: 'Телефон',
      phonePlaceholder: 'Номер телефона',
    },
    shippingInfo: {
      title: 'Адрес доставки',
      firstNameLabel: 'Имя',
      firstNamePlaceholder: '',
      lastNameLabel: 'Фамилия',
      lastNamePlaceholder: '',
      addressLabel: 'Адрес',
      addressPlaceholder: '',
      apartmentLabel: 'Квартира / Офис',
      apartmentPlaceholder: '',
      cityLabel: 'Город',
      cityPlaceholder: '',
      stateLabel: 'Регион',
      statePlaceholder: '',
      zipLabel: 'Почтовый индекс',
      zipPlaceholder: '',
      countryLabel: 'Страна',
      countryPlaceholder: '',
    },
    paymentInfo: {
      title: 'Информация об оплате',
      cardNumberLabel: 'Номер карты',
      cardNumberPlaceholder: '',
      expiryLabel: 'Срок действия',
      expiryPlaceholder: 'ММ/ГГ',
      cvvLabel: 'CVV',
      cvvPlaceholder: '',
      nameOnCardLabel: 'Имя на карте',
      nameOnCardPlaceholder: '',
    },
    orderSummary: {
      title: 'Детали заказа',
      subtotalLabel: 'Подытог',
      shippingLabel: 'Доставка',
      taxLabel: 'Налог',
      totalLabel: 'Итого',
      freeShippingLabel: 'Бесплатно',
    },
    labels: {
      secure: 'Безопасно',
      back: 'Назад',
      continue: 'Далее',
    },
    placeOrderButton: 'Оформить заказ',
    successState: {
      title: 'Спасибо!',
      description: 'Заказ подтвержден.',
      orderNumberLabel: 'Заказ #',
      continueShoppingLabel: 'Продолжить покупки',
      continueShoppingHref: '/products',
    },
  },
};

/**
 * Returns localised default configurations for inner static pages based on DNA language.
 * Easily extensible for future language additions (e.g. Spanish, German).
 */
export function getLocalizedPagesConfig(lang: string, fallback: any): any {
  const normLang = (lang || 'en').toLowerCase();
  if (normLang === 'uz') {
    return {
      ...fallback,
      ...uzPages,
    };
  } else if (normLang === 'ru') {
    return {
      ...fallback,
      ...ruPages,
    };
  }
  return fallback; // Defaults to English
}

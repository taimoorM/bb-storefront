export interface Category {
  id: string;
  name: string;
  parentCategoryId: string | null;
  active?: boolean;
  image: string | null;
  subCategories?: Category[] | null;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  image?: string | null;
  active: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string | null;
  images: Image[] | [];
  brand: Brand["id"] | null;
  category: Category["id"] | [];
  variants: Variant[];
}

export type Inventory = InventoryItem[];

export interface Variant {
  id: string;
  price: number;
  quantity: number;
  sku: string | null;
  values: VariantValue[];
}

export interface VariantValue {
  id: string;
  value: string;
  label: string;
  type: string;
}

export interface InventoryMap {
  [itemId: string]: InventoryItem;
}

export interface Session {
  id: string;
  createdAt: string;
  expiresAt: string;
  token: string;
  customerId: string;
}

interface Image {
  id: string;
  path: string;
  isPrimary: boolean;
}

export interface Type {
  id: string;
  label: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  currency: string;
}

export interface Session {
  id: string;
  createdAt: string;
  expiresAt: string;
  token: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  sessionId?: string;
  storeId: string;
  user?: string;
  subTotal: number;
}
[];

export interface CartItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  quantity: number;
  price: number;
  availableQuantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  customerId: string;
  storeId: string;
  items: OrderItem[];
  paymentIntentId: string;
  billing: {
    name: string;
    phone: string;
    address: Address;
  };
  shipping: {
    name: string;
    phone: string;
    address: Address;
  };
  currency: string;
  totals: Totals;
  user?: string | null;
  sessionId?: string;
  expiresAt: string;
  status: string;
  email: string;
  invoiceId: string;
}

export interface OrderItem {
  id: string;
  sku: string | null;
  title: string;
  subtitle: string;
  image: string;
  quantity: number;
  productId: string;
  price: number;
}

export interface Address {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Totals {
  total: number;
  subtotal: number;
  taxAmount: number;
}

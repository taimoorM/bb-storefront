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
  expiresAt: string;
  token: string;
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
  address: Address;
  phone: string;
  currency: string;
  tax: {
    rate: number;
    label: string;
  };
  hours: {
    day: string;
    open: string;
    close: string;
  }[];
  hoursMatch: boolean;
  inventory: Inventory;
}

export interface Session {
  expiresAt: string;
  token: string;
  customer: string | null;
}

export interface Cart {
  id: string;
  items: CartItem[];
  outOfStock: string[];
  subtotal: number;
}
[];

export interface CartItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  quantity: number;
  price: number;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: Address;
  emailVerified: Date;
  shipping: {
    name: string;
    phone: string;
    address: Address;
  };
}

export interface Order {
  id: string;
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
  expiresAt: string;
  status: string;
  guest: {
    email: string;
  } | null;
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
  country?: string;
}

export interface Totals {
  total: number;
  subtotal: number;
  taxAmount: number;
}

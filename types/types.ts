export interface Category {
  id: string;
  name: string;
  parentCategoryId: string | null;
  active?: boolean;
  image: string | null;
  subCategories?: Category[] | null;
}

export interface Type {
  id: string;
  label: string;
}

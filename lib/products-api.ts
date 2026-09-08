export type ApiCategory = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
};

export type ApiProduct = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_price: number | null;
  sku: string | null;
  stock: number;
  is_active: boolean;
  is_new: boolean;
  is_best_seller: boolean;
  category: ApiCategory | null;
  images: {
    id: number;
    image_url: string;
    alt_text: string | null;
    sort_order: number;
  }[];
  variants: {
    id: number;
    size: string | null;
    color: string | null;
    sku: string | null;
    stock: number;
    price: number | null;
  }[];
};

type ProductsResponse = {
  success: boolean;
  count: number;
  products: ApiProduct[];
};

type CategoriesResponse = {
  success: boolean;
  categories: ApiCategory[];
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:5000";

export async function getProducts(): Promise<ApiProduct[]> {
  const response = await fetch(
    `${API_URL}/api/products`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data: ProductsResponse =
    await response.json();

  return data.products;
}

export async function getCategories(): Promise<ApiCategory[]> {
  const response = await fetch(
    `${API_URL}/api/categories`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data: CategoriesResponse =
    await response.json();

  return data.categories;
}

export async function getProductById(
  id: number
): Promise<ApiProduct | null> {
  const response = await fetch(
    `${API_URL}/api/products/${id}`,
    {
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      "Failed to fetch product"
    );
  }

  const data: {
    success: boolean;
    product: ApiProduct;
  } = await response.json();

  return data.product;
}
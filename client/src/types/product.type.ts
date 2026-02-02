import type { Profile } from "./user.type";

export type Product = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  status: ProductStatus;
  user: Profile;
  createdAt: string;
  updatedAt: string;
};

export interface CreateProductInput {
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  teamId: string;
}
export interface UpdateProductInput {
  title?: string;
  description?: string;
  imageUrl?: string | null;
  status?: "Active";
}

export interface UpdateProductStatusInput {
  status: ProductStatus;
}


export interface ListProductsParams {
  cursor?: string;
  limit?: number;
  q?: string;
  status?: ProductStatus;
  createdBy?: string;
  sortDir?: "asc" | "desc";
}

export interface ListProductsResponse {
  products: Product[];
  cursor: string | null;
}
export type ProductStatus = "Draft" | "Active" | "Deleted";

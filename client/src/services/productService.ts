import apiClient from "@/lib/apiClient";
import type {
  CreateProductInput,
  ListProductsParams,
  ListProductsResponse,
  Product,
  UpdateProductInput,
  UpdateProductStatusInput,
} from "@/types/product.type";

export const createProduct = async (payload: CreateProductInput) => {
  try {
    const response = await apiClient.post<Product>("/products", payload);
    return response.data;
  } catch (error: any) {
    console.error("Failed to create product:", {
      message: error?.message,
      status: error?.response?.status,
      details: error?.response?.data,
    });
    throw error;
  }
};

export const getProduct = async (id: string) => {
  try {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to get product:", {
      message: error?.message,
      status: error?.response?.status,
      details: error?.response?.data,
    });
    throw error;
  }
};

export const updateProduct = async (
  id: string,
  payload: UpdateProductInput,
) => {
  try {
    const response = await apiClient.patch<Product>(`/products/${id}`, payload);
    return response.data;
  } catch (error: any) {
    console.error("Failed to update product:", {
      message: error?.message,
      status: error?.response?.status,
      details: error?.response?.data,
    });
    throw error;
  }
};

export const updateProductStatus = async (
  id: string,
  payload: UpdateProductStatusInput,
) => {
  try {
    const response = await apiClient.patch<Product>(`/products/${id}`, payload);
    return response.data;
  } catch (error: any) {
    console.error("Failed to update product status:", {
      message: error?.message,
      status: error?.response?.status,
      details: error?.response?.data,
    });
    throw error;
  }
};

export const listProducts = async (params: ListProductsParams = {}) => {
  try {
    const response = await apiClient.get<ListProductsResponse>("/products", {
      params,
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch products:", {
      message: error?.message,
      status: error?.response?.status,
      details: error?.response?.data,
    });
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const response = await apiClient.delete(`products/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to delete product:", {
      message: error?.message,
      status: error?.response?.status,
      details: error?.response?.data,
    });
    throw error;
  }
};

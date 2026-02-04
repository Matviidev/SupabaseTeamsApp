import { createProduct as createProductApi } from "@/services/productService";
import type { Product } from "@/types/product.type";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useCreateProduct = () => {
  const navigate = useNavigate();

  const { mutate: createProduct, isPending: isCreating } = useMutation({
    mutationFn: createProductApi,
    onSuccess: (product: Product) => {
      const createdProductId = product.id;
      toast.success("Product was successfully created!");
      navigate(`/products/${createdProductId}`);
    },
    onError: () => {
      toast.error(
        "Something went wrong while creating a product! Try again later",
      );
    },
  });

  return { createProduct, isCreating };
};

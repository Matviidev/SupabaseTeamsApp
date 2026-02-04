import { updateProduct as updateProductApi } from "@/services/productService";
import type { UpdateProductInput } from "@/types/product.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  const { mutate: updateProduct, isPending: isUpdating } = useMutation({
    // 1. Destructure the single object into two variables for your API call
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateProductInput;
    }) => updateProductApi(id, payload),

    onSuccess: (updatedProduct) => {
      // 2. Update the specific product cache
      queryClient.setQueryData(["product", updatedProduct.id], updatedProduct);

      // 3. Also invalidate the list so the table/list view refreshes
      queryClient.invalidateQueries({ queryKey: ["products"] });

      toast.success("Product was successfully updated!");
    },
    // ... rest of your code
  });

  return { updateProduct, isUpdating };
};

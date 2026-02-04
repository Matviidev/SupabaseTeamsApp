import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "@/services/productService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      // Invalidate the infinite products list
      queryClient.invalidateQueries({ queryKey: ["products"] });
      // Navigate to the products list page
      navigate("/products");
      toast.success("Product successfully deleted!");
    },
    onError: (error) => {
      console.error("Delete product failed:", error);
      toast.error("Failed to delete product. Please try again.");
    },
  });

  return { deleteProduct: mutate, isDeleting: isPending };
};

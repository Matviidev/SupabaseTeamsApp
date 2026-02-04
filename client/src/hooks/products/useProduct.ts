import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/services/productService";
export const useProduct = () => {
  const { productId: productIdParam } = useParams();

  const productId = productIdParam || "";

  const {
    data: product,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
    enabled: Boolean(productId),
  });

  return { product, isFetching, error };
};

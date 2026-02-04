import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { listProducts } from "@/services/productService";
import type {
  ListProductsResponse,
  ProductStatus,
  ListProductsParams,
} from "@/types/product.type";

const fetchProducts = async ({
  pageParam,
  query,
}: {
  pageParam: string | undefined;
  query: Partial<ListProductsParams>;
}): Promise<ListProductsResponse> => {
  const params: ListProductsParams = {
    ...query,
    limit: 20,
    cursor: pageParam,
  };
  console.log(query);
  return listProducts(params);
};

export const useInfiniteProducts = () => {
  const [searchParams] = useSearchParams();

  const q = searchParams.get("q") ?? undefined;
  const status =
    (searchParams.get("status") as ProductStatus | null) ?? undefined;
  const createdBy = searchParams.get("createdBy") ?? undefined;
  const sortDir =
    (searchParams.get("sortDir") as "asc" | "desc" | null) ?? "desc";

  const queryParams: Partial<ListProductsParams> = {
    q,
    status,
    createdBy,
    sortDir,
  };

  const query = useInfiniteQuery<
    ListProductsResponse,
    Error,
    ListProductsResponse,
    string | undefined
  >({
    queryKey: ["products", queryParams],
    queryFn: ({ pageParam }) =>
      fetchProducts({ pageParam, query: queryParams }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.cursor ?? undefined,
  });

  return {
    data: query.data,
    isFetching: query.isFetching,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    error: query.error,
  };
};


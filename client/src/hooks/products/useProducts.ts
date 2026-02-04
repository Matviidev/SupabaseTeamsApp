// This hook is deprecated, use useInfiniteProducts.
export const useProducts = () => {
    return {
        products: [],
        total: 0,
        page: 1,
        pageSize: 5,
        isFetching: false,
        error: null,
    };
};

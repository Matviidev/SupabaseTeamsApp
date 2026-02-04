import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Calendar, X, Loader2, Plus } from "lucide-react";
import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteProducts } from "@/hooks/products/useInfiniteProducts";
import ProductsSkeleton from "@/components/ProductsSkeleton";
import productPlaceholder from "@/assets/product-placeholder.svg?url";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { Product, ListProductsResponse } from "@/types/product.type";
import { useTeam } from "@/hooks/team/useTeam";
import getStatusBadgeVariant from "@/utils/getStatusBadgeVariant";
import getStatusIcon from "@/utils/getStatusIcon";

function Products() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteProducts();

  const products =
    (data as unknown as InfiniteData<ListProductsResponse>)?.pages.flatMap(
      (page) => page.products,
    ) ?? [];
  const total = products.length;

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") ?? "all",
  );
  const [authorFilter, setAuthorFilter] = useState(
    searchParams.get("createdBy") ?? "all",
  );
  const [sortDirFilter, setSortDirFilter] = useState(
    searchParams.get("sortDir") ?? "desc",
  );

  const { team } = useTeam();
  const uniqueAuthors = useMemo(() => {
    if (!team?.users) return [];
    const authorMap = new Map();
    team?.users.forEach((member) => {
      const key = member.id;
      if (!authorMap.has(key)) {
        authorMap.set(key, {
          id: member.id,
          name: member.fullName,
        });
      }
    });
    return Array.from(authorMap.values());
  }, [team?.users]);

  const handleFilterChange = (key: string) => (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "" || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("cursor");
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setAuthorFilter("all");
    setSortDirFilter("desc");

    const params = new URLSearchParams();
    params.delete("q");
    params.delete("status");
    params.delete("createdBy");
    params.delete("sortDir");
    params.delete("cursor");
    setSearchParams(params);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  console.log({ products });

  const hasActiveFilters =
    searchTerm ||
    statusFilter !== "all" ||
    authorFilter !== "all" ||
    sortDirFilter !== "desc";

  return (
    <div className="lg:w-[60%] w-[90%] mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        </div>
        <Button onClick={() => navigate("/create")}>
          <Plus className="w-4 h-4 mr-2" />
          Create Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Search for products
            </CardTitle>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleFilterChange("q")(searchTerm);
                }
              }}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  handleFilterChange("status")(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Created By</Label>
              <Select
                value={authorFilter}
                onValueChange={(value) => {
                  setAuthorFilter(value);
                  handleFilterChange("createdBy")(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All authors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Authors</SelectItem>
                  {uniqueAuthors.map((author) => (
                    <SelectItem key={author.id} value={author.id}>
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sort Direction</Label>
              <Select
                value={sortDirFilter}
                onValueChange={(value) => {
                  setSortDirFilter(value);
                  handleFilterChange("sortDir")(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort Direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest First</SelectItem>
                  <SelectItem value="asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isFetching && !products.length ? (
        <ProductsSkeleton />
      ) : (
        <>
          <Card className="overflow-hidden p-0 border shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                  <thead>
                    <tr>
                      <th className="bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24 border-b">
                        Image
                      </th>
                      <th className="bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Product
                      </th>
                      <th className="bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Status
                      </th>
                      <th className="bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Author
                      </th>
                      <th className="bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {total === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          No products found matching your criteria
                        </td>
                      </tr>
                    ) : (
                      products.map((product: Product) => (
                        <tr
                          key={product.id}
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => handleViewProduct(product.id)}
                        >
                          <td className="px-4 py-4 border-b last:border-0">
                            <img
                              src={product.imageUrl || productPlaceholder}
                              alt={product.title}
                              className="w-16 h-16 object-cover rounded-md border"
                            />
                          </td>
                          <td className="px-4 py-4 border-b last:border-0">
                            <div className="space-y-1">
                              <p className="font-medium text-gray-900">
                                {product.title}
                              </p>
                              <p className="text-sm text-gray-500 line-clamp-2">
                                {product.description}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4 border-b last:border-0">
                            <Badge
                              variant={getStatusBadgeVariant(product.status)}
                              className="flex items-center space-x-1 w-fit"
                            >
                              {getStatusIcon(product.status)}
                              <span className="capitalize">
                                {product.status}
                              </span>
                            </Badge>
                          </td>
                          <td className="px-4 py-4 border-b last:border-0">
                            <p className="text-sm font-medium">
                              {product.user.fullName}
                            </p>
                          </td>
                          <td className="px-4 py-4 border-b last:border-0">
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(product.createdAt)}</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {hasNextPage && (
            <div className="flex items-center justify-center pt-4">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="outline"
                size="lg"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading more...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Products;

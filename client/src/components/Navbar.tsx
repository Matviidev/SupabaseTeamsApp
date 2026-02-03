import { Link, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { getTeam } from "@/services/teamService";
import { listProducts } from "@/services/productService";
import type { ListProductsParams } from "@/types/product.type";

function Navbar() {
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const teamId = useAuthStore((state) => state.profile?.teamId);

  const menuItems = [
    { title: "Team", to: `/team`, prefetch: true },
    { title: "Products", to: "/products", prefetch: true },
  ];

  const prefetchTeam = () => {
    if (teamId) {
      queryClient.prefetchQuery({
        queryKey: ["team", teamId],
        queryFn: () => getTeam(teamId),
      });
    }
  };

  const prefetchProducts = () => {
    // Default params for product list when navigating from navbar (no search, default sort)
    const defaultParams: ListProductsParams = {
      limit: 20,
      sortDir: "desc",
    };
    const queryKey = ["products", { sortDir: "desc" }];

    queryClient.prefetchInfiniteQuery({
      queryKey: queryKey,
      queryFn: ({ pageParam }) =>
        listProducts({ ...defaultParams, cursor: pageParam }),
      initialPageParam: undefined,
    });
  };

  const prefetchers: Record<string, (() => void) | undefined> = {
    "/team": prefetchTeam,
    "/products": prefetchProducts,
  };
  return (
    <div className="flex justify-center items-center border-b border-stone-200">
      <ul className="flex gap-10 text-stone-400 items-center">
        {menuItems.map(({ title, to, prefetch }, idx) => {
          const isActive = pathname === to;
          const prefetchHandler = prefetch ? prefetchers[to] : undefined;
          return (
            <li
              key={idx}
              onMouseEnter={prefetchHandler}
              className={`px-3 py-2 transition-colors duration-200 cursor-pointer ${
                isActive
                  ? "text-stone-900 font-semibold border-b-2 border-stone-900"
                  : "hover:text-stone-900"
              }`}
            >
              <Link to={to}>{title.toLocaleUpperCase()}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Navbar;
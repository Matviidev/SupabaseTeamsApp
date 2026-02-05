import type { ProductStatus } from "@/types/product.type";

export default function getStatusBadgeVariant(status: ProductStatus) {
  switch (status) {
    case "Draft":
      return "secondary";
    case "Active":
      return "success";
    case "Deleted":
      return "destructive";
    default:
      return "secondary";
  }
}

import type { ProductStatus } from "@/types/product.type";
import { CheckCircle, FileText, Trash2 } from "lucide-react";

export default function getStatusIcon(status: ProductStatus) {
  switch (status) {
    case "Draft":
      return <FileText className="h-3 w-3" />;
    case "Active":
      return <CheckCircle className="h-3 w-3" />;
    case "Deleted":
      return <Trash2 className="h-3 w-3" />;
    default:
      return <FileText className="h-3 w-3" />;
  }
}

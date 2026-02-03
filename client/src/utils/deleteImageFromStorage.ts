import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export async function deleteImageFromStore(imageUrl: string) {
  try {
    const path = imageUrl.split("/products/")[1];
    if (!path) return;

    const { error } = await supabase.storage.from("products").remove([path]); 

    if (error) {
      console.error("Failed to delete image:", error.message);
      toast.error("Failed to delete old image");
    }
  } catch (err) {
    console.error("Unexpected error deleting image:", err);
  }
}

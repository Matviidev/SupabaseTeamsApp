import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default async function uploadImageToStore(imageFile: File) {
  const filePath = `${Date.now()}_${imageFile.name}`;
  let imageUrl: string | null = null;

  const { error: uploadError } = await supabase.storage
    .from("products")
    .upload(filePath, imageFile);

  if (uploadError) {
    toast.error("Failed to upload image");
    return null;
  }
  const { data } = supabase.storage.from("products").getPublicUrl(filePath);
  imageUrl = data.publicUrl;

  return imageUrl;
}

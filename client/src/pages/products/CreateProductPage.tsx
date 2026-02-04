import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { useCreateProduct } from "@/hooks/products/useCreateProduct";
import uploadImageToStore from "@/utils/uploadImageToStore";
import type { CreateProductInput } from "@/types/product.type";
import { useTeam } from "@/hooks/team/useTeam";
interface FormData {
  title: string;
  description: string;
  image: File | null;
}

function CreateProductPage() {
  const { createProduct, isCreating } = useCreateProduct();
  const { team } = useTeam();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setImagePreview(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    let imageUrl: string | null = null;

    if (formData.image) {
      imageUrl = await uploadImageToStore(formData.image);
      if (!imageUrl) {
        return;
      }
    }
    const productData: CreateProductInput = {
      title: formData.title,
      description: formData.description,
      imageUrl: imageUrl,
      teamId: team?.id!,
    };

    createProduct(productData);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create New Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Product Title</Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Enter product title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter product description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="w-full resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Product Image</Label>

              {!imagePreview ? (
                <div className="border-2 border-dashed border-stone-300 rounded-lg p-8 text-center hover:border-stone-400 transition-colors">
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="image"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload className="h-12 w-12 text-stone-900" />
                    <span className="text-sm text-stone-600">
                      Click to upload an image
                    </span>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-full h-48 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-stone-900 text-white rounded-full p-1 hover:bg-stone-800 transition-colors cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {formData.image?.name}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isCreating || !formData.title || !formData.description}
              className="w-full bg-stone-900 hover:bg-stone-800 cursor-pointer"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>CREATE PRODUCT</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateProductPage;

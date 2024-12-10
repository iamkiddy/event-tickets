import { X, ImageIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from 'next/image';

interface ImageUploadProps {
  id?: string;
  label?: string;
  value?: File | null;
  previewUrl: string | null;
  onChange: (file: File | null) => void;
  onPreviewChange: (url: string | null) => void;
  disabled?: boolean;
  required?: boolean;
}

export function ImageUpload({
  id = "image",
  label = "Image",
  previewUrl,
  onChange,
  onPreviewChange,
  disabled,
  required
}: ImageUploadProps) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      const url = URL.createObjectURL(file);
      onPreviewChange(url);
    }
  };

  const handleRemoveImage = () => {
    onChange(null);
    onPreviewChange(null);
  };

  return (
    <div className="grid gap-4">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label} {required && '*'}
      </Label>
      {previewUrl ? (
        <div className="relative mt-2 h-48 w-full">
          <Image
            fill
            src={previewUrl}
            alt="Preview"
            className="h-full w-full object-cover rounded-md"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primaryColor transition-colors">
          <Input
            id={id}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            disabled={disabled}
          />
          <label
            htmlFor={id}
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <div className="p-3 rounded-full bg-primaryColor/10">
              <ImageIcon className="h-6 w-6 text-primaryColor" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Click to upload image
            </span>
            <span className="text-xs text-gray-500">
              SVG, PNG, JPG or GIF (max. 800x400px)
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
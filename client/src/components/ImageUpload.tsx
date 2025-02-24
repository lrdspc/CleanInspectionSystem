import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  label?: string;
}

export function ImageUpload({ onImageUpload, label = "Adicionar Imagem" }: ImageUploadProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="space-y-2">
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="cursor-pointer"
      />
      <p className="text-sm text-gray-500">
        Formatos aceitos: JPG, PNG. Tamanho máximo: 5MB
      </p>
    </div>
  );
}

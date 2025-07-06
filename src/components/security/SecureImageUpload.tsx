
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { validateFileName, validateFileSize, validateImageType } from '@/utils/validation';
import { Upload, X } from 'lucide-react';

interface SecureImageUploadProps {
  onImageSelect: (file: File) => void;
  currentImageUrl?: string;
  onImageRemove?: () => void;
  maxSizeMB?: number;
  className?: string;
}

const SecureImageUpload: React.FC<SecureImageUploadProps> = ({
  onImageSelect,
  currentImageUrl,
  onImageRemove,
  maxSizeMB = 5,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    // Validate file name
    if (!validateFileName(file.name)) {
      toast({
        title: "Nome de arquivo inválido",
        description: "Use apenas letras, números, pontos, hífens e sublinhados.",
        variant: "destructive",
      });
      return false;
    }

    // Validate file size
    if (!validateFileSize(file, maxSizeMB)) {
      toast({
        title: "Arquivo muito grande",
        description: `O arquivo deve ter no máximo ${maxSizeMB}MB.`,
        variant: "destructive",
      });
      return false;
    }

    // Validate file type
    if (!validateImageType(file)) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Apenas imagens JPEG, PNG e WebP são permitidas.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      onImageSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>Imagem</Label>
      
      {currentImageUrl ? (
        <div className="relative inline-block">
          <img
            src={currentImageUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border"
          />
          {onImageRemove && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
              onClick={onImageRemove}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging 
              ? 'border-primary bg-primary/10' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Arraste uma imagem aqui ou clique para selecionar
            </p>
            <p className="text-xs text-gray-500">
              JPEG, PNG ou WebP. Máximo {maxSizeMB}MB.
            </p>
          </div>
          <Input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileInput}
            className="hidden"
            id="image-upload"
          />
          <Label
            htmlFor="image-upload"
            className="inline-block mt-2 cursor-pointer"
          >
            <Button type="button" variant="outline" size="sm">
              Selecionar Arquivo
            </Button>
          </Label>
        </div>
      )}
    </div>
  );
};

export default SecureImageUpload;

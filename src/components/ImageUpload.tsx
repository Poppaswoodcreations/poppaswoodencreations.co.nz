import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Check, AlertCircle } from 'lucide-react';
import { generateImageName } from '../utils/imageUtils';

// This is the client-side admin password gate — not a secret, checked
// again server-side in /api/admin-upload-image before any upload happens.
// Same constant/pattern used in src/hooks/useProducts.tsx.
const ADMIN_PASSWORD = 'Adrianbar1?';

interface UploadedImage {
  id: string;
  file: File;
  url: string;
  name: string;
  size: number;
  status: 'uploading' | 'success' | 'error';
  isSupabaseUrl: boolean;
  errorMessage?: string;
}

interface ImageUploadProps {
  onImagesUploaded: (images: { id: string; url: string }[]) => void;
  maxImages?: number;
  productName?: string;
}

// FIX (2 Sep 2026): this component used to convert every image to a
// base64 data: URL and hand THAT back as the "uploaded" url — it never
// actually uploaded anything. The dead giveaway was importing
// `uploadImageToSupabase` from ../lib/supabase, a function that never
// existed in the codebase. Every extra image added through the admin
// panel got its raw base64 (400KB-1MB+) saved directly into the
// product's `images` array in Supabase, which then blew up the Google
// Merchant Center feed ("Item too big") for any product it touched.
//
// Now: FileReader still gives an instant local preview (fast, no
// network round-trip needed just to show a thumbnail), but the actual
// value handed to onImagesUploaded only ever comes from a successful
// POST to /api/admin-upload-image, which uploads to Supabase Storage
// server-side and returns the real public URL.
const ImageUpload: React.FC<ImageUploadProps> = ({
  onImagesUploaded,
  maxImages = 5,
  productName = 'product'
}) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (images.length + imageFiles.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    console.log(`📸 Processing ${imageFiles.length} image files for upload`);

    const newImages: UploadedImage[] = imageFiles.map(file => ({
      id: `img-${Date.now()}-${Math.random()}`,
      file,
      url: '',
      name: generateImageName(file.name, productName),
      size: file.size,
      status: 'uploading' as const,
      isSupabaseUrl: false
    }));

    setImages(prev => [...prev, ...newImages]);

    // Process each image: local preview immediately, then real upload.
    for (const img of newImages) {
      try {
        console.log(`📸 Processing image: ${img.file.name}`);

        const reader = new FileReader();
        const dataUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = (event) => resolve(event.target?.result as string);
          reader.onerror = () => reject(new Error('Could not read file'));
          reader.readAsDataURL(img.file);
        });

        // Show the local preview right away while the real upload runs.
        setImages(prev => prev.map(prevImg =>
          prevImg.id === img.id ? { ...prevImg, url: dataUrl } : prevImg
        ));

        const res = await fetch('/api/admin-upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            password: ADMIN_PASSWORD,
            filename: img.name,
            dataUrl,
          }),
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data.success || !data.url) {
          throw new Error(data.error || `Upload failed (${res.status})`);
        }

        console.log(`✅ Uploaded to Supabase Storage: ${img.file.name} -> ${data.url}`);

        setImages(prev => prev.map(prevImg =>
          prevImg.id === img.id
            ? { ...prevImg, url: data.url, status: 'success' as const, isSupabaseUrl: true }
            : prevImg
        ));
      } catch (error) {
        console.error(`❌ Error uploading image ${img.file.name}:`, error);
        setImages(prev => prev.map(prevImg =>
          prevImg.id === img.id
            ? { ...prevImg, status: 'error' as const, errorMessage: (error as Error).message }
            : prevImg
        ));
      }
    }
  };

  const removeImage = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleUploadComplete = () => {
    // Only successfully-uploaded images (real Supabase Storage URLs) are
    // ever handed to the parent — nothing base64 leaves this component.
    const successfulImageData = images
      .filter(img => img.status === 'success' && img.isSupabaseUrl)
      .map(img => ({ id: img.id, url: img.url }));

    console.log(`📤 Handing off ${successfulImageData.length} uploaded image(s) to parent component`);

    onImagesUploaded(successfulImageData);
    setImages([]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-amber-500 bg-amber-50'
            : 'border-gray-300 hover:border-amber-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-3">
          <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <Upload className="text-amber-600" size={24} />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload Product Images
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your images here, or click to browse
            </p>

            <label className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors cursor-pointer">
              <ImageIcon size={16} className="mr-2" />
              Choose Images
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                multiple
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          </div>

          <div className="text-xs text-gray-500">
            Supported formats: JPG, PNG, WebP, GIF (max {maxImages} images)
          </div>
        </div>
      </div>

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Uploaded Images ({images.length})</h4>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative border rounded-lg p-2">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                  {image.url ? (
                    <img
                      src={image.url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-900 truncate">{image.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(image.size)}</p>
                  {image.isSupabaseUrl && (
                    <p className="text-xs text-green-600">☁️ Cloud hosted</p>
                  )}
                  {image.status === 'error' && image.errorMessage && (
                    <p className="text-xs text-red-600" title={image.errorMessage}>Upload failed</p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {image.status === 'uploading' && (
                        <div className="w-3 h-3 border border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                      )}
                      {image.status === 'success' && (
                        <Check className="text-green-600" size={12} />
                      )}
                      {image.status === 'error' && (
                        <AlertCircle className="text-red-600" size={12} />
                      )}
                      <span className="text-xs text-gray-500 capitalize">{image.status}</span>
                    </div>

                    <button
                      onClick={() => removeImage(image.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {images.filter(img => img.status === 'success').length > 0 && (
            <button
              onClick={handleUploadComplete}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              ✅ Add to Product ({images.filter(img => img.status === 'success').length} ready)
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

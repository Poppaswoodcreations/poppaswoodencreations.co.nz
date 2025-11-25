/**
 * Image utilities for handling product images
 */

export interface ImageValidation {
  isValid: boolean;
  error?: string;
}

/**
 * Validate if an image URL is accessible
 */
export const validateImageUrl = async (url: string): Promise<ImageValidation> => {
  if (!url || url.trim() === '') {
    return { isValid: false, error: 'Empty URL' };
  }

  // Check if it's a data URL
  if (url.startsWith('data:image/')) {
    return { isValid: true };
  }

  // Check if it's a valid URL format
  try {
    new URL(url);
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }

  // Try to load the image
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ isValid: true });
    img.onerror = () => resolve({ isValid: false, error: 'Failed to load image' });
    img.src = url;
  });
};

/**
 * Get fallback image URL
 */
export const getFallbackImage = (): string => {
  return 'https://i.ibb.co/dw3x0Kmm/image.jpg'; // Updated fallback image
};

/**
 * Process and validate product images
 */
export const processProductImages = async (images: string[]): Promise<string[]> => {
  if (!images || images.length === 0) {
    return ['https://i.ibb.co/FkkjBShk/image.jpg'];
  }

  const validImages: string[] = [];
  
  for (const image of images) {
    if (image && image.trim() !== '') {
      const validation = await validateImageUrl(image);
      if (validation.isValid) {
        validImages.push(image);
      }
    }
  }

  // If no valid images found, use fallback
  if (validImages.length === 0) {
    validImages.push('https://i.ibb.co/FkkjBShk/image.jpg');
  }

  return validImages;
};

/**
 * Convert file to data URL
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      resolve(result);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Compress image to reduce file size
 */
export const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      
      resolve(compressedDataUrl);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Generate optimized image name
 */
export const generateImageName = (originalName: string, productName: string): string => {
  const cleanProductName = productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  const extension = originalName.split('.').pop() || 'jpg';
  const timestamp = Date.now();
  
  return `${cleanProductName}-${timestamp}.${extension}`;
};
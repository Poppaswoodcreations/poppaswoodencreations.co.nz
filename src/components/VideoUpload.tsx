import React, { useState, useRef } from 'react';
import { Upload, X, Video as VideoIcon, Check, AlertCircle } from 'lucide-react';

// Client-side admin password gate — not a secret, checked again
// server-side in /api/admin-upload-video before any upload happens.
// Same constant/pattern used in ImageUpload.tsx and useProducts.tsx.
const ADMIN_PASSWORD = 'Adrianbar1?';

const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15MB
const ALLOWED_TYPES = ['video/mp4', 'video/webm'];

interface UploadedVideo {
  id: string;
  file: File;
  previewUrl: string;
  uploadedUrl: string;
  name: string;
  size: number;
  status: 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

interface VideoUploadProps {
  onVideoUploaded: (video: { id: string; url: string }) => void;
  productName?: string;
}

const generateVideoName = (originalName: string, productName: string): string => {
  const ext = originalName.split('.').pop() || 'mp4';
  const safeProduct = productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'product';
  return `${safeProduct}-${Date.now()}.${ext}`;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// One video per product (turntable/angle clip). Local preview shown
// instantly via FileReader; the value handed to onVideoUploaded only
// ever comes from a successful POST to /api/admin-upload-video, which
// uploads to the Supabase Storage "product-videos" bucket server-side
// and returns the real public URL.
const VideoUpload: React.FC<VideoUploadProps> = ({
  onVideoUploaded,
  productName = 'product'
}) => {
  const [video, setVideo] = useState<UploadedVideo | null>(null);
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
    if (files[0]) handleFile(files[0]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files[0]) handleFile(files[0]);
  };

  const handleFile = async (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('Only mp4 or webm files are allowed');
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      alert('File is too large. Please compress under 15MB.');
      return;
    }

    const newVideo: UploadedVideo = {
      id: `vid-${Date.now()}-${Math.random()}`,
      file,
      previewUrl: '',
      uploadedUrl: '',
      name: generateVideoName(file.name, productName),
      size: file.size,
      status: 'uploading'
    };

    setVideo(newVideo);

    try {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.onerror = () => reject(new Error('Could not read file'));
        reader.readAsDataURL(file);
      });

      // Show local preview immediately while the real upload runs.
      setVideo(prev => prev ? { ...prev, previewUrl: dataUrl } : prev);

      const res = await fetch('/api/admin-upload-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: ADMIN_PASSWORD,
          filename: newVideo.name,
          dataUrl,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success || !data.url) {
        throw new Error(data.error || `Upload failed (${res.status})`);
      }

      setVideo(prev => prev ? { ...prev, uploadedUrl: data.url, status: 'success' } : prev);
    } catch (error) {
      setVideo(prev => prev ? { ...prev, status: 'error', errorMessage: (error as Error).message } : prev);
    }
  };

  const removeVideo = () => {
    setVideo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddToProduct = () => {
    if (!video || video.status !== 'success' || !video.uploadedUrl) return;
    onVideoUploaded({ id: video.id, url: video.uploadedUrl });
    setVideo(null);
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
              Upload Product Video
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop a turntable/angle video here, or click to browse
            </p>

            <label className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors cursor-pointer">
              <VideoIcon size={16} className="mr-2" />
              Choose Video
              <input
                type="file"
                accept="video/mp4,video/webm"
                ref={fileInputRef}
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          </div>

          <div className="text-xs text-gray-500">
            Supported formats: MP4, WebM (max 15MB, one video per product)
          </div>
        </div>
      </div>

      {/* Video Preview */}
      {video && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Video</h4>

          <div className="relative border rounded-lg p-2 max-w-sm">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
              {video.previewUrl ? (
                <video
                  src={video.previewUrl}
                  muted
                  loop
                  autoPlay
                  playsInline
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-900 truncate">{video.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(video.size)}</p>
              {video.status === 'success' && (
                <p className="text-xs text-green-600">☁️ Cloud hosted</p>
              )}
              {video.status === 'error' && video.errorMessage && (
                <p className="text-xs text-red-600" title={video.errorMessage}>Upload failed</p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {video.status === 'uploading' && (
                    <div className="w-3 h-3 border border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {video.status === 'success' && (
                    <Check className="text-green-600" size={12} />
                  )}
                  {video.status === 'error' && (
                    <AlertCircle className="text-red-600" size={12} />
                  )}
                  <span className="text-xs text-gray-500 capitalize">{video.status}</span>
                </div>

                <button
                  onClick={removeVideo}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          </div>

          {video.status === 'success' && (
            <button
              onClick={handleAddToProduct}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              ✅ Add Video to Product
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoUpload;

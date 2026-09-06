// src/components/VideoUpload.tsx
// Admin component for uploading a product turntable/angle video.
// Mirrors ImageUpload.tsx but posts to /api/admin-upload-video and
// calls onVideoUploaded(url) with the resulting public Supabase URL.

import React, { useState } from 'react';

interface VideoUploadProps {
  productId: string;
  currentVideoUrl?: string | null;
  onVideoUploaded: (url: string) => void;
  onVideoRemoved?: () => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({
  productId,
  currentVideoUrl,
  onVideoUploaded,
  onVideoRemoved,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressLabel, setProgressLabel] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!['video/mp4', 'video/webm'].includes(file.type)) {
      setError('Only mp4 or webm files are allowed.');
      return;
    }

    const MAX_SIZE_MB = 15;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File is too large. Please compress under ${MAX_SIZE_MB}MB.`);
      return;
    }

    setUploading(true);
    setProgressLabel('Uploading video...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', productId);

      const response = await fetch('/api/admin-upload-video', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Upload failed');
      }

      onVideoUploaded(data.url);
      setProgressLabel('Upload complete.');
    } catch (err: any) {
      setError(err.message || 'Failed to upload video.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="video-upload">
      <label className="block text-sm font-medium mb-2">
        Product Turntable / Angle Video (mp4)
      </label>

      {currentVideoUrl && (
        <div className="mb-3">
          <video
            src={currentVideoUrl}
            muted
            loop
            autoPlay
            playsInline
            controls
            className="w-full max-w-sm rounded-md border"
          />
          {onVideoRemoved && (
            <button
              type="button"
              onClick={onVideoRemoved}
              className="mt-2 text-sm text-red-600 hover:underline"
            >
              Remove video
            </button>
          )}
        </div>
      )}

      <input
        type="file"
        accept="video/mp4,video/webm"
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm"
      />

      {uploading && <p className="text-sm text-gray-500 mt-1">{progressLabel}</p>}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default VideoUpload;

'use client';

import { useState } from 'react';
import { Upload, X, ImageIcon, Video } from 'lucide-react';
import Image from 'next/image';

interface UploadedMedia {
  id: string;
  url: string;
  file: File;
  type: 'image' | 'video';
}

export default function UploadEventMedia() {
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const mediaFiles = files.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    const newMedia: UploadedMedia[] = mediaFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file,
      type: file.type.startsWith('image/') ? 'image' : 'video' as const
    }));

    setUploadedMedia(prev => {
      // If there's a new video, remove any existing video
      const existingVideo = prev.find(m => m.type === 'video');
      if (existingVideo) {
        URL.revokeObjectURL(existingVideo.url);
      }
      
      const filteredPrev = prev.filter(m => m.type === 'image');
      const newVideos = newMedia.filter(m => m.type === 'video');
      const newImages = newMedia.filter(m => m.type === 'image');
      
      // Only take the first video if multiple are uploaded
      return [...filteredPrev, ...newImages, ...(newVideos.slice(0, 1))];
    });
  };

  const removeMedia = (id: string) => {
    setUploadedMedia(prev => {
      const filtered = prev.filter(media => media.id !== id);
      const removedMedia = prev.find(media => media.id === id);
      if (removedMedia) {
        URL.revokeObjectURL(removedMedia.url);
      }
      return filtered;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Event Media</h3>
          <p className="text-xs text-gray-500 mt-1">
            Add high-quality images and videos to showcase your event. First image will be used as cover.
          </p>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900">Images</h4>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primaryColor text-white 
              rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <ImageIcon className="w-4 h-4" />
            Add Images
          </button>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragging ? 'border-primaryColor bg-indigo-50' : 'border-gray-200'}`}
        >
          <div className="flex flex-col items-center">
            <Upload className="h-10 w-10 text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop your images here, or{' '}
              <label className="text-primaryColor hover:text-indigo-700 cursor-pointer">
                browse
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </p>
            <p className="text-xs text-gray-500">
              Maximum 5MB | Supported formats: JPEG, PNG
            </p>
          </div>
        </div>
      </div>

      {/* Video Upload Section */}
      <div className="space-y-4 mt-8">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900">Video</h4>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primaryColor text-white 
              rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            onClick={() => document.getElementById('video-upload')?.click()}
          >
            <Video className="w-4 h-4" />
            Add Video
          </button>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragging ? 'border-primaryColor bg-indigo-50' : 'border-gray-200'}`}
        >
          <div className="flex flex-col items-center">
            <Upload className="h-10 w-10 text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop your video here, or{' '}
              <label className="text-primaryColor hover:text-indigo-700 cursor-pointer">
                browse
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </p>
            <p className="text-xs text-gray-500">
              Maximum 100MB | Supported formats: MP4, WebM
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Media Display */}
      {uploadedMedia.length > 0 && (
        <div className="space-y-4 mt-8">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">Uploaded Media</h4>
            <p className="text-xs text-gray-500">
              {uploadedMedia.filter(m => m.type === 'image').length} images, 
              {uploadedMedia.filter(m => m.type === 'video').length} video
            </p>
          </div>
          
          {/* Video Preview */}
          {uploadedMedia.find(m => m.type === 'video') && (
            <div className="mb-6">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Video Preview</h5>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                <video
                  src={uploadedMedia.find(m => m.type === 'video')?.url}
                  className="w-full h-full object-contain"
                  controls
                />
                <button
                  onClick={() => removeMedia(uploadedMedia.find(m => m.type === 'video')?.id || '')}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full 
                    shadow-sm hover:bg-white transition-colors"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
          )}

          {/* Images Grid */}
          {uploadedMedia.some(m => m.type === 'image') && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Images</h5>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {uploadedMedia
                  .filter(media => media.type === 'image')
                  .map((media) => (
                    <div key={media.id} className="relative group">
                      <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={media.url}
                          alt="Event media"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        onClick={() => removeMedia(media.id)}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full 
                          shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4 text-gray-600" />
                      </button>
                      {uploadedMedia[0].id === media.id && (
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 rounded-md 
                          text-xs font-medium text-gray-700">
                          Cover Image
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

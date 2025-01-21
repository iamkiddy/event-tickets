'use client';

import { useState } from 'react';
import { Upload, X, ImageIcon, Video, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { updateEventImage } from '@/lib/actions/events';
import { updateEventVideo } from '@/lib/actions/events';

interface UploadedMedia {
  id: string;
  url: string;
  file: File;
  type: 'image' | 'video';
  progress?: number;
}

export default function UploadEventMedia() {
  const params = useParams();
  const router = useRouter();
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
    
    const invalidFiles = mediaFiles.filter(file => {
      if (file.type.startsWith('image/')) return file.size > 5 * 1024 * 1024; // 5MB
      return file.size > 100 * 1024 * 1024; // 100MB
    });

    if (invalidFiles.length > 0) {
      toast.error('Some files exceed the size limit');
      return;
    }

    // Check if trying to add multiple videos
    const newVideos = mediaFiles.filter(file => file.type.startsWith('video/'));
    if (newVideos.length > 1) {
      toast.error('Only one video can be uploaded');
      return;
    }

    const newMedia: UploadedMedia[] = mediaFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      progress: 0
    }));

    setUploadedMedia(prev => {
      // If there's already a video, prevent adding another
      const existingVideo = prev.find(m => m.type === 'video');
      if (existingVideo && newVideos.length > 0) {
        toast.error('A video has already been added');
        return prev;
      }
      
      const filteredPrev = prev.filter(m => m.type === 'image');
      const newImages = newMedia.filter(m => m.type === 'image');
      const newVideo = newMedia.find(m => m.type === 'video');
      
      return [...filteredPrev, ...newImages, ...(newVideo ? [newVideo] : [])];
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

  // Handle file upload to server
  const uploadMediaToServer = async (media: UploadedMedia) => {
    try {
      // Create a new Blob from the file to ensure proper binary handling
      const fileBlob = new Blob([media.file], { type: media.file.type });
      
      // Create a new File instance from the Blob
      const cleanFile = new File([fileBlob], media.file.name, { 
        type: media.file.type,
        lastModified: media.file.lastModified 
      });

      // Use the appropriate update function based on media type
      const response = media.type === 'image' 
        ? await updateEventImage(params.id as string, cleanFile)
        : await updateEventVideo(params.id as string, cleanFile);

      // Update progress to complete
      setUploadedMedia(prev => 
        prev.map(m => m.id === media.id ? { ...m, progress: 100 } : m)
      );

      return response;
    } catch (error) {
      console.error(`Error uploading ${media.type}:`, error);
      throw error;
    }
  };

  // Handle the main upload process
  const handleUpload = async () => {
    if (uploadedMedia.length === 0) {
      toast.error('Please add some media files first');
      return;
    }

    setIsUploading(true);

    try {
      // Upload images first
      const images = uploadedMedia.filter(m => m.type === 'image');
      for (const image of images) {
        await uploadMediaToServer(image);
      }

      // Upload video if exists
      const video = uploadedMedia.find(m => m.type === 'video');
      if (video) {
        await uploadMediaToServer(video);
      }

      toast.success('Media uploaded successfully');
      setIsSuccess(true);
      // Clear the uploaded media after successful upload
      setUploadedMedia([]);
    } catch (error) {
      toast.error('Failed to upload media');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 md:py-8 px-2 sm:px-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Upload Event Media</h1>
          <div className="text-xs sm:text-sm text-gray-500">
            {uploadedMedia.filter(m => m.type === 'image').length} images, 
            {uploadedMedia.filter(m => m.type === 'video').length} video
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
            <h4 className="text-sm font-medium text-gray-900">Images</h4>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-primaryColor text-white 
                rounded-lg hover:bg-indigo-700 transition-colors text-xs sm:text-sm font-medium w-full sm:w-auto"
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              Add Images
            </button>
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg transition-colors relative overflow-hidden
              ${isDragging ? 'border-primaryColor bg-indigo-50' : 'border-gray-200'}`}
          >
            {uploadedMedia.some(m => m.type === 'image') ? (
              <div className="p-4">
                <div className="grid grid-cols-1 gap-6">
                  {uploadedMedia
                    .filter(media => media.type === 'image')
                    .map((media) => (
                      <div key={media.id} className="relative group">
                        <div className="rounded-lg overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-shadow">
                          <div className="relative" style={{ height: '400px' }}>
                            <Image
                              src={media.url}
                              alt="Event media"
                              fill
                              className="object-contain"
                              sizes="(max-width: 768px) 100vw, 800px"
                              quality={90}
                            />
                          </div>
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <button
                          onClick={() => removeMedia(media.id)}
                          className="absolute top-4 right-4 p-2 bg-white/90 rounded-full 
                            shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 
                            hover:bg-red-50 hover:text-red-500"
                        >
                          <X className="h-5 w-5" />
                        </button>
                        {uploadedMedia[0].id === media.id && (
                          <div className="absolute top-4 left-4 px-4 py-2 bg-white/90 rounded-md 
                            text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm">
                            <span className="flex items-center gap-2">
                              <ImageIcon className="w-4 h-4" />
                              Cover Image
                            </span>
                          </div>
                        )}
                        <div className="absolute bottom-4 left-4 px-4 py-2 bg-white/90 rounded-md 
                          text-sm text-gray-600 shadow-sm backdrop-blur-sm">
                          {media.file.name} ({Math.round(media.file.size / 1024)}KB)
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="p-8">
                <div className="flex flex-col items-center">
                  <Upload className="h-12 w-12 text-gray-400 mb-3" />
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
            )}
          </div>
        </div>

        {/* Video Upload Section */}
        <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
            <h4 className="text-sm font-medium text-gray-900">Video</h4>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-primaryColor text-white 
                rounded-lg hover:bg-indigo-700 transition-colors text-xs sm:text-sm font-medium w-full sm:w-auto"
              onClick={() => document.getElementById('video-upload')?.click()}
            >
              <Video className="w-3 h-3 sm:w-4 sm:h-4" />
              Add Video
            </button>
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg transition-colors relative overflow-hidden
              ${isDragging ? 'border-primaryColor bg-indigo-50' : 'border-gray-200'}`}
          >
            {uploadedMedia.find(m => m.type === 'video') ? (
              <div className="p-4">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 shadow-sm group">
                  <video
                    src={uploadedMedia.find(m => m.type === 'video')?.url}
                    className="w-full h-full object-contain"
                    controls
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button
                    onClick={() => removeMedia(uploadedMedia.find(m => m.type === 'video')?.id || '')}
                    className="absolute top-2 right-2 p-2 bg-white/90 rounded-full 
                      shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200
                      hover:bg-red-50 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-3 py-1.5 bg-white/90 rounded-md 
                    text-xs font-medium text-gray-700 shadow-sm backdrop-blur-sm">
                    <span className="flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      Event Video
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8">
                <div className="flex flex-col items-center">
                  <Upload className="h-12 w-12 text-gray-400 mb-3" />
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
            )}
          </div>
        </div>

        {/* Uploaded Media Display */}
        {uploadedMedia.length > 0 && (
          <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
              <h4 className="text-sm font-medium text-gray-900">Uploaded Media</h4>
              <p className="text-xs sm:text-sm text-gray-500">
                {uploadedMedia.filter(m => m.type === 'image').length} images, 
                {uploadedMedia.filter(m => m.type === 'video').length} video
              </p>
            </div>
            
            {/* Images Grid */}
            {uploadedMedia.some(m => m.type === 'image') && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Images</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
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
                          <X className="h-3 sm:h-4 sm:w-4 text-gray-600" />
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

        {/* Upload Progress and Actions */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
          {isSuccess ? (
            <Button
              onClick={() => router.push(`/events/${params.id}/edit`)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 sm:px-6 w-full sm:w-auto"
            >
              Skip & Continue
              </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={() => router.push(`/events/${params.id}/edit`)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 sm:px-6 w-full sm:w-auto"
            >
              Skip & Continue
            </Button>
          )}
          {!isSuccess && (
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={isUploading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="bg-primaryColor hover:bg-indigo-700 text-white w-full sm:w-auto"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload Media'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

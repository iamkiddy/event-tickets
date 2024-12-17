'use client';

import { useState, useEffect } from 'react';
import { File, Trash2, Download, Loader2, Video, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getEventFiles, deleteEventImage, deleteEventVideo } from '@/lib/actions/events';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface FileListProps {
  eventId: string;
}

interface DisplayFile {
  id: string;
  url: string;
  type: 'image' | 'video';
  isPrimary: boolean;
}

export function FileList({ eventId }: FileListProps) {
  const router = useRouter();
  const [files, setFiles] = useState<DisplayFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEventFiles();
  }, [eventId]);

  const handleUploadClick = () => {
    router.push(`/events/${eventId}/upload`);
  };

  const fetchEventFiles = async () => {
    try {
      const response = await getEventFiles(eventId);
      // Combine images and video into a single array for display
      const allFiles = [
        ...response.images.map(img => ({
          id: img.id,
          url: img.url,
          type: 'image' as const,
          isPrimary: img.isPrimary
        })),
        ...(response.video ? [{
          id: response.video.id,
          url: response.video.url,
          type: 'video' as const,
          isPrimary: false
        }] : [])
      ];
      setFiles(allFiles);
    } catch (error) {
      toast.error('Failed to load event files');
      console.error('Error fetching files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to download file');
    }
  };

  const handleDelete = async (fileId: string, fileType: 'image' | 'video') => {
    try {
      if (fileType === 'image') {
        await deleteEventImage(eventId, fileId);
      } else {
        await deleteEventVideo(eventId, fileId);
      }
      
      setFiles(prev => prev.filter(file => file.id !== fileId));
      toast.success(`${fileType === 'image' ? 'Image' : 'Video'} deleted successfully`);
    } catch (error) {
      toast.error(`Failed to delete ${fileType}`);
      console.error('Error deleting file:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center p-8">
        <File className="h-12 w-12 mx-auto text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-900">No files uploaded</h3>
        <p className="text-sm text-gray-500 mt-1">
          Upload files to make them available for event attendees
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button 
          onClick={handleUploadClick}
          className="flex items-center gap-2 bg-primaryColor hover:bg-indigo-700 text-white"
        >
          <Plus className="w-4 h-4" />
          Add Media
        </Button>
      </div>

      <div className="space-y-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
          >
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                {file.type === 'image' ? (
                  <Image
                    src={file.url}
                    alt="Event image"
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Video className="h-8 w-8 text-purple-400" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {file.type === 'image' ? 'Image' : 'Video'}
                  </span>
                  {file.isPrimary && (
                    <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                      Primary
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {new URL(file.url).pathname.split('/').pop()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDownload(file.url, file.type)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDelete(file.id, file.type)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
// src/components/profile/AvatarUpload.tsx
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { 
  Camera, 
  Upload, 
  X, 
  Crop,
  RotateCw,
  Save,
  Trash2,
  User,
  AlertCircle,
  CheckCircle,
  Loader2,
  ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface AvatarUploadProps {
  currentAvatar?: string;
  userName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onUpload: (file: File, preview: string) => Promise<void>;
  onRemove?: () => Promise<void>;
  className?: string;
  editable?: boolean;
}

interface CropSettings {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export default function AvatarUpload({
  currentAvatar,
  userName = 'User',
  size = 'lg',
  onUpload,
  onRemove,
  className = '',
  editable = true
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cropSettings, setCropSettings] = useState<CropSettings>({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    rotation: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Size configurations
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  const buttonSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  // Get user initials for fallback
  const getInitials = useCallback(() => {
    return userName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [userName]);

  // Validate file
  const validateFile = (file: File): string | null => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a valid image file (JPEG, PNG, or WebP)';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }

    return null;
  };

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    const error = validateFile(file);
    if (error) {
      setError(error);
      return;
    }

    setError(null);
    setSelectedFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  }, []);

  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  // Crop image
  const cropImage = useCallback((imageSrc: string, crop: CropSettings): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) return resolve(imageSrc);

      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(imageSrc);

      const image = new Image();
      image.onload = () => {
        const size = 400; // Output size
        canvas.width = size;
        canvas.height = size;

        // Clear canvas
        ctx.clearRect(0, 0, size, size);

        // Apply rotation
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.rotate((crop.rotation * Math.PI) / 180);

        // Calculate crop dimensions
        const cropX = (crop.x / 100) * image.width;
        const cropY = (crop.y / 100) * image.height;
        const cropWidth = (crop.width / 100) * image.width;
        const cropHeight = (crop.height / 100) * image.height;

        // Draw cropped image
        ctx.drawImage(
          image,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          -size / 2,
          -size / 2,
          size,
          size
        );

        ctx.restore();

        // Convert to blob
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve(url);
          } else {
            resolve(imageSrc);
          }
        }, 'image/jpeg', 0.9);
      };
      image.src = imageSrc;
    });
  }, []);

  // Handle crop and upload
  const handleCropAndUpload = useCallback(async () => {
    if (!selectedFile || !preview) return;

    setIsUploading(true);
    setError(null);

    try {
      const croppedImageUrl = await cropImage(preview, cropSettings);
      
      // Convert cropped image back to file
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      const croppedFile = new File([blob], `avatar-${Date.now()}.jpg`, {
        type: 'image/jpeg'
      });

      await onUpload(croppedFile, croppedImageUrl);
      setPreview(croppedImageUrl);
      setShowCropModal(false);
    } catch (err) {
      setError('Failed to upload avatar. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, preview, cropSettings, onUpload, cropImage]);

  // Handle remove avatar
  const handleRemove = useCallback(async () => {
    if (!onRemove) return;

    setIsUploading(true);
    try {
      await onRemove();
      setPreview(null);
    } catch (err) {
      setError('Failed to remove avatar. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [onRemove]);

  // Rotate image
  const handleRotate = useCallback(() => {
    setCropSettings(prev => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360
    }));
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Avatar Display */}
      <div className="relative group">
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold overflow-hidden border-4 border-white shadow-lg ${
            dragOver ? 'ring-4 ring-indigo-300' : ''
          } ${editable ? 'cursor-pointer' : ''}`}
          onDrop={editable ? handleDrop : undefined}
          onDragOver={editable ? handleDragOver : undefined}
          onDragLeave={editable ? handleDragLeave : undefined}
          onClick={editable ? () => fileInputRef.current?.click() : undefined}
        >
          {preview ? (
            <img 
              src={preview} 
              alt="Avatar" 
              className="w-full h-full object-cover" 
            />
          ) : (
            <span className={`${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : size === 'lg' ? 'text-2xl' : 'text-3xl'}`}>
              {getInitials()}
            </span>
          )}
          
          {/* Overlay on hover */}
          {editable && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full">
              <Camera className="h-6 w-6 text-white" />
            </div>
          )}
        </div>

        {/* Edit/Remove Buttons */}
        {editable && (
          <div className="absolute -bottom-2 -right-2 flex space-x-1">
            <Button
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className={`${buttonSizes[size]} rounded-full p-0 bg-indigo-600 hover:bg-indigo-700 shadow-lg`}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Camera className="h-3 w-3" />
              )}
            </Button>
            
            {(preview || currentAvatar) && onRemove && (
              <Button
                size="sm"
                onClick={handleRemove}
                className={`${buttonSizes[size]} rounded-full p-0 bg-red-600 hover:bg-red-700 shadow-lg`}
                disabled={isUploading}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Drag and Drop Area (when no avatar) */}
      {editable && !preview && (
        <div className="mt-4">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragOver
                ? 'border-indigo-400 bg-indigo-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="text-sm text-gray-600 mb-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Click to upload
              </button>{' '}
              or drag and drop
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, WebP up to 5MB
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Crop Modal */}
      {showCropModal && preview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="bg-white p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Crop Avatar</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCropModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Image Preview */}
            <div className="mb-6">
              <div className="relative mx-auto w-64 h-64 border border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  style={{
                    transform: `rotate(${cropSettings.rotation}deg)`,
                    transformOrigin: 'center'
                  }}
                />
                {/* Crop overlay could be added here */}
              </div>
            </div>

            {/* Crop Controls */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rotation
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="90"
                    value={cropSettings.rotation}
                    onChange={(e) => setCropSettings(prev => ({
                      ...prev,
                      rotation: parseInt(e.target.value)
                    }))}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRotate}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCropModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCropAndUpload}
                disabled={isUploading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Avatar
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
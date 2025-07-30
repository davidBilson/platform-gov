import React, { useState, useRef, useCallback, ChangeEvent } from "react";
import { IoMdImages } from "react-icons/io";
import { MdEdit, MdClose, MdCheck, MdRemoveRedEye } from "react-icons/md";

interface Position {
  x: number;
  y: number;
}

interface CropperProps {
  imageUrl: string;
  onSave: (croppedImageUrl: string) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<CropperProps> = ({ imageUrl, onSave, onCancel }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Add boundaries to prevent dragging too far
    const maxOffset = 100 * zoom;
    setPosition({
      x: Math.max(-maxOffset, Math.min(maxOffset, newX)),
      y: Math.max(-maxOffset, Math.min(maxOffset, newY))
    });
  }, [isDragging, dragStart, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleSave = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    
    if (!canvas || !image) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to desired output (300x300 for high quality)
    canvas.width = 300;
    canvas.height = 300;

    // Calculate the crop area
    const cropSize = 200; // Size of the visible crop area
    const scale = 300 / cropSize; // Scale factor for high resolution output
    
    // Clear canvas
    ctx.clearRect(0, 0, 300, 300);
    
    // Create circular clipping path
    ctx.beginPath();
    ctx.arc(150, 150, 150, 0, 2 * Math.PI);
    ctx.clip();
    
    // Calculate source dimensions
    const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
    const sourceX = (image.naturalWidth - sourceSize) / 2;
    const sourceY = (image.naturalHeight - sourceSize) / 2;
    
    // Calculate destination dimensions with zoom and position
    const destSize = sourceSize * zoom * scale;
    const destX = 150 - destSize / 2 + (position.x * scale);
    const destY = 150 - destSize / 2 + (position.y * scale);
    
    // Draw the image
    ctx.drawImage(
      image,
      sourceX, sourceY, sourceSize, sourceSize,
      destX, destY, destSize, destSize
    );
    
    // Convert to blob and create URL
    canvas.toBlob((blob) => {
      if (blob) {
        const croppedUrl = URL.createObjectURL(blob);
        onSave(croppedUrl);
      }
    }, 'image/jpeg', 0.95);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit Profile Photo</h3>
          <button onClick={onCancel} className="cursor-pointer p-2 hover:bg-gray-100 rounded">
            <MdClose size={20} />
          </button>
        </div>
        
        {/* Crop Area */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4" style={{ height: '300px' }}>
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-move"
            onMouseDown={handleMouseDown}
            style={{ userSelect: 'none' }}
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Crop preview"
              className="max-w-none select-none"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transformOrigin: 'center center'
              }}
              draggable={false}
            />
          </div>
          
          {/* Circular Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <svg width="100%" height="100%" className="absolute inset-0">
              <defs>
                <mask id="circleMask">
                  <rect width="100%" height="100%" fill="black" />
                  <circle cx="50%" cy="50%" r="100" fill="white" />
                </mask>
              </defs>
              <rect 
                width="100%" 
                height="100%" 
                fill="rgba(0,0,0,0.5)" 
                mask="url(#circleMask)" 
              />
            </svg>
            {/* Circle border */}
            <div 
              className="absolute border-2 border-white rounded-full"
              style={{
                width: '200px',
                height: '200px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          </div>
        </div>
        
        {/* Zoom Control */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Zoom</label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.5x</span>
            <span>3x</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="cursor-pointer flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="cursor-pointer flex-1 px-4 py-2 bg-boldblue text-white rounded-md hover:bg-boldblue/70 transition-colors flex items-center justify-center gap-2"
          >
            <MdCheck size={16} />
            Save
          </button>
        </div>
        
        {/* Hidden canvas for cropping */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

interface ProfileImageUploadProps {
  profileImageUrl: string;
  handleProfileImageClick: () => void;
  handleProfileImageChange: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  profileImageUrl,
  handleProfileImageClick,
  handleProfileImageChange,
  fileInputRef,
}) => {
  const [showCropper, setShowCropper] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string>('');
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Override the handleProfileImageChange to intercept and show cropper
  const handleImageSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Store original file and create temp URL for cropper
    setOriginalFile(file);
    const url = URL.createObjectURL(file);
    setTempImageUrl(url);
    setShowCropper(true);
    setShowDropdown(false); // Close dropdown when cropper opens
  };

  const handleCropSave = async (croppedImageUrl: string) => {
    // Convert cropped image URL to File object
    try {
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      const croppedFile = new File([blob], originalFile?.name || 'profile.jpg', {
        type: blob.type || 'image/jpeg'
      });

      // Create a properly typed FileList-like object
      const fileList = {
        0: croppedFile,
        length: 1,
        item: (index: number) => index === 0 ? croppedFile : null,
        [Symbol.iterator]: function* () {
          yield croppedFile;
        }
      } as FileList;

      // Create a synthetic event with proper typing
      const syntheticEvent = {
        target: {
          ...fileInputRef.current,
          files: fileList
        },
        currentTarget: fileInputRef.current,
        nativeEvent: new Event('change'),
        bubbles: true,
        cancelable: true,
        defaultPrevented: false,
        eventPhase: 2,
        isTrusted: false,
        preventDefault: () => {},
        isDefaultPrevented: () => false,
        stopPropagation: () => {},
        isPropagationStopped: () => false,
        persist: () => {},
        timeStamp: Date.now(),
        type: 'change'
      } as ChangeEvent<HTMLInputElement>;

      // Call the original handler with cropped file
      await handleProfileImageChange(syntheticEvent);
      
      setShowCropper(false);
      // Clean up temp URL
      if (tempImageUrl) {
        URL.revokeObjectURL(tempImageUrl);
        setTempImageUrl('');
      }
      URL.revokeObjectURL(croppedImageUrl);
      setOriginalFile(null);
    } catch (error) {
      console.error('Error processing cropped image:', error);
    }
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    // Clean up temp URL
    if (tempImageUrl) {
      URL.revokeObjectURL(tempImageUrl);
      setTempImageUrl('');
    }
    setOriginalFile(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEditClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handlePreviewClick = () => {
    if (profileImageUrl) {
      // Open image in a new tab for preview
      window.open(profileImageUrl, '_blank');
    }
    setShowDropdown(false);
  };

  const handleEditImageClick = () => {
    handleProfileImageClick();
    setShowDropdown(false);
  };

  return (
    <>
      <div className="relative w-22 h-22 bg-gray-300 border border-boldblue rounded-full flex items-center justify-center mx-auto sm:mx-0">
        <div className="w-[88px] rounded-full h-[88px] overflow-hidden absolute flex items-center justify-center">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <IoMdImages size={40} className="text-white/70" />
          )}
        </div>
        
        <div className="absolute bottom-0 right-0 z-20" ref={dropdownRef}>
          <button
            type="button"
            onClick={handleEditClick}
            className="cursor-pointer h-7 w-7 bg-white rounded-full flex items-center justify-center border border-boldblue hover:bg-gray-50 transition-colors"
          >
            <MdEdit size={14} className="text-boldblue" />
          </button>
          
          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute -bottom-20 -right-25 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px] z-30">
              {profileImageUrl && (
                <button
                  onClick={handlePreviewClick}
                  className="cursor-pointer w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <MdRemoveRedEye size={16} />
                  Preview
                </button>
              )}
              <button
                onClick={handleEditImageClick}
                className="cursor-pointer w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <MdEdit size={16} />
                Edit
              </button>
            </div>
          )}
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/*"
          className="hidden"
        />
      </div>

      {showCropper && (
        <ImageCropper
          imageUrl={tempImageUrl}
          onSave={handleCropSave}
          onCancel={handleCropCancel}
        />
      )}
    </>
  );
};

// Example usage component showing how it integrates with your existing code
export default function App() {
  const [formData, setFormData] = useState({ profileImageUrl: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfileImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Your existing image upload logic here
    const url = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, profileImageUrl: url }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Profile Setup</h2>
        <ProfileImageUpload
          profileImageUrl={formData.profileImageUrl}
          handleProfileImageClick={handleProfileImageClick}
          handleProfileImageChange={handleProfileImageChange}
          fileInputRef={fileInputRef}
        />
        <p className="text-center text-gray-600 mt-4 text-sm">
          Click the edit button to see the dropdown menu with Preview and Edit options
        </p>
      </div>
    </div>
  );
}
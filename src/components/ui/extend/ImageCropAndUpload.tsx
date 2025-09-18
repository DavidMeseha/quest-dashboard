import { getCroppedImg } from '@/lib/image-processing';
import { uploadImage } from '@/services/user-api/upload.service';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { Button } from '../button';
import SubmitButton from '../submit-button';
import ErrorMessage from '../error-message';
import type { FieldError } from '@/schemas/types';

type Props = {
  onSuccess: (image: string) => void;
  imageSrc: string;
  onCancel: () => void;
  aspectRatio?: number;
};

export default function ImageCropAndUpload({ onSuccess, imageSrc, onCancel }: Props) {
  const [imageError, setImageError] = useState<FieldError>();
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const uploadImageMutation = useMutation({
    mutationKey: ['upload'],
    mutationFn: (formData: FormData) => uploadImage(formData),
    onSuccess: (data) => onSuccess(data.imageUrl),
    onError: () => setImageError('Faild to upload image')
  });

  const handleCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const data = new FormData();
      data.append('image', croppedBlob);
      uploadImageMutation.mutate(data);
    } catch {
      setImageError('Faild to process image');
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative h-96 w-full bg-black">
        <Cropper
          aspect={1}
          crop={crop}
          image={imageSrc}
          maxZoom={3}
          minZoom={1}
          zoom={zoom}
          onCropChange={setCrop}
          onCropComplete={handleCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-muted-foreground text-xs">Zoom</span>
        <input
          className="w-full"
          max={3}
          min={1}
          step={0.01}
          type="range"
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
        />
        <span className="text-muted-foreground text-xs">{zoom.toFixed(2)}x</span>
      </div>

      <ErrorMessage error={imageError} />

      <SubmitButton
        className="bg-primary text-white"
        isLoading={uploadImageMutation.isPending}
        onClick={(e) => {
          e.preventDefault();
          handleCropConfirm();
        }}
      >
        Crop
      </SubmitButton>

      <Button
        className="ms-2"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          onCancel();
        }}
      >
        Cancel
      </Button>
    </div>
  );
}

import type { Area } from 'react-easy-crop';

function createImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = src;
  });
}

// Helper to get cropped image as a webp blob
export async function getCroppedImg(imageSrc: string, crop: Area) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const { x, y, height, width } = crop;
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/webp');
  });
}

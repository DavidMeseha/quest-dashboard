import React, { type FormEvent, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { isAxiosError } from 'axios';
import { Link, useNavigate } from 'react-router';
import type { FieldError } from '@/schemas/types';
import { registerVendor, type RegisterVendorBody } from '@/services/admin-api/register-vendor';
import { avilableVendorSename } from '@/services/admin-api/sename-sku';
import useDebounce from '@/hooks/useDebounce';
import { useUserState } from '@/context/UserProvider';
import ImageCropAndUpload from '@/components/ui/extend/ImageCropAndUpload';
import ImageInput from '@/components/ui/image-input';
import FormInput from '@/components/ui/form-input';
import Label from '@/components/ui/label';
import SubmitButton from '@/components/ui/submit-button';
import { GENERATE_VENDOR_SKU_QUERY_KEY } from '@/constants/query-keys';

export default function RegisterVendorPage() {
  const navigate = useNavigate();
  const { setUser, user } = useUserState();

  const [name, setName] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<FieldError>();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedInputChange = useDebounce((value: string) => {
    setName(value);
  });

  const seNameQuery = useQuery({
    queryKey: [GENERATE_VENDOR_SKU_QUERY_KEY, name],
    queryFn: () => avilableVendorSename({ name: name }),
    enabled: !!name
  });
  const seName = seNameQuery.data?.seName ?? '';

  const submitVendorMutation = useMutation({
    mutationFn: (props: RegisterVendorBody) => registerVendor({ ...props }),
    onSuccess: () => {
      if (!user) return navigate('/login');
      setUser({ ...user, isVendor: true });
      navigate('/products');
    },
    onError: (err) => {
      setIsLoading(false);
      if (isAxiosError(err)) {
        if (err.response?.status === 409) return setError("You're already registered");
      }
      setError('Could Not register vendor');
    },
    onMutate: () => setIsLoading(true)
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageSrc(URL.createObjectURL(file));
    }
  };

  const formSubmitHandle = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.length) return setError('Name is required');
    if (name.length < 5) return setError('Name should be more than 5 letters');
    if (!image) return setError('Image is required');
    submitVendorMutation.mutate({ image, name, seName });
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create Vendor</h1>

        <Link className="text-primary text-sm hover:underline" to="/login">
          Back To Login?
        </Link>
      </div>
      <div className="flex justify-center">
        {imageSrc ? (
          <div className="w-full">
            <ImageCropAndUpload
              imageSrc={imageSrc}
              onCancel={() => setImageSrc(null)}
              onSuccess={(imageUrl) => {
                setImage(imageUrl);
                setImageSrc(null);
              }}
            />
          </div>
        ) : image ? (
          <div className="group relative">
            <img
              alt="uploaded"
              className="h-32 w-32 rounded border object-cover"
              height={128}
              src={image}
              width={128}
            />
            <button
              className="bg-destructive absolute top-0 right-0 rounded-full p-1 text-white opacity-80 hover:opacity-100"
              type="button"
              onClick={() => setImage(null)}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <ImageInput onChange={handleFileChange} />
        )}
      </div>
      <form className="space-y-2" onSubmit={formSubmitHandle}>
        <Label>Shop name</Label>
        <FormInput
          error={error}
          placeholder={'Ex. HP, Dell, Nokia, Samsung, ect.... '}
          type="text"
          onChange={(e) => debouncedInputChange(e.currentTarget.value)}
        />
        <p className="text-muted-foreground text-xs">SeName: {seName}</p>
        <div>
          <SubmitButton className="bg-primary text-primary-foreground w-full" isLoading={isLoading} type="submit">
            Register
          </SubmitButton>
        </div>
      </form>
    </>
  );
}

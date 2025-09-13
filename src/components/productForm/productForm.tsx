'use client';

import { initialProductFormValues, productGenders } from '@/constants/data-values';
import type { FieldError, IFullProduct, IProductAttribute, ProductGender } from '@/schemas/types';
import { productSchema, type ProductForm as ProductInputForm } from '@/schemas/validation';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useDebounce from '@/hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { avilableSeNameAndSku } from '@/services/admin-api/sename-sku';
import LoadingSpinner from '../ui/loading-spinner';
import ProductImageInput from './ProductImageInput';
import ErrorMessage from '../ui/error-message';
import FormInput from '../ui/form-input';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { toast } from 'react-toastify';
import FormDropdown from '../ui/extend/FormDropdown';
import CategorySelect from '../ui/extend/CategorySelect';
import TagsSelector from './TagsSelector';
import CreateProductAttributesForm from './CreateProductAttributesForm';
import { NavLink } from 'react-router';
import { getChangedFields } from '@/lib/utils';
import SubmitButton from '../ui/submit-button';
import Label from '../ui/label';

type Props = {
  product?: IFullProduct;
  onSubmit: (form: ProductInputForm | Partial<ProductInputForm>) => void;
  isPending?: boolean;
  error: FieldError;
};

export default function ProductForm({ product, onSubmit, isPending, error }: Props) {
  const isEdit = !!product;
  const initialValues: ProductInputForm = useMemo(
    () =>
      product
        ? {
            attributes: [...product.productAttributes] as IProductAttribute[],
            category: product.category._id,
            fullDescription: product.fullDescription,
            gender: product.gender as ProductGender,
            images: product.pictures.map((pic) => pic.imageUrl),
            name: product.name,
            price: { price: product.price.price, oldPrice: product.price.old ?? 0 },
            stock: product.stock,
            tags: product.productTags,
            seName: product.seName,
            sku: product.sku
          }
        : initialProductFormValues,
    []
  );

  const form = useForm<ProductInputForm>({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues
  });

  const debouncedNameChange = useDebounce((value: string) => form.setValue('name', value));

  const uniqueSKUandSeNameQuery = useQuery({
    queryKey: ['unique-sku-and-sename', form.watch('name')],
    queryFn: () => avilableSeNameAndSku({ name: form.getValues('name') }),
    enabled: form.watch('name') !== initialValues.name
  });
  form.setValue('seName', uniqueSKUandSeNameQuery.data?.seName || initialValues.seName);
  form.setValue('sku', uniqueSKUandSeNameQuery.data?.sku || initialValues.sku);

  const handleTagsChange = (values: string[]) => form.setValue('tags', values);

  const handleSubmit = (data: ProductInputForm) => {
    if (isEdit) {
      const changed = getChangedFields(initialValues, data);
      if (JSON.stringify(changed) === JSON.stringify({})) return toast.warning('No changes to submit');
      return onSubmit(changed);
    }
    onSubmit(data);
  };

  useEffect(() => {
    if (form.formState.errors.images?.message) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [form.formState.errors.images?.message]);

  return (
    <form className="relative space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      {isPending && (
        <div className="absolute z-40 flex h-full w-full items-center justify-center bg-white/60">
          <LoadingSpinner />
        </div>
      )}
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-2">
        {/* Images */}
        <div className="md:col-span-2">
          <ProductImageInput
            images={form.watch('images') ?? []}
            onChange={(values) => form.setValue('images', values)}
          />
          <ErrorMessage error={form.formState.errors.images?.message} />
        </div>

        {/* Name, seName, SKU */}
        <div>
          <FormInput
            label="Product Name"
            {...form.register('name')}
            error={form.formState.errors.name?.message}
            onChange={(e) => debouncedNameChange(e.currentTarget.value)}
          />
          <div className="flex gap-x-4">
            <div className="flex-1">
              <Label className="text-muted-foreground">seName</Label>
              <Input disabled readOnly value={form.getValues('seName')} />
            </div>
            <div className="flex-1">
              <Label className="text-muted-foreground">SKU</Label>
              <Input disabled readOnly value={form.getValues('sku')} />
            </div>
          </div>
        </div>

        {/* Price */}
        <div>
          <div>
            <FormInput
              label="Current Price"
              step="0.01"
              type="number"
              {...form.register('price.price', { valueAsNumber: true })}
              error={form.formState.errors.price?.price?.message}
            />
          </div>
          <div className="mt-1">
            <FormInput
              label="Old Price"
              step="0.01"
              type="number"
              {...form.register('price.oldPrice', { valueAsNumber: true })}
            />
          </div>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <Label>Full Description</Label>
          <Textarea {...form.register('fullDescription')} className="resize-none" rows={4} />
          <ErrorMessage error={form.formState.errors.fullDescription?.message} />
        </div>

        {/* Gender */}
        <div>
          <FormDropdown
            id="gender"
            label="Gender"
            options={productGenders.map((g) => ({ name: g, value: g }))}
            value={form.watch('gender')}
            onValueChange={(val) => form.setValue('gender', val as ProductGender)}
          />
        </div>

        {/* Category */}
        <div>
          <Label>Category</Label>
          <CategorySelect
            preSelectedCategoryName={product?.category.name}
            selectedCategoryId={form.watch('category')}
            onChange={(category) => form.setValue('category', category)}
          />
          <ErrorMessage error={form.formState.errors.category?.message} />
        </div>

        {/* Tags */}
        <div>
          <Label>Tags</Label>
          <TagsSelector tags={form.watch('tags') ?? []} onChange={handleTagsChange} />
          <ErrorMessage error={form.formState.errors.tags?.message} />
        </div>

        {/* Stock */}
        <div>
          <FormInput label="Stock" type="number" {...form.register('stock', { valueAsNumber: true })} />
        </div>

        {/* Attributes */}
        <div className="md:col-span-2">
          <CreateProductAttributesForm form={form} />
        </div>
      </div>

      <ErrorMessage error={error} />

      <div className="flex gap-4">
        <SubmitButton disabled={isPending} isLoading={isPending} type="submit">
          {product ? 'Update Product' : 'Create Product'}
        </SubmitButton>
        <NavLink className="border-primary text-primary" to="/products">
          Cancel
        </NavLink>
      </div>
    </form>
  );
}

import { Button } from '../ui/button';
import ErrorMessage from '../ui/error-message';
import type { ProductForm } from '@/schemas/validation';
import { Fragment } from 'react';
import { Controller, useFieldArray, type UseFormReturn } from 'react-hook-form';
import { Input } from '../ui/input';

type Props = {
  form: UseFormReturn<ProductForm>;
  attrIdx: number;
  type: string;
};

export function AttributeValuesInput({ form, attrIdx, type }: Props) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `attributes.${attrIdx}.values`
  });

  return (
    <div className="mt-2 space-y-2">
      {fields.map((field, idx) => (
        <Fragment key={field.id}>
          <div className="flex items-center gap-2">
            <Input placeholder="Value" {...form.register(`attributes.${attrIdx}.values.${idx}.name` as const)} />

            {type === 'Color' && (
              <Controller
                control={form.control}
                name={`attributes.${attrIdx}.values.${idx}.colorRgb`}
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <Input className="w-24" type="color" value={field.value || '#000000'} onChange={field.onChange} />
                    <Input className="w-24" type="text" value={field.value || '#000000'} onChange={field.onChange} />
                  </div>
                )}
              />
            )}
            <Input
              step="1"
              type="number"
              {...form.register(`attributes.${attrIdx}.values.${idx}.priceAdjustmentValue` as const, {
                valueAsNumber: true
              })}
            />
            <Button type="button" variant="destructive" onClick={() => remove(idx)}>
              Remove
            </Button>
          </div>
          <ErrorMessage
            error={
              form.formState.errors.attributes?.[attrIdx]?.values?.[idx]?.name?.message ||
              form.formState.errors.attributes?.[attrIdx]?.values?.[idx]?.colorRgb?.message ||
              form.formState.errors.attributes?.[attrIdx]?.values?.[idx]?.priceAdjustmentValue?.message
            }
          />
        </Fragment>
      ))}

      {fields.length < 10 && (
        <Button
          type="button"
          onClick={() =>
            append(
              type === 'Color'
                ? { name: '', priceAdjustmentValue: 0, colorRgb: '#000000' }
                : { name: '', priceAdjustmentValue: 0 }
            )
          }
        >
          {'Add Value'}
        </Button>
      )}
    </div>
  );
}

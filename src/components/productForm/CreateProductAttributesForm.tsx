import { AttributeValuesInput } from './AttributeValuesInput';
import { useFieldArray, type UseFormReturn } from 'react-hook-form';
import { Input } from '../ui/input';
import type { ProductForm } from '@/schemas/validation';
import { Button } from '../ui/button';
import ErrorMessage from '../ui/error-message';
import { attributeTypes } from '@/constants/data-values';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type Props = {
  form: UseFormReturn<ProductForm>;
};

export default function CreateProductAttributesForm({ form }: Props) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'attributes'
  });

  return (
    <>
      <div>
        <label>Attributes</label>
        {fields.map((field, idx) => (
          <div className="mb-2 rounded border p-2" key={field.id}>
            <div className="flex items-center gap-2">
              <Input placeholder="Attribute Name" {...form.register(`attributes.${idx}.name` as const)} />
              <Select
                value={form.watch(`attributes.${idx}.attributeControlType`)}
                onValueChange={(val) => form.setValue(`attributes.${idx}.attributeControlType`, val as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {attributeTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" variant="destructive" onClick={() => remove(idx)}>
                Remove
              </Button>
            </div>
            <ErrorMessage
              error={
                form.formState.errors.attributes?.[idx]?.attributeControlType?.message ||
                form.formState.errors.attributes?.[idx]?.attributeControlType?.message
              }
            />
            {/* Values */}
            <AttributeValuesInput
              attrIdx={idx}
              form={form}
              type={form.watch(`attributes.${idx}.attributeControlType`)}
            />
          </div>
        ))}
      </div>
      {fields.length < 10 && (
        <Button
          className="w-full"
          type="button"
          onClick={() =>
            append({
              attributeControlType: 'DropdownList',
              name: '',
              values: []
            })
          }
        >
          Add Attribute +
        </Button>
      )}
    </>
  );
}

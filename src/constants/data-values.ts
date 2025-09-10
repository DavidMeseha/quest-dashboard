export const attributeTypes = ['DropdownList', 'RadioList', 'Checkboxes', 'TextBox', 'Color'] as const;
export const productGenders = ['unisex', 'male', 'female'] as const;
export const genders = ['male', 'female'] as const;
export const initialProductFormValues = {
  images: [],
  name: '',
  seName: '',
  sku: '',
  fullDescription: '',
  price: { price: 0, oldPrice: 0 },
  gender: genders[0],
  category: '',
  tags: [],
  stock: 0,
  attributes: []
};

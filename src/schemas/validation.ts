import { attributeTypes, genders } from '../constants/data-values';
import z from 'zod';

const passwordRegexValidation = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;

export const productSchema = z.object({
  images: z.array(z.string()).min(1, 'At least 1 image required'),
  name: z.string().min(1, 'Product name required'),
  seName: z.string().min(1),
  sku: z.string().min(1),
  fullDescription: z.string().min(1, 'Full description required'),
  price: z.object({
    price: z.number().min(1, 'Product price required'),
    oldPrice: z.number().optional()
  }),
  gender: z.enum(genders),
  category: z.string().min(1, 'Pick a category'),
  tags: z.array(z.string()).min(1, 'Use at least 1 tag'),
  stock: z.number().min(0, 'Stock is required at least of value 0'),
  attributes: z
    .array(
      z.object({
        _id: z.optional(z.string()),
        attributeControlType: z.enum(attributeTypes),
        name: z.string().min(1, 'An attribute name is empty'),
        values: z
          .array(
            z.object({
              _id: z.optional(z.string()),
              name: z.string().min(1, 'A value is empty'),
              priceAdjustmentValue: z.number(),
              colorRgb: z.string().optional()
            })
          )
          .min(2, 'Attribute must have minimum of 2 values')
      })
    )
    .max(10)
});

export const registerSchema = z
  .object({
    email: z.email('Email is not valid').min(1, { message: 'Email is reqired' }),
    firstName: z.string().min(1, { message: 'Names are required' }),
    lastName: z.string().min(1, { message: 'Names are required' }),
    gender: z.enum(['male', 'female']),
    password: z
      .string()
      .regex(passwordRegexValidation, {
        message:
          'Password is in the wrong format. It must include at least one special character (@, $, !, %, , ?, &), one number, and one capital letter.'
      })
      .min(8, { message: 'password should be of minimum length of 8' }),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Confirm password dose not match the password',
    path: ['confirmPassword']
  });

export const loginSchema = z.object({
  email: z.email('Wrong email format'),
  password: z.string().min(1, 'Password required')
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type ProductForm = z.infer<typeof productSchema>;

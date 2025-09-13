import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Link, useNavigate } from 'react-router';
import { registerSchema, type RegisterForm } from '@/schemas/validation';
import type { FieldError } from '@/schemas/types';
import { registerUser } from '@/services/user-api/auth';
import FormInput from '@/components/ui/form-input';
import FormDropdown from '@/components/ui/extend/FormDropdown';
import { genders } from '@/constants/data-values';
import ErrorMessage from '@/components/ui/error-message';
import SubmitButton from '@/components/ui/submit-button';

export default function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    watch,
    setValue
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      gender: 'male'
    }
  });

  const [formError, setFormError] = useState<FieldError>();
  const [isLoading, setIsLoading] = useState(false);

  const registerMutation = useMutation({
    mutationKey: ['register'],
    mutationFn: (form: RegisterForm) => registerUser(form),
    onSuccess: () => {
      navigate('/login');
    },
    onError: (error) => {
      setIsLoading(false);
      if (isAxiosError(error)) {
        if (error.response?.data?.message === 'EMAIL_IN_USE') {
          return setFormError('email is not valid');
        }
        setFormError(error.response?.data?.message ?? 'Somthing went wron try again later');
      }
    }
  });

  const submitForm = (form: RegisterForm) => {
    setIsLoading(true);
    registerMutation.mutate(form);
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Register</h1>
        <Link className="text-primary text-sm hover:underline" to="/login">
          Already have an account?
        </Link>
      </div>

      <FormInput
        id="firstName"
        label="First Name"
        error={errors.firstName?.message}
        placeholder="Jhon"
        {...register('firstName', {
          onChange: () => clearErrors('firstName')
        })}
      />

      <FormInput
        id="lastName"
        label="Last Name"
        error={errors.lastName?.message ?? ''}
        placeholder="Jhon"
        type="text"
        {...register('lastName', {
          onChange: () => clearErrors('lastName')
        })}
      />

      <FormInput
        id="email"
        label="Email"
        error={errors.email?.message}
        placeholder="ex@email.com"
        type="email"
        {...register('email', {
          onChange: () => clearErrors('email')
        })}
      />

      <FormInput
        id="password"
        label="Password"
        error={errors.password?.message}
        placeholder="***************"
        type="password"
        {...register('password', {
          onChange: () => clearErrors('password')
        })}
      />

      <FormInput
        id="confirmPassword"
        label="Confirm Password"
        error={errors.confirmPassword?.message}
        placeholder="***************"
        type="password"
        {...register('confirmPassword', {
          onChange: () => clearErrors('confirmPassword')
        })}
      />

      <FormDropdown
        id="gender"
        label="Gender"
        options={genders.map((g) => ({ name: g, value: g }))}
        value={watch('gender')}
        onValueChange={(val) => setValue('gender', val as any)}
        error={errors.gender?.message}
      />

      <ErrorMessage error={formError} />

      <SubmitButton type="submit" className="w-full" isLoading={isLoading || registerMutation.isPending}>
        Register
      </SubmitButton>
    </form>
  );
}

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { NavLink, useNavigate } from 'react-router';
import { registerSchema, type RegisterForm } from '@/schemas/validation';
import type { FieldError } from '@/schemas/types';
import { registerUser } from '@/services/user-api/auth';
import FormInput from '@/components/ui/form-input';
import FormDropdown from '@/components/ui/extend/FormDropdown';
import { genders } from '@/constants/data-values';
import ErrorMessage from '@/components/ui/error-message';
import SubmitButton from '@/components/ui/submit-button';
import Label from '@/components/ui/label';

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
        <NavLink className="text-primary text-sm hover:underline" to="/login">
          Already have an account?
        </NavLink>
      </div>

      <Label htmlFor="firstName">First Name</Label>
      <FormInput
        id="firstName"
        {...register('firstName', {
          onChange: () => clearErrors('firstName')
        })}
        error={errors.firstName?.message}
        name="firstName"
        placeholder="Jhon"
      />

      <Label htmlFor="lastName">Last Name</Label>
      <FormInput
        id="lastName"
        {...register('lastName', {
          onChange: () => clearErrors('lastName')
        })}
        error={errors.lastName?.message ?? ''}
        placeholder="Jhon"
        type="text"
      />

      <Label htmlFor="email">Email</Label>
      <FormInput
        id="email"
        {...register('email', {
          onChange: () => clearErrors('email')
        })}
        error={errors.email?.message}
        placeholder="ex@email.com"
        type="email"
      />

      <Label htmlFor="password">Password</Label>
      <FormInput
        id="password"
        {...register('password', {
          onChange: () => clearErrors('password')
        })}
        error={errors.password?.message}
        placeholder="***************"
        type="password"
      />

      <Label htmlFor="confirmPassword">Confirm Password</Label>
      <FormInput
        id="confirmPassword"
        {...register('confirmPassword', {
          onChange: () => clearErrors('confirmPassword')
        })}
        error={errors.confirmPassword?.message}
        placeholder="***************"
        type="password"
      />

      <Label htmlFor="gender">Gender</Label>
      <FormDropdown
        id="gender"
        options={genders.map((g) => ({ name: g, value: g }))}
        value={watch('gender')}
        onValueChange={(val) => setValue('gender', val as any)}
      />
      <ErrorMessage error={errors.gender?.message} />

      {/* <DateDropdownNumbers
        dayInputAttributes={{ ...register('dayOfBirth') }}
        monthInputAttributes={{ ...register('monthOfBirth') }}
        title="Date Of Birth"
        yearInputAttributes={{ ...register('yearOfBirth') }}
      /> */}

      <ErrorMessage error={formError} />
      <SubmitButton type="submit" className="w-full" isLoading={isLoading || registerMutation.isPending}>
        Register
      </SubmitButton>
    </form>
  );
}

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useUserState } from '@/context/UserProvider';
import { loginSchema, type LoginForm } from '@/schemas/validation';
import type { FieldError } from '@/schemas/types';
import { login } from '@/services/user-api/auth';
import { NavLink, useNavigate } from 'react-router';
import FormInput from '@/components/ui/form-input';
import ErrorMessage from '@/components/ui/error-message';
import SubmitButton from '@/components/ui/submit-button';
import Label from '@/components/ui/label';
import { setToken } from '@/lib/localstorage';

export default function LoginPage() {
  const { setUser } = useUserState();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<FieldError>();

  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: (form: LoginForm) => login(form),
    onSuccess: async (data) => {
      setUser(data.user);
      setToken(data.token);
      navigate('/products');
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        if (err.response?.status === 403) setFormError('Wrong Credentials');
        else setFormError(JSON.stringify(err.response?.data ?? 'Unknow error, try again later'));
      }
    },
    onSettled: () => setIsLoading(false)
  });

  const submitForm = (form: LoginForm) => loginMutation.mutate(form);

  return (
    <form className="space-y-2" onSubmit={handleSubmit(submitForm)}>
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Login</h1>

          <NavLink className="text-primary text-sm hover:underline" to="/register">
            Don't have an account ?
          </NavLink>
        </div>

        <Label htmlFor="email">Email</Label>
        <FormInput
          id="email"
          {...register('email', {
            onChange: () => clearErrors('email')
          })}
          error={errors.email?.message}
          placeholder="ex@email.com"
          required
          type="email"
        />

        <Label htmlFor="password">Password</Label>
        <FormInput
          {...register('password', {
            onChange: () => clearErrors('password')
          })}
          error={errors.password?.message}
          placeholder="****************"
          required
          type="password"
        />
        <ErrorMessage error={formError} />
      </div>
      <SubmitButton className="w-full" isLoading={loginMutation.isPending || isLoading} type="submit">
        Login
      </SubmitButton>

      <div className="text-sm text-gray-600">
        <p>Just in case you don't want to register use this Credentials</p>
        <p>email: davidmmyh@gmail.com</p>
        <p>password: !Dmmyh17121994</p>
      </div>
    </form>
  );
}

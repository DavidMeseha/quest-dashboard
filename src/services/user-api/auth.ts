import type { IUser, IVendor } from '@/schemas/types';
import api from './api';
import type { LoginForm, RegisterForm } from '@/schemas/validation';

export async function checkTokenValidity() {
  return api.get<IUser>('/api/v2/auth/check').then((res) => res.data);
}

export async function checkUserVendor() {
  return api.get<IVendor>('/api/v2/auth/vendor').then((res) => res.data);
}

export async function getGuestToken() {
  return api.get<{ user: IUser; token: string }>('/api/v2/auth/guest');
}

export async function refreshToken() {
  return api.get<{ token: string }>('/api/v2/auth/refreshToken').then((data) => data.data);
}

export async function changeUserPassword(form: { original: string; new: string }) {
  return api.post('/api/v2/user/ChangePassword', {
    password: form.original,
    newPassword: form.new
  });
}

export async function registerUser(payload: RegisterForm) {
  return api.post<{ message: string }>('/api/v2/auth/register', { ...payload });
}

export async function login(payload: LoginForm) {
  return api
    .post<{ user: IUser; token: string; expiry: number }>('/api/v2/auth/login', { ...payload })
    .then((res) => res.data);
}

export async function logout() {
  return api.post<{ message: string }>('/api/v2/auth/logout').then((res) => res.data);
}

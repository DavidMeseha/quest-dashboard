import api from './api';

export type RegisterVendorBody = { name: string; seName: string; image: string };

export async function registerVendor(body: RegisterVendorBody) {
  return api.post<{ message: string; vendorId: string }>('/api/v1/register/vendor', body).then((data) => data.data);
}

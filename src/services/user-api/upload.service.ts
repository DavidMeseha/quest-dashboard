import api from './api';

export async function uploadImage(formData: FormData) {
  return api
    .post<{ imageUrl: string }>('/api/v2/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((res) => res.data);
}

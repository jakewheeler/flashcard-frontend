import axios from 'axios';

interface Category {
  id: number;
  name: string;
  userId: number;
}

export async function getCategories(): Promise<Category[]> {
  const token = window.localStorage.getItem('token');
  const categories = (
    await axios.get<Category[]>('/categories', {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).data;
  return categories;
}

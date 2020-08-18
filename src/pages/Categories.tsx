import React from 'react';
import { useQuery } from 'react-query';
import { Category, getCategories } from '../api/cardService';
import useStore from '../utils/user';

function useCategories() {
  const token = useStore((state) => state.token);
  return useQuery<Category[], Error, '/categories'>('/categories', () =>
    getCategories(token)
  );
}

export default function Categories() {
  const { isLoading, error, isError, data } = useCategories();
  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  // also status === 'success', but "else" logic works, too
  return (
    <ul>
      {data?.map((category) => (
        <li key={category.id}>{category.name}</li>
      ))}
    </ul>
  );
}

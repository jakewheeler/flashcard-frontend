import { Text } from '@chakra-ui/core';
import React from 'react';
import { useQuery } from 'react-query';
import { getCategories } from '../api/cardService';

function useCategories() {
  return useQuery('/categories', getCategories);
}

export default function Categories() {
  const { isLoading, isError, data } = useCategories();
  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: no</span>;
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

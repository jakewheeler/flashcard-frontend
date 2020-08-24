import React from 'react';
import { useQuery } from 'react-query';
import { getCategories } from '../api/cardService';
import useStore from '../utils/user';
import { Box } from '@chakra-ui/core';
import Card, { ResponsiveCardLayout } from '../components/Card';

function useCategories() {
  const token = useStore((state) => state.token);
  return useQuery(`${token}categories`, () => getCategories(token));
}

export default function Categories() {
  const { isLoading, error, isError, data } = useCategories();

  if (isError) {
    return <span>Error: {(error as Error).message}</span>;
  }

  if (isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <ResponsiveCardLayout>
      {data?.map((category) => (
        <Box key={category.id}>
          <Card url={`/categories/${category.id}/decks`}>{category.name}</Card>
        </Box>
      ))}
    </ResponsiveCardLayout>
  );
}

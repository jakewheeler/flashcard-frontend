import React from 'react';
import { useQuery } from 'react-query';
import { getCategories } from '../api/cardService';
import useStore from '../utils/user';
import { Box, Text, Flex, Link } from '@chakra-ui/core';
import { Link as RouterLink } from 'react-router-dom';

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
    <Flex justifyContent='space-between'>
      {data?.map((category) => (
        <Link
          as={RouterLink}
          to={`/categories/${category.id}/decks`}
          key={category.id}
        >
          <Box bg='teal.600' width='100'>
            <Text color='teal.200'>{category.name}</Text>
          </Box>
        </Link>
      ))}
    </Flex>
  );
}

import { useCategory } from '../hooks';
import React from 'react';
import { Spinner, Button, Collapse, Box, Text } from '@chakra-ui/core';

type CollapsibleCategoryProps = {
  categoryId: string;
  children: React.ReactNode;
};

// Category that will display the deck radio button group under it
export function CollapsibleCategory({
  categoryId,
  children,
}: CollapsibleCategoryProps) {
  const { isLoading, error, isError, data: category } = useCategory(categoryId);

  const [show, setShow] = React.useState<boolean>(false);

  const handleToggle = () => setShow(!show);

  if (isError) {
    return <span>Error: {(error as Error).message}</span>;
  }

  if (isLoading || !category) {
    return <Spinner color='white' />;
  }

  return (
    <>
      <Button colorScheme='teal' onClick={handleToggle}>
        <Text isTruncated> {category.name}</Text>
      </Button>
      <Collapse mt={4} isOpen={show}>
        <Box ml={10}>{children}</Box>
      </Collapse>
    </>
  );
}

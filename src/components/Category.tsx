import { useCategory } from '../hooks';
import React from 'react';
import {
  Spinner,
  Button,
  Collapse,
  Box,
  Text,
  IconButton,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
} from '@chakra-ui/core';
import { AddIcon } from '@chakra-ui/icons';
import useStore from '../stores/user';
import { useForm } from 'react-hook-form';
import { useMutation, queryCache } from 'react-query';
import { createCategory } from '../api/card-service';

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

type CategoryInput = {
  name: string;
};

export function AddCategoryModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const token = useStore((state) => state.token);
  const { register, handleSubmit } = useForm<CategoryInput>();
  const toast = useToast();

  const initialRef = React.useRef<HTMLInputElement | null>(null);

  const cacheKey = ['categories', token];
  const [addCategory] = useMutation(createCategory, {
    onSuccess: () => queryCache.invalidateQueries(cacheKey),
    throwOnError: true,
  });

  const onSubmit = async (category: CategoryInput) => {
    const { name } = category;
    try {
      await addCategory({ token, name });
      onClose();
    } catch (err) {
      onClose();
      toast({
        description: `Could not add category '${category.name}' because a category with this name already exists`,
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  return (
    <>
      <IconButton
        aria-label='Add category'
        icon={<AddIcon />}
        variant='outline'
        onClick={onOpen}
      />
      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
        size='lg'
      >
        <ModalOverlay>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalContent>
              <ModalHeader>Create a new category</ModalHeader>
              <ModalCloseButton />

              <ModalBody pb={6}>
                <VStack spacing={2}>
                  <FormControl>
                    <FormLabel>Category name</FormLabel>
                    <Input
                      name='name'
                      ref={(ref) => {
                        if (ref) {
                          initialRef.current = ref;
                          register(ref);
                        }
                      }}
                      placeholder='enter the category name'
                    />
                  </FormControl>
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme='teal' mr={3} type='submit'>
                  Save
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </form>
        </ModalOverlay>
      </Modal>
    </>
  );
}

import React, { useState } from 'react';
import {
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
  HStack,
} from '@chakra-ui/core';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import useStore from '../stores/user';
import { useForm } from 'react-hook-form';
import { useMutation, queryCache } from 'react-query';
import {
  createCategory,
  deleteCategory,
  editCategory,
} from '../api/card-service';
import { Category } from '../types/category';

type CollapsibleCategoryProps = {
  category: Category;
  children: React.ReactNode;
};

// Category that will display the deck radio button group under it
export function CollapsibleCategory({
  category,
  children,
}: CollapsibleCategoryProps) {
  const token = useStore((state) => state.token);
  const [show, setShow] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();

  const handleToggle = () => setShow(!show);

  const cacheKey = ['categories', token];

  const [deleteCategoryMut] = useMutation(deleteCategory, {
    onSuccess: () => queryCache.invalidateQueries(cacheKey),
    throwOnError: true,
  });

  const [editCategoryMut] = useMutation(editCategory, {
    onSuccess: () => queryCache.invalidateQueries(cacheKey),
    throwOnError: true,
  });

  const deletion = async () => {
    try {
      await deleteCategoryMut({ category });
      toast({
        description: `${category.name} has been deleted!`,
        duration: 2000,
        isClosable: true,
        status: 'success',
        position: 'top-right',
      });
    } catch (err) {
      toast({
        description: `Could not delete category`,
        duration: 9000,
        isClosable: true,
        status: 'error',
        position: 'top-right',
      });
    }
  };

  const edit = async (name: string) => {
    try {
      const editedCategory: Category | undefined = await editCategoryMut({
        category,
        name,
      });
      setIsEditing(false);
      if (editedCategory) {
        toast({
          description: `${category.name} has been renamed to ${editedCategory.name}`,
          duration: 2000,
          isClosable: true,
          status: 'success',
          position: 'top-right',
        });
      }
    } catch (err) {
      toast({
        description: `Could not edit deck`,
        duration: 9000,
        isClosable: true,
        status: 'error',
        position: 'top-right',
      });
    }
  };

  return (
    <>
      <HStack justifyContent='space-between'>
        {isEditing ? (
          <Box width='100%'>
            <EditCategoryInput
              currentCategoryName={category.name}
              handleEdit={edit}
              close={() => setIsEditing(false)}
            />
          </Box>
        ) : (
          <Button colorScheme='teal' onClick={handleToggle} width='100%'>
            <Text isTruncated>{category.name}</Text>
          </Button>
        )}
        <HStack>
          <IconButton
            colorScheme='black'
            aria-label={`edit`}
            icon={<EditIcon />}
            onClick={() => setIsEditing(!isEditing)}
          />
          <IconButton
            colorScheme='black'
            aria-label={`delete`}
            icon={<DeleteIcon />}
            onClick={deletion}
          />
        </HStack>
      </HStack>
      <Collapse mt={4} isOpen={show}>
        <Box ml={10}>{children}</Box>
      </Collapse>
    </>
  );
}

type EditCategoryInputProps = {
  currentCategoryName: string;
  handleEdit: (newName: string) => Promise<void>;
  close: () => void;
};

export function EditCategoryInput({
  currentCategoryName,
  handleEdit,
  close,
}: EditCategoryInputProps) {
  const { register, handleSubmit } = useForm<{ name: string }>();

  const onSubmit = async (input: { name: string }) => {
    await handleEdit(input.name);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack align='left'>
        <Input
          name='name'
          placeholder={currentCategoryName}
          textColor='black'
          ref={register}
        />
        <HStack>
          <Button h='1.75rem' size='sm' type='submit' colorScheme='teal'>
            OK
          </Button>
          <Button h='1.75rem' size='sm' onClick={close} color='black'>
            Cancel
          </Button>
        </HStack>
      </VStack>
    </form>
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
      await addCategory({ name });
      onClose();
      toast({
        description: `Added category '${category.name}'`,
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
      });
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
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalContent>
              <ModalHeader>Create a new category</ModalHeader>
              <ModalCloseButton />

              <ModalBody pb={5} mr={10}>
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

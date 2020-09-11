import React, { useState, ChangeEvent, RefObject } from 'react';
import { useAllUserDecks, useCategory, useCategories } from '../hooks/index';
import useSelectedDeck from '../stores/deck';
import {
  Box,
  Heading,
  VStack,
  Divider,
  RadioGroup,
  HStack,
  Radio,
  Text,
  Spinner,
  Button,
  Collapse,
  useRadio,
  IconButton,
  InputGroup,
  Input,
  InputRightElement,
  UseRadioProps,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  ModalFooter,
} from '@chakra-ui/core';
import { StringOrNumber } from '@chakra-ui/utils';
import { Deck, EditDeckInputObj } from '../types/deck';
import useStore from '../stores/user';
import { useMutation, queryCache } from 'react-query';
import { deleteDeck, editDeck, createDeck } from '../api/card-service';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { useDeckRadioGroup } from '../hooks';

function DeckSelectionMenu() {
  const [viewByValue, setViewByValue] = useState<React.ReactText>('category');
  const { group, getRadioProps } = useDeckRadioGroup();

  return (
    <Box minH='100vh' minW='500px' maxW='500px' bgColor='teal.400'>
      <Heading align='center' mt='35px' color='teal.100' mb='10px'>
        Library
      </Heading>
      <Divider />
      <VStack spacing='5px' mx='20px' mt='20px' align='left'>
        <Text align='left' color='teal.100'>
          View by{' '}
        </Text>
        <RadioGroup
          defaultValue='category'
          onChange={setViewByValue}
          value={viewByValue}
        >
          <HStack spacing={5}>
            <Radio colorScheme='white' value='category'>
              Category
            </Radio>
            <Radio colorScheme='white' value='deck'>
              Deck
            </Radio>
          </HStack>
        </RadioGroup>
      </VStack>
      <VStack align='left' paddingTop={5} mr={5} ml={5}>
        {viewByValue === 'category' ? (
          <ViewByCategory group={group} getRadioProps={getRadioProps} />
        ) : (
          <ViewByDeck group={group} getRadioProps={getRadioProps} />
        )}
      </VStack>
    </Box>
  );
}

type ViewByProps = {
  group: {
    ref: (value: any) => void;
    role: string;
  };
  getRadioProps: (
    props?: Record<string, any> | undefined,
    ref?: ((instance: any) => void) | React.RefObject<any> | null | undefined
  ) => {
    [x: string]: any;
    ref: React.Ref<any>;
    name: string;
    onChange: (
      eventOrValue: ChangeEvent<HTMLInputElement> | StringOrNumber
    ) => void;
  };
};

function ViewByCategory({ group, getRadioProps }: ViewByProps) {
  const { isLoading, error, isError, data } = useCategories();

  if (isError) {
    return <span>Error: {(error as Error).message}</span>;
  }

  if (isLoading || !data) {
    return <span>Loading...</span>;
  }

  return (
    <>
      {data.map((category) => (
        // each category has its own collapsible
        <CollapsibleCategory key={category.id} categoryId={category.id}>
          <VStack spacing={2} align='left'>
            <AddDeckModal categoryId={category.id} />
            <RadioCardGroup
              group={group}
              decks={category.decks}
              getRadioProps={getRadioProps}
            />
          </VStack>
        </CollapsibleCategory>
      ))}
    </>
  );
}

function ViewByDeck({ group, getRadioProps }: ViewByProps) {
  const { isLoading, error, isError, data } = useAllUserDecks();

  if (isError) {
    return <span>Error: {(error as Error).message}</span>;
  }

  if (isLoading || !data) {
    return <span>Loading...</span>;
  }

  return (
    <>
      <RadioCardGroup
        group={group}
        decks={data}
        getRadioProps={getRadioProps}
      />
    </>
  );
}

type CollapsibleCategoryProps = {
  categoryId: string;
  children: React.ReactNode;
};

// Category that will display the deck radio button group under it
function CollapsibleCategory({
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

type RadioCardGroupProps = ViewByProps & {
  decks: Deck[];
};

function RadioCardGroup({ group, decks, getRadioProps }: RadioCardGroupProps) {
  return (
    <VStack {...group} align='left'>
      {decks.map((deck: Deck) => {
        // console.log(deck);
        const value = deck.name;
        const radio = getRadioProps({ value });
        return (
          <RadioCard key={deck.id} deck={deck} {...radio}>
            <Text isTruncated>{value}</Text>
          </RadioCard>
        );
      })}
    </VStack>
  );
}

interface CustomRadioBtnProps extends UseRadioProps {
  children: React.ReactNode;
  deck: Deck;
}

function RadioCard(props: CustomRadioBtnProps) {
  const { getInputProps, getCheckboxProps } = useRadio(props);
  const { deck } = props;
  const { currentDeck, setDeck } = useSelectedDeck();
  const [isEditing, setIsEditing] = useState(false);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  const token = useStore((state) => state.token);

  const cacheKey = `${token}/categories`;

  const [deleteSelectedDeck] = useMutation(deleteDeck, {
    onSuccess: () => queryCache.invalidateQueries(cacheKey),
  });

  const [editSelectedDeck] = useMutation(editDeck, {
    onSuccess: () => queryCache.invalidateQueries(cacheKey),
  });

  const deletion = async () => {
    try {
      await deleteSelectedDeck({ token, deck });
      setDeck(null);
    } catch (err) {
      console.error(`Could not delete deck: ${deck.name}`);
      console.error(err);
    }
  };

  const edit = async (newName: string) => {
    try {
      const editedDeck: Deck | undefined = await editSelectedDeck({
        token,
        deck,
        newName,
      });
      setIsEditing(false);
      if (editedDeck) {
        setDeck(editedDeck);
      }
    } catch (err) {
      console.error(`Could not delete deck: ${deck.name}`);
      console.error(err);
    }
  };

  return (
    <Box as='label'>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        borderWidth='1px'
        borderRadius='md'
        boxShadow='md'
        _checked={{
          bg: 'teal.600',
          color: 'white',
          borderColor: 'teal.600',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={5}
        py={3}
      >
        <HStack justifyContent='space-between'>
          {isEditing && currentDeck?.name === deck.name ? (
            <EditDeckInput
              currentDeckName={currentDeck.name}
              handleEdit={edit}
            />
          ) : (
            props.children
          )}
          {currentDeck?.name === deck.name && (
            <HStack>
              <IconButton
                colorScheme='black'
                aria-label={`edit ${props.deck?.name}`}
                icon={<EditIcon />}
                onClick={() => setIsEditing(!isEditing)}
              />
              <IconButton
                colorScheme='black'
                aria-label={`delete ${props.deck?.name}`}
                icon={<DeleteIcon />}
                onClick={deletion}
              />
            </HStack>
          )}
        </HStack>
      </Box>
    </Box>
  );
}

type EditDeckInputProps = {
  currentDeckName: string;
  handleEdit: (newName: string) => Promise<void>;
};

function EditDeckInput({ currentDeckName, handleEdit }: EditDeckInputProps) {
  const { register, handleSubmit } = useForm<EditDeckInputObj>();

  const onSubmit = async (input: EditDeckInputObj) => {
    await handleEdit(input.newName);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputGroup size='md'>
        <Input
          name='newName'
          pr='4.5rem'
          placeholder={currentDeckName}
          textColor='black'
          ref={register}
        />
        <InputRightElement width='4.5rem'>
          <Button h='1.75rem' size='sm' type='submit' colorScheme='teal'>
            OK
          </Button>
        </InputRightElement>
      </InputGroup>
    </form>
  );
}

type AddDeckModalProps = {
  categoryId: string;
};

type AddDeckInputObj = {
  name: string;
};

function AddDeckModal({ categoryId }: AddDeckModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: category } = useCategory(categoryId);
  const token = useStore((state) => state.token);
  const { register, handleSubmit } = useForm<AddDeckInputObj>();

  const initialRef = React.useRef<HTMLInputElement | null>(null);

  const cacheKey = `${token}/categories/${categoryId}/decks`;
  const [addDeck] = useMutation(createDeck, {
    onSuccess: () => queryCache.invalidateQueries(cacheKey),
  });

  const onSubmit = async (deck: AddDeckInputObj) => {
    const { name } = deck;
    try {
      await addDeck({ token, categoryId, name });
      onClose();
    } catch (err) {
      console.error(`Could not add deck: ${deck.name}`);
      console.error(err);
    }
  };

  return (
    <>
      <Button colorScheme='teal' onClick={onOpen}>
        Add Deck
      </Button>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalContent>
              <ModalHeader>Create a new deck</ModalHeader>
              <ModalCloseButton />

              <ModalBody pb={6}>
                <VStack spacing={2}>
                  <FormControl>
                    <FormLabel>Deck name</FormLabel>
                    <Input
                      name='name'
                      ref={(ref) => {
                        if (ref) {
                          initialRef.current = ref;
                          register(ref);
                        }
                      }}
                      placeholder='enter the deck name'
                    />
                  </FormControl>
                  <Text>
                    This deck will be added to{' '}
                    <span style={{ fontWeight: 'bold' }}>{category?.name}</span>
                  </Text>
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

export default DeckSelectionMenu;

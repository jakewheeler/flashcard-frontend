import React, { useState, ChangeEvent } from 'react';
import { useAllUserDecks, useCategories } from '../hooks/index';
import {
  Box,
  Heading,
  VStack,
  Divider,
  RadioGroup,
  HStack,
  Radio,
  Text,
} from '@chakra-ui/core';
import { StringOrNumber } from '@chakra-ui/utils';
import { useDeckRadioGroup } from '../hooks';
import { AddDeckModal } from './Deck';
import { RadioCardGroup } from './RadioGroup';
import { CollapsibleCategory } from './Category';

function Menu() {
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

export type ViewByProps = {
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

export default Menu;

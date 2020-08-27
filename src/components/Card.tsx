import React, { useState } from 'react';
import {
  Flex,
  IconButton,
  Stack,
  HStack,
  Box,
  Button,
  Text,
} from '@chakra-ui/core';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import ReactCardFlip from 'react-card-flip';
import { Card } from '../pages/Decks';
import useSelectedDeck from '../utils/deck';

type CardProps = {
  card: Card;
};

export default function CardTemplate({ card }: CardProps) {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const handleClick = () => setIsFlipped(!isFlipped);

  return (
    <ReactCardFlip isFlipped={isFlipped}>
      <CardStructure card={card}>
        <Flex
          className='front-card-flex'
          flexDir='column'
          justifyContent='space-between'
          alignItems='center'
          minH='inherit'
          mb={50}
        >
          <Text color='teal.100'>{card.front}</Text>

          <Button onClick={handleClick}>Flipperoni</Button>
        </Flex>
      </CardStructure>
      <CardStructure card={card}>
        <Flex
          className='front-card-flex'
          flexDir='column'
          justifyContent='space-between'
          alignItems='center'
          minH='inherit'
          mb={50}
        >
          <Text color='teal.100'>{card.back}</Text>

          <Button onClick={handleClick}>Flipperoni</Button>
        </Flex>
      </CardStructure>
    </ReactCardFlip>
  );
}

type CardStructureProps = {
  children: React.ReactNode;
  card: Card;
};

function CardStructure({ children, card }: CardStructureProps) {
  const deck = useSelectedDeck((state) => state.currentDeck);
  if (!deck) return <Box className='no-deck-cards'></Box>;

  const { id, categoryId } = deck;

  const cardUrl = `/categories/${categoryId}/decks/${id}/cards/${card.id}`;
  return (
    <Stack
      className='card-structure'
      borderWidth='1px'
      rounded='lg'
      overflow='hidden'
      bg='teal.600'
      margin='50px'
      _hover={{
        borderColor: 'black',
        bg: 'teal.500',
        color: 'black',
      }}
    >
      <Flex justifyContent='flex-end'>
        <HStack spacing='5px' mr='5px' mt='5px'>
          <IconButton
            aria-label='Edit'
            colorScheme='teal'
            icon={<EditIcon />}
            onClick={() => console.log('edit', cardUrl)}
          />
          <IconButton
            aria-label='Delete'
            colorScheme='teal'
            icon={<DeleteIcon />}
            onClick={() => console.log('delete', cardUrl)}
          />
        </HStack>
      </Flex>
      <Box h='100%' minW='300px' minH='350px'>
        {children}
      </Box>
    </Stack>
  );
}

type ResponsiveCardLayoutProps = {
  children: React.ReactNode;
};

export function ResponsiveCardLayout({ children }: ResponsiveCardLayoutProps) {
  return (
    <Flex
      justifyContent={['center', 'center', 'left', 'left']}
      padding='20px'
      flexWrap='wrap'
    >
      {children}
    </Flex>
  );
}

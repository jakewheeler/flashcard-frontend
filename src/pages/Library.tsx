import React, { useState } from 'react';
import { Box, Flex, VStack, Spinner, Heading } from '@chakra-ui/core';
import { useCards } from '../hooks';
import { Deck } from '../types/deck';
import useSelectedDeck from '../stores/deck';
import CardTemplate, {
  ResponsiveCardLayout,
  CreateCardCollapsible,
} from '../components/Card';
import Menu, { MenuController } from '../components/Menu';

export default function Library() {
  const selectedDeck = useSelectedDeck((state) => state.currentDeck);
  const [isOpen, setIsOpen] = useState(true);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box className='lib-container' display={{ md: 'flex' }} maxW='100vw'>
      {/* left side menu */}
      <Box className='menu-container'>
        <Menu
          isOpen={isOpen}
          menuController={
            <MenuController isOpen={isOpen} toggle={toggleMenu} />
          }
        />
      </Box>

      <Flex
        flexDir='column'
        display={{ base: isOpen ? 'none' : 'block', md: 'block' }}
      >
        <VStack ml={{ base: 4, sm: 60 }} mt={5} align='left' spacing={3}>
          <Heading color='teal.900'>
            {selectedDeck ? selectedDeck.name : 'Select a deck'}
          </Heading>
          {selectedDeck && <CreateCardCollapsible />}
        </VStack>
        {/* shows cards in a specific deck */}
        <ResponsiveCardLayout>
          {selectedDeck && <CardView deck={selectedDeck} />}
        </ResponsiveCardLayout>
      </Flex>
    </Box>
  );
}

type CardPanelProps = {
  deck: Deck;
};

function CardView({ deck }: CardPanelProps) {
  const { isLoading, error, isError, data } = useCards(deck);

  if (isError) {
    return <span>Error: {(error as Error).message}</span>;
  }

  if (isLoading) {
    return <Spinner color='white' />;
  }

  if (!data?.length) {
    return (
      <Heading color='teal.700' m={{ base: 0, sm: 50 }}>
        No cards yet
      </Heading>
    );
  }

  return (
    <>
      {data?.map((card) => (
        <Box key={card.id} m={2}>
          <CardTemplate card={card} />
        </Box>
      ))}
    </>
  );
}

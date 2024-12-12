import React, { useState } from 'react';
import { Modal, Flex, AutoComplete } from 'antd';
import CompareContainer from './CompareContainer';

const Compare = ({ focusNode, graphData, colourPalette, getAuthors, isCompareModalOpen, setIsCompareModalOpen }) => {

  const [options, setOptions] = useState(getAuthors(graphData, [focusNode.name]));
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [searchInput, setSearchInput] = useState(''); // Texte saisi par l'utilisateur
  const [displayValue, setDisplayValue] = useState(''); // Nom affiché dans le champ

  const handleOnSearch = (data) => {
    setSearchInput(data); // Mise à jour du texte saisi
    if (data === '') {
      setDisplayValue(''); // Efface le texte affiché quand le champ est vide
    }
    setOptions(
      getAuthors(graphData, [focusNode.name]).filter((o) =>
        o.label.toLowerCase().includes(data.toLowerCase())
      )
    );
  };

  const onSelect = (data) => {
    const selectedNode = graphData.nodes.find(n => n.id === data);
    setSelectedAuthor(selectedNode);
    const selectedOption = options.find((option) => option.value === data);
    if (selectedOption) {
      setDisplayValue(selectedOption.label); // Affiche le nom sélectionné
      setSearchInput(''); // Réinitialise la saisie
    }
  };

  const handleCancel = () => {
    setIsCompareModalOpen(false);
  };

  return (
    <Modal title="Compare authors" open={isCompareModalOpen} footer={null} closable={true} onCancel={handleCancel} >
      <Flex justify={'center'} align={'center'}>
        <AutoComplete
          options={options}
          value={searchInput || displayValue} // Priorité à la saisie ou au nom sélectionné
          style={{
            width: 150,
            color: 'white'
          }}
          onSelect={onSelect}
          onSearch={handleOnSearch}
          placeholder="Select author"
          variant="filled"
        />
      </Flex>
      <CompareContainer focusNode={focusNode} selectedAuthor={selectedAuthor} colourPalette={colourPalette}/>
    </Modal>
  );
};

export default Compare;
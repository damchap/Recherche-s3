import React, { useState } from 'react';
import { Modal, Flex, AutoComplete } from 'antd';
import CompareContainer from './CompareContainer';

const Compare = ({ focusNode, graphData, colourPalette, getAuthors, isCompareModalOpen, setIsCompareModalOpen }) => {

    const [options, setOptions] = useState(getAuthors(graphData, [focusNode.name]));
    const [selectedAuthor, setSelectedAuthor] = useState(null);

    const handleOnSearch = (data) => {
        setOptions(getAuthors(graphData, [focusNode.name]).filter((o) => o.label.toLowerCase().includes(data.toLowerCase())));
    };

    const onSelect = (data) => {
        const selectedNode = graphData.nodes.find(n => n.id === data);
        setSelectedAuthor(selectedNode);
    };

    const handleCancel = () => {
        setIsCompareModalOpen(false);
    };

    return (
        <Modal title="Compare authors" open={isCompareModalOpen} footer={null} closable={true} onCancel={handleCancel} >
            <Flex justify={'center'} align={'center'}>
                <AutoComplete
                    options={options}
                    style={{
                        width: 150,
                        color:'white'
                    }}
                    onSelect={onSelect}
                    on
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
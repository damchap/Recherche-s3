import React, { useEffect, useState } from 'react';
import {Layout, AutoComplete, Typography, Flex, Button, Tooltip, Space, Modal, Popover, Switch, Select} from 'antd';
import {
    IconRouteX,
    IconAdjustmentsHorizontal,
    IconAffiliate,
    IconScale,
    IconDownload,
    IconPresentation,
    IconSunFilled, IconMoonFilled
} from '@tabler/icons-react';
import { postFilters, findShortestPath, getGraph, getCluster, getGraphState, getStates } from '../../utils/api.js';
import Compare from './Compare';
import Filter from './Filter';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import AnimationSlider from './AnimationSlider';
import { SunFilled, MoonFilled } from '@ant-design/icons'

const { Header } = Layout;
const { Title } = Typography;

function getAuthors(graphData, excludeAuthors) {
    if (!Array.isArray(excludeAuthors)) {
        throw new Error("excludeAuthors must be an array of strings");
    }

    return graphData.nodes
        .filter(node => !excludeAuthors.includes(node.id))
        .map(node => ({
            label: node.name,
            value: node.id,
        }));
}

function extractGroups(data) {
    const groups = [];

    data.nodes.forEach((node) => {
        let existingGroup = groups.find((g) => g.value === `group_id_${node.group}`);

        if (existingGroup) {
            existingGroup.children.push({ title: node.name, value: node.name });
        } else {
            groups.push({
                title: `Group ${node.group}`,
                value: `group_id_${node.group}`,
                children: [{ title: node.name, value: node.name }]
            });
        }
    });

    groups.sort((a, b) => a.value.toLowerCase().localeCompare(b.value.toLowerCase()));

    groups.forEach((group) => {
        group.children.sort((a, b) => a.value.toLowerCase().localeCompare(b.value.toLowerCase()));
    });

    return groups;
}

function cleanGraphData(graphData) {
    return {
        nodes: graphData.nodes.map(n => {return {
            id: n.id,
            name: n.name,
            group: n.group,
            h_index: n.h_index,
            domains: n.domains,
            degree: n.degree,
            degree_centrality: n.degree_centrality,
            betweenness_centrality: n.betweenness_centrality,
            closeness_centrality: n.closeness_centrality,
            clustering_coefficient: n.clustering_coefficient,
            most_frequent_collaborator: n.most_frequent_collaborator,
            most_frequent_collaborator_group: n.most_frequent_collaborator_group,
            publications_count: n.publications_count
        }}),
        links: graphData.links.map(l => {return {
            source: l.source.id,
            target: l.target.id,
            weight: l.weight,
            songs: l.songs
        }}),
        max: graphData.max,
        stats: graphData.stats,
        average: graphData.average
    };
}

const Nav = ({graphData, setGraphData, focusNode, focusOnNode, colourPalette, setShow2Dgraph, handleThemeCheck}) => {

    const [options, setOptions] = useState(getAuthors(graphData, []));
    const [open, setOpen] = useState(false);
    const [target, setTarget] = useState('');

    const [isPathModalOpen, setIsPathModalOpen] = useState(false);
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

    const [isClustered, setIsClustered] = useState(false);
    const [isPathActive, setIsPathActive] = useState(false);

    const [maxValues, setMaxValues] = useState({});
    const [areMaxValuesLoaded, setAreMaxValuesLoaded] = useState(false);

    const [filters, setFilters] = useState({});

    const [groups, setGroups] = useState(extractGroups(graphData));

    const [areStatesLoaded, setAreStatesLoaded] = useState(true);

    const [searchInput, setSearchInput] = useState('');
    const [displayValue, setDisplayValue] = useState('');

    useEffect(() => {
        if (!areMaxValuesLoaded) {
            setMaxValues(graphData.max);
            setAreMaxValuesLoaded(true);
        }
    }, []);

    useEffect(() => {
        setOptions(getAuthors(graphData, []));
    }, [graphData]);

    useEffect(() => {
        const applyFilters = async () => {
            try {
                const filteredData = await postFilters(filters);
                focusOnNode(null);
                setGraphData(filteredData);
            } catch (error) {
                console.error('Error applying filters:', error);
            }
        };

        if (Object.keys(filters).length > 0) {
            applyFilters();
        }
    }, [filters, setGraphData]);

    const showDrawer = () => {
        setOpen(true);
    };

    const showPathModal = async () => {
        if (isPathActive) {

            const graph = await getGraph();
            setGraphData(graph);
            setIsPathActive(false);

        } else {
            if (isClustered) {
                const graph = await getGraph();
                setGraphData(graph);
                setIsClustered(false);
            }
            setIsPathModalOpen(true);
        }
    };

    const showCompareModal = () => {
        setIsCompareModalOpen(true);
    };

    const handleCancel = () => {
        setIsPathModalOpen(false);
    };

    const handleOnSearch = (data) => {
        setSearchInput(data);
        if (data === '') {
            setDisplayValue('');
        }
        setOptions(
          getAuthors(graphData, []).filter((o) =>
            o.label.toLowerCase().includes(data.toLowerCase())
          )
        );
    };

    const handleOnSelect = (selectedValue) => {
        const selectedOption = options.find((option) => option.value === selectedValue);
        if (selectedOption) {
            setDisplayValue(selectedOption.label);
            setSearchInput('');
            const selectedNode = graphData.nodes.find((n) => n.id === selectedValue);
            focusOnNode(selectedNode);
        }
    };

    const handleExportClick = async () => {
        try {
            const cleanedGraphData = cleanGraphData(graphData);
            setShow2Dgraph(true);
            const graphDataJSON = JSON.stringify(cleanedGraphData, null, 2);
            const graphElement = document.querySelector("#root > div > main > div > div.svg-graph");
            const canvas = await html2canvas(graphElement);
            const snapshotBlob = await new Promise((resolve) =>
                canvas.toBlob(resolve, "image/png")
            );
            const zip = new JSZip();
            zip.file("graph.json", graphDataJSON);
            zip.file("graph.png", snapshotBlob);
            const zipBlob = await zip.generateAsync({ type: "blob" });
            saveAs(zipBlob, "graph.zip");
        } catch (error) {
            console.error("Failed to export graph data:", error);
        }
    };

    const boxStyle = {
        width: '100%',
    };

    const handlePathClick = async () => {
        if (isPathActive) {
            const graph = await getGraph();
            setGraphData(graph);
            setIsPathActive(false);
        }

        const cleanedGraphData = cleanGraphData(graphData);

        try {
            const pathData = await findShortestPath(
                cleanedGraphData,
                focusNode.id,
                target
            );
            setGraphData(pathData);
            setIsPathModalOpen(false);
            setIsPathActive(true);
        } catch (error) {
            console.error('Error finding shortest path:', error);
        }
    };

    const handleClusterClick = async () => {
        if (isClustered) {
            const graph = await getGraph();
            setGraphData(graph);
            setIsClustered(false);
        } else {
            if (isPathActive) {
                setIsPathActive(false);
            }
            const graph = JSON.parse(await getCluster(focusNode));
            setGraphData(graph);
            setIsClustered(true);
        }
    };

    const animationOnChangeComplete = async (state) => {
        try {
            const graphState = await getGraphState(state);
            setGraphData(graphState);
        } catch (error) {
            console.error('Error finding shortest path:', error);
        }
    };

    return (
        <>
            <Header
                style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    padding: '0px 10px'
                }}
            >
                <Flex style={boxStyle} align='center' justify='space-between'>
                    <Title style={{margin:0, color:'white'}} level={4}>Graphe des co-publications</Title>
                    <AutoComplete
                        options={options}
                        value={searchInput || displayValue}
                        style={{
                            width: 200,
                            color:'white'
                        }}
                        onSelect={handleOnSelect}
                        onSearch={handleOnSearch}
                        placeholder="Search author"
                        variant={colourPalette.autocomplete}
                    />

                    <Flex align='center' justify='space-between'>
                        <Switch size={"small"} style={{marginRight: '40px'}} checkedChildren={<SunFilled />} unCheckedChildren={<MoonFilled />} onChange={handleThemeCheck} />
                        <Space size={'large'} align='baseline' style={{marginTop:'10px'}}>
                            <Tooltip title="Cluster">
                                <Button type={isClustered ? 'secondary' : 'default'} disabled={focusNode === null} shape='circle' icon={<IconAffiliate />} onClick={handleClusterClick} />
                            </Tooltip>
                            <Tooltip title="Shortest path">
                                <Button type={isPathActive ? 'secondary' : 'default'} disabled={focusNode === null} shape='circle' icon={<IconRouteX />} onClick={showPathModal} />
                            </Tooltip>
                            <Tooltip title="Compare">
                                <Button disabled={focusNode === null} shape='circle' icon={<IconScale />} onClick={showCompareModal} />
                            </Tooltip>
                            <Tooltip title="Filter">
                                <Button shape='circle' icon={<IconAdjustmentsHorizontal />} onClick={showDrawer} />
                            </Tooltip>
                            <Tooltip title="Export">
                                <Button shape='circle' icon={<IconDownload />} onClick={handleExportClick} />
                            </Tooltip>
                            {areStatesLoaded && (
                                <Tooltip title="Animation">
                                    <Popover trigger={'click'} content={<AnimationSlider animationOnChangeComplete={animationOnChangeComplete} />} placement='bottomLeft' >
                                        <Button shape='circle' icon={<IconPresentation />}  />
                                    </Popover>
                                </Tooltip>
                            )}
                        </Space>
                    </Flex>
                </Flex>
            </Header>

            {areMaxValuesLoaded && (<Filter open={open} setOpen={setOpen} maxValues={maxValues} groups={groups} setFilters={setFilters}/>)}

            <Modal title="Shortest Path" open={isPathModalOpen} onOk={handlePathClick} onCancel={handleCancel}>
                <p>Select author:</p>
                <AutoComplete
                    options={options}
                    style={{
                        width: 200,
                        color:'white'
                    }}
                    onSelect={setTarget}
                    ca
                    onSearch={handleOnSearch}
                    placeholder="input here"
                    variant="outlined"
                />
            </Modal>

            {focusNode && (
                <Compare focusNode={focusNode} graphData={graphData} colourPalette={colourPalette.graph.nodes} getAuthors={getAuthors} isCompareModalOpen={isCompareModalOpen} setIsCompareModalOpen={setIsCompareModalOpen}/>
            )}
        </>
    );
};

export default Nav;
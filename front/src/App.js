import React, { useEffect, useState } from 'react';

import {ConfigProvider, Layout, Segmented, theme} from 'antd';

import { IconSquare, IconCube } from '@tabler/icons-react';
import Graph2D from './components/graph/Graph2D';
import Graph3D from './components/graph/Graph3D';

import { getGraph } from './utils/api.js';

import Nav from './components/nav/Nav.js';
import Stats from './components/stats/Stats.js';
import Panel from './components/panel/Panel.js';

const { Content } = Layout;

const lightPalette = {
    theme: {
        components: {
            Layout: {
                headerBg: '#326CAC'
            },
            Card: {
                headerBg: 'rgba(200, 200, 200, 0.2)',
                colorBgContainer: 'rgba(200, 200, 200, 0.2)',
            },
            Carousel: {
                colorBgContainer: 'rgba(0, 0, 0, 0.4)',
                dotHeight: 2
            }
        },
        algorithm: theme.defaultAlgorithm,
    },
    graph: {
        nodes: [
            "#9E0142",
            "#D53E4F",
            "#F46D43",
            "#FDAE61",
            "#FEE08B",
            "#E6F598",
            "#ABDDA4",
            "#66C2A5",
            "#3288BD",
            "#5E4FA2"
        ],
        bg: "#EEE",
        color: "#000",
    },
    autocomplete: 'outlined',
    radar: '#CCC'
};

const darkPalette = {
    theme: {
        components: {
            Layout: {
                headerBg: '#262626'
            },
            Button: {
                defaultBg: '#F8F4E3',
                defaultColor: '#262626',
                defaultHoverBg: '#262626',
                defaultHoverColor: '#F8F4E3',
                defaultHoverBorderColor: 'none',
                secondaryBg: '#8B8BAE',
                colorPrimary: '#FF7B9C',
            },
            Form: {
                labelColor: '#CCC',
            },
            Slider: {
                trackBg: '#FFF7F8',
                handleColor:'#FFF7F8',
                trackHoverBg: '#FF7B9C',
                dotBorderColor: '#3A3A3A',
                handleActiveColor:'#FF7B9C',
            },
            Switch: {
                handleColor: '#FF7B9C',
                colorPrimary: '#FF7B9C',
                colorPrimaryHover: '#843c4e',
            },
            Card: {
                headerBg: 'rgba(0, 0, 0, 0.2)',
                colorBgContainer: 'rgba(0, 0, 0, 0.2)',
            },
            Carousel: {
                colorBgContainer: 'rgba(255, 255, 255, 0.4)',
                dotHeight: 2
            }
        },
        algorithm: theme.darkAlgorithm,
    },
    graph: {
        nodes: [
            "#9E0142",
            "#D53E4F",
            "#F46D43",
            "#FDAE61",
            "#FEE08B",
            "#E6F598",
            "#ABDDA4",
            "#66C2A5",
            "#3288BD",
            "#5E4FA2"
        ],
        bg: "#171717",
        color: "#EEE",
    },
    autocomplete: 'filled',
    radar: '#AAA'
};

function App() {
    const [graphData, setGraphData] = useState({});
    const [isGraphDataLoaded, setIsGraphDataLoaded] = useState(false);

    const [show2Dgraph, setShow2Dgraph] = useState(true);
    const [show3Dgraph, setShow3Dgraph] = useState(false);

    const [colourPalette, setColourPalette] = useState(darkPalette);

    const [focusNode, setFocusNode] = useState(null);

    const focusOnNode = (node) => {
        showDrawer();
        setFocusNode(node);
    };

    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const handleViewChange = (view) => {
        if (view === '2D') {
            setShow2Dgraph(true);
            setShow3Dgraph(false);
        } else {
            setShow3Dgraph(true);
            setShow2Dgraph(false);
        }
    }

    const handleThemeCheck = (newTheme) => {
        if (newTheme) {
            setColourPalette(lightPalette);
        } else {
            setColourPalette(darkPalette);
        }
    }

    const containerStyle = {
        position: 'relative',
        overflow: 'hidden'
    };

    useEffect(() => {
        const initGraph = async () => {
            try {
                const graph = await getGraph();
                setGraphData(graph);
                setIsGraphDataLoaded(true);
            } catch (error) {
                console.error('Error fetching graph:', error);
            }
        };

        initGraph();
    }, []);

    return (
        <>
            {isGraphDataLoaded && (
                <ConfigProvider
                    theme={colourPalette.theme}
                >
                    <Layout className="layout">
                        <Nav
                            focusOnNode={focusOnNode}
                            setGraphData={setGraphData}
                            graphData={graphData}
                            focusNode={focusNode}
                            colourPalette={colourPalette}
                            setShow2Dgraph={setShow2Dgraph}
                            setIsGraphDataLoaded={setIsGraphDataLoaded}
                            handleThemeCheck={handleThemeCheck}
                        />
                        <Content>
                            <Segmented
                                vertical
                                size='small'
                                options={[
                                    { value: '2D', icon: <IconSquare size={24} />},
                                    { value: '3D', icon: <IconCube  size={24} /> },
                                ]}
                                style={{
                                    position:'absolute',
                                    zIndex:1000,
                                    right:'20px',
                                    top:'400px',
                                }}
                                onChange={handleViewChange}
                            />
                            <div style={containerStyle}>
                                {show3Dgraph && (<Graph3D focusOnNode={focusOnNode}  graphData={graphData}  colourPalette={colourPalette} />)}
                                {show2Dgraph && (<Graph2D focusOnNode={focusOnNode}  graphData={graphData}  colourPalette={colourPalette} />)}
                                {focusNode && (<Panel focusNode={focusNode} graphData={graphData} open={open} onClose={onClose} colourPalette={colourPalette} />)}
                            </div>
                            <Stats stats={graphData.stats} />
                        </Content>
                    </Layout>
                </ConfigProvider>
            )}
        </>
    );
}

export default App;
import { useState } from 'react';
import './App.css';
import Graph3D from './components/Graph3D';
import Navbar from './components/Navbar';
import data from './data/graph_partition_data.json';
import Panel from './components/Panel';


function App() {
  const [focusNode, setFocusNode] = useState(null);
  const [graphData, setGraphData] = useState(data);

  const colourPalette = {
    0: "#8D3B72",
    1: "#DFB841",
    2: "#A89AB7",
    3: "#782A34",
    4: "#A0C0D7",
    5: "#DE7456",
    6: "#F3D8C7",
    7: "#76A491",
  };

  const focusOnNode = (node) => {
    const distance = 50;
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
    const newPos = node.x || node.y || node.z
      ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
      : { x: 0, y: 0, z: distance };
    setFocusNode(node);
    console.log("New Camera Position:", newPos);
  };

  const handleSearch = (searchTerm) => {
    const foundNode = graphData.nodes.find(n => n.name === searchTerm);
    focusOnNode(foundNode);
  };

  return (
    <div className="App">
      <link href="https://fonts.googleapis.com/css2?family=Aptos:wght@400;700&display=swap" rel="stylesheet"></link>
      <Navbar focusNode={focusNode} handleSearch={handleSearch} setGraphData={setGraphData} graphData={graphData}></Navbar>
      <Graph3D setFocusNode={setFocusNode} colourPalette={colourPalette} graphData={graphData}></Graph3D>
      {focusNode && <Panel node={focusNode} colourPalette={colourPalette} data={graphData.nodes}/>}
    </div>
  );
}

export default App;

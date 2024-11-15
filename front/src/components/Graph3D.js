import React, { useEffect, useRef } from 'react';
import ForceGraph3D from '3d-force-graph';
import * as d3 from 'd3';
import * as THREE from 'three';


function getFeatureNumber(id, graphData) {
  let n = 0;
  for (const l of graphData.links) {
    if (l.source.id === id || l.target.id === id) {
      n++;
    }
  }
  return n;
}

const Graph3D = ({setFocusNode, graphData, colourPalette}) => {
  const graphRef = useRef();

  useEffect(() => {
    const Graph = ForceGraph3D()(graphRef.current);

    Graph.graphData(graphData)
      .backgroundColor("#171717")
      .nodeColor(node => colourPalette[node.group] || "#ccc")
      .nodeOpacity(1)
      .nodeResolution(32)
      .nodeLabel('name')
      .nodeVal(node => Math.max(1, getFeatureNumber(node.id, graphData)))
      .linkOpacity(link => Math.min(link.weight / 10, 1))
      .linkThreeObject(link => {
        const startColor = d3.color(colourPalette[link.source.group] || "#ccc");
        const endColor = d3.color(colourPalette[link.target.group] || "#ccc");

        const colors = new Float32Array([
          startColor.r / 255, startColor.g / 255, startColor.b / 255,
          endColor.r / 255, endColor.g / 255, endColor.b / 255
        ]);

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(2 * 3), 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.LineBasicMaterial({
          vertexColors: true,
          transparent: true,
          opacity: Math.min(link.weight / 10, 1),
          linewidth: 2
        });

        return new THREE.Line(geometry, material);
      })
      .linkPositionUpdate((line, { start, end }) => {
        const startR = Graph.nodeRelSize();
        const endR = Graph.nodeRelSize();
        const lineLen = Math.sqrt(
          ['x', 'y', 'z'].map(dim => Math.pow((end[dim] || 0) - (start[dim] || 0), 2))
            .reduce((acc, v) => acc + v, 0)
        );

        const linePos = line.geometry.getAttribute('position');
        linePos.set([startR / lineLen, 1 - endR / lineLen].map(t =>
          ['x', 'y', 'z'].map(dim => start[dim] + (end[dim] - start[dim]) * t)
        ).flat());
        linePos.needsUpdate = true;
        return true;
      })
      .linkWidth(0.2)
      .onNodeClick(node => {
        const distance = 50;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
        const newPos = node.x || node.y || node.z
          ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
          : { x: 0, y: 0, z: distance };
        setFocusNode(node);
        Graph.cameraPosition(newPos, node, 3000);
      });

    return () => {
      Graph.pauseAnimation();
    };
  }, []);

  return <div ref={graphRef} style={{ height: '600px' }}/>;
};

export default Graph3D;

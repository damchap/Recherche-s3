import React, { memo, useEffect, useRef } from 'react';
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

const Graph3D = memo(({ focusOnNode, graphData, colourPalette }) => {
    const graphRef = useRef();
    const graphInstance = useRef(null);

    useEffect(() => {
        if (!graphRef.current) return;

        const Graph = ForceGraph3D()(graphRef.current)
            .backgroundColor(colourPalette.graph.bg)
            .nodeColor(node => colourPalette.graph.nodes[node.group] || "#ccc")
            .nodeOpacity(1)
            .nodeResolution(32)
            .nodeLabel('name')
            .nodeVal(node => Math.max(1, getFeatureNumber(node.id, graphData)))
            .linkOpacity(link => Math.min(link.weight / 10, 1))
            .linkThreeObject(link => {
                const startColor = d3.color(colourPalette.graph.nodes[link.source.group] || "#ccc");
                const endColor = d3.color(colourPalette.graph.nodes[link.target.group] || "#ccc");

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
            .linkWidth(0.2)
            .onNodeClick(node => {
                const distance = 60;
                const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
                const newPos = {
                    x: node.x * distRatio,
                    y: node.y * distRatio,
                    z: node.z * distRatio,
                };
                focusOnNode(node);
                Graph.cameraPosition(newPos, node, 3000);
            });

        graphInstance.current = Graph;

        return () => {
            Graph.pauseAnimation();
        };
    }, []);

    useEffect(() => {
        if (graphInstance.current) {
            graphInstance.current.graphData(graphData);
        }
    }, [graphData, colourPalette]);
    return (
        <div>
            <div className="graph-container" ref={graphRef} style={{ height: `${window.innerHeight}px` }} />
        </div>
    );
});

export default Graph3D;
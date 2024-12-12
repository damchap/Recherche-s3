import React, { memo, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

function getFeatureNumber(id, graphData) {
    let n = 5;
    for (const l of graphData.links) {
        if (l.source.id === id || l.target.id === id) {
            n++;
        }
    }
    return n / 3;
}

const Graph2D = memo(({ focusOnNode, graphData, colourPalette }) => {
    const svgRef = useRef();
    const graphInstance = useRef(null); // Store graph-related references
    const [hoveredNode, setHoveredNode] = useState(null); // Track the hovered node

    useEffect(() => {
        if (!svgRef.current) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .style("background-color", colourPalette.graph.bg);

        const zoomLayer = svg.append("g");

        const zoom = d3.zoom().on("zoom", (event) => {
            zoomLayer.attr("transform", event.transform);
        });

        svg.call(zoom);

        graphInstance.current = { svg, zoomLayer };

        return () => {
            svg.selectAll("*").remove(); // Cleanup on unmount
        };
    }, [colourPalette]);

    useEffect(() => {
        if (!graphInstance.current) return;
        const { svg, zoomLayer } = graphInstance.current;

        zoomLayer.selectAll("*").remove();

        const width = window.innerWidth;
        const height = window.innerHeight;

        const simulation = d3
            .forceSimulation(graphData.nodes)
            .force(
                "link",
                d3.forceLink(graphData.links).id((d) => d.id).distance(50)
            )
            .force("charge", d3.forceManyBody().strength(-100))
            .force("center", d3.forceCenter(width / 2, height / 2));

        const link = zoomLayer
            .append("g")
            .selectAll("line")
            .data(graphData.links)
            .join("line")
            .attr("stroke", (link) =>
                colourPalette.graph.nodes[link.source.group] || colourPalette.graph.nodes[link.target.group] || "#999"
            )
            .attr("stroke-opacity", 0.6)
            .attr("stroke-width", (link) => Math.min(link.weight / 10, 2));

        const node = zoomLayer
            .append("g")
            .selectAll("circle")
            .data(graphData.nodes)
            .join("circle")
            .attr("r", (d) => Math.max(1, getFeatureNumber(d.id, graphData)))
            .attr("fill", (d) => colourPalette.graph.nodes[d.group] || "#ccc")
            .call(
                d3.drag()
                    .on("start", dragStarted)
                    .on("drag", dragged)
                    .on("end", dragEnded)
            );

        node.on("mouseover", (event, d) => {
            setHoveredNode(d);
            d3.select(event.target)
                .attr("r", Math.max(1, getFeatureNumber(d.id, graphData)) + 10);
        });

        node.on("mouseout", (event) => {
            setHoveredNode(null);
            d3.select(event.target)
                .attr("r", (d) => Math.max(1, getFeatureNumber(d.id, graphData)));
        });

        node.on("click", (node) => {
            focusOnNode(node.srcElement["__data__"]);
        });

        node.append("title").text((d) => d.name);

        simulation.on("tick", () => {
            link
                .attr("x1", (d) => d.source.x)
                .attr("y1", (d) => d.source.y)
                .attr("x2", (d) => d.target.x)
                .attr("y2", (d) => d.target.y);

            node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
        });

        function dragStarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragEnded(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return () => {
            simulation.stop();
        };
    }, [graphData, colourPalette, focusOnNode]);

    return (
        <div className='svg-graph' style={{backgroundColor: `${colourPalette.graph.bg}`}}>
            <p
                style={{
                    position:'relative',
                    height: "20px",
                    padding: "0px 50px",
                    float: "left",
                    color: `${colourPalette.graph.color}`,
                }}
            >
                {hoveredNode ? hoveredNode.name : " "}
            </p>
            <svg ref={svgRef} />;
        </div>
    );
});

export default Graph2D;
import React from "react";
import {Drawer, Space} from "antd";
import {Radar} from "react-chartjs-2";
import Author from "./Author.js";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const metrics = [
    {
        label:"Degree",
        value:"degree",
    },
    {
        label:"Degree Centrality",
        value:"degree_centrality",
    },
    {
        label:"Betweeness Centrality",
        value:"betweenness_centrality",
    },
    {
        label:"Closeness Centrality",
        value:"closeness_centrality",
    },
    {
        label:"Clustering Centrality",
        value:"clustering_coefficient",
    },
    {
        label:"Publications",
        value:"publications_count",
    }
];

const Panel = ({ focusNode, graphData, open, onClose, colourPalette}) => {

    const getRadarChartData = (data) => {
        const radar = [];
        for (const m of metrics) {
            radar.push((data[m.value] / graphData.max[m.value]) * 100)
        }
        return radar;
    }

    const radarChartData = {
        labels: ["Degree", "Degree Centrality", "Betweeness Centrality", "Closeness Centrality", "Clustering Centrality", "Publications"],
        datasets: [
            {
                label: focusNode?.name || "Data",
                data: focusNode ? getRadarChartData(focusNode) : [0, 0, 0, 0, 0, 0],
                backgroundColor: "rgba(34, 202, 236, 0.2)",
                borderColor: "rgba(34, 202, 236, 1)",
                borderWidth: 2,
                pointBackgroundColor: "rgba(34, 202, 236, 1)",
            },
            {
                label: `Group ${focusNode?.group}` || "Data",
                data: focusNode ? getRadarChartData(graphData.average[focusNode.group]) : [0, 0, 0, 0, 0, 0],
                backgroundColor: "rgba(202, 34, 236, 0.2)",
                borderColor: "rgba(202, 34, 236, 1)",
                borderWidth: 2,
                pointBackgroundColor: "rgba(202, 34, 236, 1)",
            },
            {
                label: "Average",
                data: graphData.average ? getRadarChartData(graphData.average.overall)  : [0, 0, 0, 0, 0, 0],
                backgroundColor: "rgba(236, 201, 34, 0.5)",
                borderColor: "rgba(236, 201, 34, 1)",
                borderWidth: 2,
                pointBackgroundColor: "rgba(236, 201, 34, 1)",
            },
        ],
    };

    const getRadarLabel = (value, label) => {
        const m = metrics.find(m => m.label === label).value;
        return value * graphData.max[m] / 100;
    }

    const options = {
        scales: {
            r: {
                beginAtZero: true,
                ticks: {
                    display: false,
                },
                pointLabels: {
                    display: false,
                },
                grid: {
                    color: colourPalette.radar,
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `Value: ${getRadarLabel(context.raw, context.label).toFixed(2)}`;
                    },
                },
            },
        }
    };

    return (
        <Drawer
            title={focusNode?.name}
            placement="right"
            closable={true}
            onClose={onClose}
            open={open}
            mask={false}
            getContainer={false}
        >
            <Space direction='vertical' size={90} >
                <Radar options={options} data={radarChartData} />
                <Author author={focusNode} colourPalette={colourPalette} />
            </Space>
        </Drawer>

    );
};

export default Panel;

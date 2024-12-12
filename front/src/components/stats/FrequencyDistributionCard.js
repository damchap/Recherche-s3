import React from "react";
import { Card } from "antd";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FrequencyDistributionCard = ({ degreeDistribution }) => {

    const frequencyMap = degreeDistribution.reduce((acc, degree) => {
        acc[degree] = (acc[degree] || 0) + 1;
        return acc;
    }, {});

    const degrees = Object.keys(frequencyMap).map(Number).sort((a, b) => a - b);
    const frequencies = degrees.map(degree => frequencyMap[degree]);

    const data = {
        labels: degrees,
        datasets: [
            {
                label: "Frequency",
                data: frequencies,
                backgroundColor: "#3A3A3A",
                borderColor: "#000",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
        },
        scales: {
            x: { title: { display: false, text: "Degree" } },
            y: { title: { display: false, text: "Frequency" } },
        },
    };

    return (
        <Card title="Graph stats" style={{ width: 400 }}>
            <div style={{ width: "350px", height: "100px", maxWidth: "600px" }}>
                <Bar data={data} options={options} />
            </div>
        </Card>
    );
};

export default FrequencyDistributionCard;
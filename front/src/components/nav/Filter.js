import { Drawer, Space, Button, Form, Slider, Switch, DatePicker } from "antd";
import dayjs from 'dayjs';
import AuthorSelect from "./AuthorSelect";
import { useState } from "react";

function formatNames(names, groups) {
    const formattedNames = [];
    const regex = /group_id_([0-9]+)/i;

    for (const n of names) {
        const match = n.match(regex);
        if (match) {
            const group = groups.find(g => g.value === n);
            formattedNames.push(...(group.children.map(c => c.title)));
        } else {
            formattedNames.push(n);
        }
    }

    return formattedNames;
}

const Filter = ({open, setOpen, maxValues, groups, setFilters}) => {

    const [selectedCollaborations, setSelectedCollaborations] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [degreeRange, setDegreeRange] = useState([0, maxValues.degree]);
    const [publicationsRange, setPublicationsRange] = useState([0, maxValues.publications_count]);
    const [degreeCentralityRange, setDegreeCentralityRange] = useState([0, maxValues.degree_centrality]);
    const [betweennessCentralityRange, setBetweennessCentralityRange] = useState([0, maxValues.betweenness_centrality]);
    const [closenessCentralityRange, setClosenessCentralityRange] = useState([0, maxValues.closeness_centrality]);
    const [clusteringCoefficientRange, setClusteringCoefficientRange] = useState([0, maxValues.clustering_coefficient]);
    const [recalculateGraph, setRecalculateGraph] = useState(true);
    const [dateRange, setDateRange] = useState({ start: maxValues.minDate, end: maxValues.maxDate });

    const handleDateChange = (newValue) => {
        setDateRange({
            start:`${newValue[0]['$y']}-${newValue[0]['$M']+1}-${newValue[0]['$D']}`,
            end: `${newValue[1]['$y']}-${newValue[1]['$M']+1}-${newValue[1]['$D']}`
        });
    };

    const handleDegreeChange = (newValue) => {
        setDegreeRange(newValue);
    };

    const handlePublicationsChange = (newValue) => {
        setPublicationsRange(newValue);
    };

    const handleDegreeCentralityChange = (newValue) => {
        setDegreeCentralityRange(newValue);
    };

    const handleBetweennessCentralityChange = (newValue) => {
        setBetweennessCentralityRange(newValue);
    };

    const handleClosenessCentralityChange = (newValue) => {
        setClosenessCentralityRange(newValue);
    };

    const handleClusteringCoefficientChange = (newValue) => {
        setClusteringCoefficientRange(newValue);
    };

    const handleRecalculateChange = (newValue) => {
        setRecalculateGraph(newValue);
    };

    const handleSubmit = () => {

        const newFilters = {
            names: formatNames(selectedAuthors, groups),
            collaborators: formatNames(selectedCollaborations, groups),

            publicationsMin: publicationsRange[0],
            publicationsMax: publicationsRange[1],

            degreeMin: degreeRange[0],
            degreeMax: degreeRange[1],

            degreeCentralityMin: degreeCentralityRange[0],
            degreeCentralityMax: degreeCentralityRange[1],

            betweennessCentralityMin: betweennessCentralityRange[0],
            betweennessCentralityMax: betweennessCentralityRange[1],

            closenessCentralityMin: closenessCentralityRange[0],
            closenessCentralityMax: closenessCentralityRange[1],

            clusteringCoefficientMin: clusteringCoefficientRange[0],
            clusteringCoefficientMax: clusteringCoefficientRange[1],

            recalculateGraph: recalculateGraph,

            dateMin: dateRange.start,
            dateMax: dateRange.end,
        };

        setFilters(newFilters);
        setOpen(false);
    }

    const onClose = () => {
        setOpen(false);
    };

    return (
        <Drawer
            title="Apply filters"
            width={400}
            placement='left'
            onClose={onClose}
            open={open}
            styles={{
                body: {
                    paddingBottom: 80,
                },
            }}
            extra={
                <Space>
                    <Button onClick={handleSubmit} type="primary">
                        Submit
                    </Button>
                </Space>
            }
        >
            <Form layout="vertical">
                <Space direction="vertical" size="small" style={{ display: 'flex', }}>
                    <Form.Item label="Author(s)">
                        <AuthorSelect value={selectedAuthors} setValue={setSelectedAuthors} treeData={groups}/>
                    </Form.Item>

                    <Form.Item label="Publications">
                        <Slider  range={{ draggableTrack: true,}} defaultValue={[0, maxValues.publications_count || 1000]}  min={0} max={maxValues.publications_count} step={1} onChangeComplete={handlePublicationsChange}/>
                    </Form.Item>

                    <Form.Item label="Collaborator(s)">
                        <AuthorSelect value={selectedCollaborations} setValue={setSelectedCollaborations} treeData={groups}/>
                    </Form.Item>

                    <Form.Item label="Date">
                        <DatePicker.RangePicker style={{ width: '1O0%', }} defaultValue={[dayjs(maxValues.minDate), dayjs(maxValues.maxDate)]} getPopupContainer={(trigger) => trigger.parentElement} minDate={maxValues.dateMin} maxDate={maxValues.dateMax} onChange={handleDateChange} />
                    </Form.Item>

                    <Form.Item label="Degree">
                        <Slider  range={{ draggableTrack: true,}} defaultValue={[0, maxValues.degree || 1000]} min={0} max={maxValues.degree} step={1} onChangeComplete={handleDegreeChange} />
                    </Form.Item>

                    <Form.Item label="Degree centrality">
                        <Slider  range={{ draggableTrack: true,}} defaultValue={[0, 1]} min={0} max={maxValues.degree_centrality} step={0.01} onChangeComplete={handleDegreeCentralityChange} />
                    </Form.Item>

                    <Form.Item label="Betweeness centrality">
                        <Slider  range={{ draggableTrack: true,}} defaultValue={[0, 1]} min={0} max={maxValues.betweenness_centrality} step={0.01} onChangeComplete={handleBetweennessCentralityChange} />
                    </Form.Item>

                    <Form.Item label="Closeness centrality">
                        <Slider  range={{ draggableTrack: true,}} defaultValue={[0, 1]} min={0} max={maxValues.closeness_centrality} step={0.01} onChangeComplete={handleClosenessCentralityChange} />
                    </Form.Item>

                    <Form.Item label="Clustering coefficient">
                        <Slider  range={{ draggableTrack: true,}} defaultValue={[0, 1]} min={0} max={maxValues.clustering_coefficient} step={0.01} onChangeComplete={handleClusteringCoefficientChange} />
                    </Form.Item>

                    <Form.Item label="Recalculate graph">
                        <Switch defaultChecked onChange={handleRecalculateChange}/>
                    </Form.Item>
                </Space>
            </Form>
        </Drawer>
    );
};

export default Filter;
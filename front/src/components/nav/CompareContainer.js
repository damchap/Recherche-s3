import React from 'react';
import { Row, Col, Typography, Space } from 'antd';

const { Title, Text } = Typography;

const CompareContainer = ({ focusNode, selectedAuthor, colourPalette }) => {

    const style = {
        textAlign: 'center'
    };

    const supStyle = {
        textAlign: 'center',
        backgroundColor: 'darkgreen',
        borderRadius: '25px',
        color: 'white',
        padding: '0px 10px',
        width: '50px',
    };

    const focusGroupStyle = {
        textAlign: 'center',
        backgroundColor: colourPalette[focusNode.group],
        borderRadius: '25px',
        color: 'white',
        padding: '0px 10px',
        width: '50px',
    };

    const selectedGroupStyle = {
        textAlign: 'center',
        backgroundColor: selectedAuthor ? colourPalette[selectedAuthor.group] : 'none',
        borderRadius: '25px',
        color: selectedAuthor ? 'white' : 'black',
        padding: '0px 10px',
        width: '50px',
    };

    const metrics = [
        { key: 'degree_centrality', label: 'Degree Centrality' },
        { key: 'betweenness_centrality', label: 'Betweenness Centrality' },
        { key: 'closeness_centrality', label: 'Closeness Centrality' },
        { key: 'clustering_coefficient', label: 'Clustering Coefficient' },
    ];

    return (
        <div className="compare-container">
            <Space direction="vertical" size="large" style={{ display: 'flex',}}>
                <Row justify="center">
                    <Col span={8} style={{textAlign: 'center'}}><Title level={4} style={style}>{focusNode?.name || 'N/A'}</Title></Col>
                    <Col span={8} offset={8} style={{textAlign: 'center'}}><Title level={4} style={style}>{selectedAuthor?.name || 'N/A'}</Title></Col>
                </Row>

                <Space direction="vertical" size="middle" style={{ display: 'flex',}}>
                    <Row justify="center">
                        <Col span={8} style={{textAlign: 'center'}}><Text strong style={focusNode && selectedAuthor ? focusNode.publications_count > selectedAuthor.publications_count ? supStyle : style : style}> {focusNode?.publications_count || 'N/A'}</Text></Col>
                        <Col span={8} style={{textAlign: 'center'}}><Text>Publications</Text></Col>
                        <Col span={8} style={{textAlign: 'center'}}><Text strong style={focusNode && selectedAuthor ? selectedAuthor.publications_count > focusNode.publications_count ? supStyle : style : style}>{selectedAuthor?.publications_count || 'N/A'}</Text></Col>
                    </Row>

                    <Row justify="center">
                        <Col span={8} style={{textAlign: 'center'}}><Text strong style={focusGroupStyle}>{focusNode?.group ?? 'N/A'}</Text></Col>
                        <Col span={8} style={{textAlign: 'center'}}><Text>Group</Text></Col>
                        <Col span={8} style={{textAlign: 'center'}}><Text strong style={selectedGroupStyle}>{selectedAuthor?.group ?? 'N/A'}</Text></Col>
                    </Row>

                    <Row justify="center">
                        <Col span={8} style={{textAlign: 'center'}}><Text strong>{focusNode?.most_frequent_collaborator || 'N/A'}</Text></Col>
                        <Col span={8} style={{textAlign: 'center'}}><Text>Most collaborations</Text></Col>
                        <Col span={8} style={{textAlign: 'center'}}><Text strong>{selectedAuthor?.most_frequent_collaborator || 'N/A'}</Text></Col>
                    </Row>

                    <Row justify="center">
                        <Col span={8} style={{textAlign: 'center'}}><Text strong style={focusNode && selectedAuthor ? focusNode.degree > selectedAuthor.degree ? supStyle : style : style}>{focusNode?.degree || 'N/A'}</Text></Col>
                        <Col span={8} style={{textAlign: 'center'}}><Text>Degree</Text></Col>
                        <Col span={8} style={{textAlign: 'center'}}><Text strong style={focusNode && selectedAuthor ? selectedAuthor.degree > focusNode.degree ? supStyle : style : style}>{selectedAuthor?.degree || 'N/A'}</Text></Col>
                    </Row>

                    {metrics.map(metric => (
                        <Row justify="center">
                            <Col span={8} style={{textAlign: 'center'}}><Text strong style={focusNode && selectedAuthor ? focusNode[metric.key] > selectedAuthor[metric.key] ? supStyle : style : style}>{focusNode ? focusNode[metric.key].toFixed(2) : 'N/A'}</Text></Col>
                            <Col span={8} style={{textAlign: 'center'}}><Text>{metric.label}</Text></Col>
                            <Col span={8} style={{textAlign: 'center'}}><Text strong style={focusNode && selectedAuthor ? selectedAuthor[metric.key] > focusNode[metric.key] ? supStyle : style : style}>{selectedAuthor ? selectedAuthor[metric.key].toFixed(2) : 'N/A'}</Text></Col>
                        </Row>
                    ))}
                </Space>
            </Space>
        </div>
    );
};

export default CompareContainer;
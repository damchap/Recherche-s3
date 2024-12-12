import React from 'react';
import { Carousel, Card, Flex, Typography } from 'antd';
import { IconGrain } from '@tabler/icons-react';
import ClusterIcon from '../icons/ClusterIcon';
import GlobeIcon from '../icons/GlobeIcon';
import LinkIcon from '../icons/LinkIcon';
import RulerIcon from '../icons/RulerIcon';
import CompassIcon from '../icons/CompassIcon';
import FootstepsIcon from '../icons/FootstepsIcon';
import PuzzleIcon from '../icons/PuzzleIcon';
import HandshakeIcon from '../icons/HandshakeIcon';
import DegreeIcon from '../icons/DegreeIcon';
import FrequencyDistributionCard from './FrequencyDistributionCard';

const { Title, Text } = Typography;

const Stats = ({stats}) => {

    return (
        <Carousel autoplay effect='fade' style={{position:'absolute', left:'50px', bottom: '100px', width:'400px', height:'205px'}}>
            <Card title="Graph stats" color='#3A3A3A' style={{ width: 600, height:'305px' }} >
                <Flex justify='space-around'>
                    <Flex vertical align='center' justify='center'>
                        <GlobeIcon size={35} />
                        <Title style={{margin:'0px'}} level={2}>{stats.node_number}</Title>
                        <Title style={{margin:'0px'}} level={5}>nodes</Title>
                    </Flex>
                    <Flex vertical align='center' justify='center'>
                        <LinkIcon size={35} />
                        <Title style={{margin:'0px'}} level={2}>{stats.edge_number}</Title>
                        <Title style={{margin:'0px'}} level={5}>links</Title>
                    </Flex>
                </Flex>
            </Card>
            <Card title="Graph stats" color='#3A3A3A' style={{ width: 600, height:305 }} >
                <Flex justify='space-around'>
                    <Flex vertical align='center' justify='center'>
                        <IconGrain color='#BBCB7F' size={35} />
                        <Title style={{margin:'0px'}} level={2}>{stats.density.toFixed(2)}</Title>
                        <Title style={{margin:'0px'}} level={5}>density</Title>
                    </Flex>
                    <Flex vertical align='center' justify='center'>
                        <DegreeIcon size={35} />
                        <Title style={{margin:'0px'}} level={2}>{stats.average_degree.toFixed(2)}</Title>
                        <Text strong style={{margin:'0px', textAlign:'center', fontSize:'12px', textWrap:'wrap', width:'100px'}} level={5}>average degree</Text>
                    </Flex>
                </Flex>
            </Card>

            <FrequencyDistributionCard degreeDistribution={stats.degree_distribution} />

            <Card title="Graph stats" color='#3A3A3A' style={{ width: 600, height:305 }} >
                <Flex justify='space-around'>
                    <Flex vertical align='center' justify='center'>
                        <RulerIcon size={35} />
                        <Title style={{margin:'0px'}} level={2}>{stats.diameter || 'N/A'}</Title>
                        <Title style={{margin:'0px'}} level={5}>diameter</Title>
                    </Flex>
                    <Flex vertical align='center' justify='center'>
                        <CompassIcon size={35} />
                        <Title style={{margin:'0px'}} level={2}>{stats.radius || 'N/A'}</Title>
                        <Title style={{margin:'0px'}} level={5}>radius</Title>
                    </Flex>
                </Flex>
            </Card>

            <Card title="Graph stats" color='#3A3A3A' style={{ width: 600, height:305 }} >
                <Flex justify='space-around'>
                    <Flex vertical align='center' justify='center'>
                        <ClusterIcon size={35} />
                        <Title style={{margin:'0px'}} level={2}>{stats.clustering_coefficient.toFixed(2)}</Title>
                        <Text strong style={{margin:'0px', textAlign:'center', fontSize:'12px', textWrap:'wrap', width:'100px'}} level={5}>clustering coefficient</Text>
                    </Flex>
                    <Flex vertical align='center' justify='center'>
                        <FootstepsIcon size={35} />
                        <Title style={{margin:'0px'}} level={2}>{stats.average_path_length ? stats.average_path_length.toFixed(2) : 'N/A'}</Title>
                        <Text strong style={{margin:'0px', textAlign:'center', fontSize:'12px', textWrap:'wrap', width:'100px'}} level={5}>average path length</Text>
                    </Flex>
                </Flex>
            </Card>

            <Card title="Graph stats" color='#3A3A3A' style={{ width: 600, height:305 }} >
                <Flex justify='space-around'>
                    <Flex vertical align='center' justify='center'>
                        <PuzzleIcon size={35} />
                        <Title style={{margin:'0px'}} level={2}>{stats.modularity.toFixed(2)}</Title>
                        <Title style={{margin:'0px'}} level={5}>modularity</Title>
                    </Flex>
                    <Flex vertical align='center' justify='center'>
                        <HandshakeIcon size={40} />
                        <Title style={{margin:'0px'}} level={2}>{stats.assortativity.toFixed(2)}</Title>
                        <Title style={{margin:'0px'}} level={5}>assortativity</Title>
                    </Flex>
                </Flex>
            </Card>
        </Carousel>
    );
};
export default Stats;
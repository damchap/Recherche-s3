import { Space, Tag, Typography } from "antd";

const { Text } = Typography;

function getDateString(dateString) {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    return date.toLocaleDateString('fr-FR', options);
}

const Author = ({author, colourPalette}) => {
    console.log(colourPalette);
    return (
        <Space direction="vertical" size={'large'}>
            <Space direction="vertical" size={'large'}>
                <Text type="secondary" >Affiliations:</Text>
                {author.team.reduce((rows, domain, index) => {
                    if (index % 2 === 0) {
                        rows.push([]);
                    }
                    rows[rows.length - 1].push(domain);
                    return rows;
                }, []).map((row, rowIndex) => (
                    <Space key={rowIndex} direction="horizontal">
                        {row.map((domain, index) => (
                            <Tag color="grey" key={`${rowIndex}-${index}`}>{domain}</Tag>
                        ))}
                    </Space>
                ))}
                <Space>
                    <Tag color="blue" >L3I</Tag>
                    <Tag color={colourPalette.graph.nodes[author.group]} >{`Group ${author.group}`}</Tag>
                </Space>
            </Space>

            <Space direction="vertical">
                <Text type="secondary">Research Domains/Keywords:</Text>

                {author.domains.reduce((rows, domain, index) => {
                    if (index % 2 === 0) {
                        rows.push([]);
                    }
                    rows[rows.length - 1].push(domain);
                    return rows;
                }, []).map((row, rowIndex) => (
                    <Space key={rowIndex} direction="horizontal">
                        {row.map((domain, index) => (
                            <Tag color="grey" key={`${rowIndex}-${index}`}>{domain}</Tag>
                        ))}
                    </Space>
                ))}
            </Space>

            <Space direction="horizontal">
                <Text type="secondary" >h-index:</Text>
                <Text>{author.h_index}</Text>
            </Space>

            <Space direction="horizontal">
                <Text type="secondary" >First collaboration:</Text>
                <Text>{getDateString(author.min_date)}</Text>
            </Space>

            <Space direction="horizontal">
                <Text type="secondary" >Last collaboration:</Text>
                <Text>{getDateString(author.max_date)}</Text>
            </Space>

            <Space direction="horizontal">
                <Text type="secondary" >Most frequent collaborator:</Text>
                <Tag color={colourPalette.graph.nodes[author.most_frequent_collaborator_group]} >{author.most_frequent_collaborator}</Tag>
            </Space>

        </Space>
    );
};

export default Author;
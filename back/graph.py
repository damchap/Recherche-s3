import networkx as nx
from networkx.algorithms.community import louvain_communities
import json
from collections import Counter, defaultdict
from itertools import combinations
from datetime import datetime
from statistics import mean
import copy
import math
import logging

logging.basicConfig(
    filename="graph.log",
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

data_file_path = './data/graph.json'
article_file_path = './data/articles.json'
graph_state_file_path = './data/states.json'


def load_json(file_path):
    """Loads JSON data from a file."""
    with open(file_path, 'r') as file:
        return json.load(file)


data = load_json(data_file_path)
nodes = data["nodes"]
links = data["links"]

article_data = load_json(article_file_path)
graph_states = load_json(graph_state_file_path)


def extract_features(authors):
    return [list(pair) for pair in combinations(authors, 2)]


def extract_all_features(articles):
    features = []
    for s in articles:
        features.extend(extract_features(s["authors"]))
    return features


def get_valid_authors(features_data):
    """Creates a set of valid author IDs from features data."""
    return {author["id"] for feature in features_data for author in feature}


def build_graph(data, valid_authors):
    """Builds a NetworkX graph from article data."""
    G = nx.Graph()

    for article in data:
        authors = article["authors"]
        release_date = article["releaseDate"]

        filtered_authors = [author for author in authors if author["id"] in valid_authors]

        for i in range(len(filtered_authors)):
            for j in range(i + 1, len(filtered_authors)):
                author1 = filtered_authors[i]
                author2 = filtered_authors[j]

                if G.has_edge(author1["id"], author2["id"]):
                    G[author1["id"]][author2["id"]]['weight'] += 1
                    G[author1["id"]][author2["id"]]['articles'].append({
                        "id": article["id"],
                        "title": article["title"],
                        "date": release_date
                    })
                else:
                    G.add_edge(
                        author1["id"],
                        author2["id"],
                        weight=1,
                        articles=[{
                            "id": article["id"],
                            "title": article["title"],
                            "date": release_date
                        }]
                    )

                G.add_node(author1["id"], name=author1["name"], h_index=author1["hIndex"], domains=author1["domains"], team=author1["team"])
                G.add_node(author2["id"], name=author2["name"], h_index=author2["hIndex"], domains=author2["domains"], team=author2["team"])

    return G


def apply_louvain_partition(G, weight="weight", resolution=1, threshold=0.0000001, max_level=None, seed=None):
    """Applies Louvain community detection."""
    communities = louvain_communities(G, weight=weight, resolution=resolution, threshold=threshold, max_level=max_level,
                                      seed=seed)
    partition = {}
    for community_index, community_nodes in enumerate(communities):
        for node in community_nodes:
            partition[node] = community_index
    return partition


def calculate_metrics(G):
    """Calculates centrality metrics and clustering coefficient."""
    return {
        "degree_centrality": nx.degree_centrality(G),
        "betweenness_centrality": nx.betweenness_centrality(G),
        "closeness_centrality": nx.closeness_centrality(G),
        "clustering_coefficient": nx.clustering(G)
    }


def format_graph_data(G, partition, metrics):
    """Formats the graph data into a dictionary for export."""
    graph_data = {
        "nodes": [],
        "links": [],
        "max": {},
        "stats": {},
        "average": {}
    }

    max_values = {
        "degree": 0,
        "degree_centrality": 0,
        "betweenness_centrality": 0,
        "closeness_centrality": 0,
        "clustering_coefficient": 0,
        "publications_count": 0,
    }

    min_date = None
    max_date = None

    group_sums = defaultdict(lambda: defaultdict(float))
    group_counts = defaultdict(int)
    overall_sums = defaultdict(float)
    overall_count = 0

    community_groups = defaultdict(list)
    for node, community in partition.items():
        community_groups[community].append(node)

    community_list = list(community_groups.values())

    for node in G.nodes:
        collaborations = Counter()
        publications_count = 0
        node_min_date = None
        node_max_date = None

        for neighbor in G.neighbors(node):
            collaborations[neighbor] = G[node][neighbor]['weight']
            publications_count += G[node][neighbor]['weight']

            for article in G[node][neighbor]['articles']:
                print(article)
                article_date = datetime.strptime(article['date'], '%Y-%m-%d')
                if node_min_date is None or article_date < node_min_date:
                    node_min_date = article_date
                if node_max_date is None or article_date > node_max_date:
                    node_max_date = article_date

        if collaborations:
            most_frequent_collaborator_id, max_collaborations = collaborations.most_common(1)[0]
            most_frequent_collaborator_name = G.nodes[most_frequent_collaborator_id]["name"]
            most_frequent_collaborator_group = partition[most_frequent_collaborator_id]
        else:
            most_frequent_collaborator_name = None
            most_frequent_collaborator_group = None

        node_data = {
            "id": node,
            "name": G.nodes[node]['name'],
            "h_index": G.nodes[node]['h_index'],
            "domains": G.nodes[node]['domains'],
            "team": G.nodes[node]['team'],
            "group": partition[node],
            "degree": G.degree(node),
            "degree_centrality": metrics["degree_centrality"][node],
            "betweenness_centrality": metrics["betweenness_centrality"][node],
            "closeness_centrality": metrics["closeness_centrality"][node],
            "clustering_coefficient": metrics["clustering_coefficient"][node],
            "most_frequent_collaborator": most_frequent_collaborator_name,
            "most_frequent_collaborator_group": most_frequent_collaborator_group,
            "publications_count": publications_count,
            "min_date": node_min_date.strftime('%Y-%m-%d') if node_min_date else None,
            "max_date": node_max_date.strftime('%Y-%m-%d') if node_max_date else None
        }
        graph_data["nodes"].append(node_data)

        for key in max_values:
            max_values[key] = max(math.ceil(max_values[key] * 100) / 100, (node_data[key] * 100) / 100)

        group = partition[node]
        group_counts[group] += 1
        overall_count += 1
        for key in ["degree", "degree_centrality", "betweenness_centrality", "closeness_centrality",
                    "clustering_coefficient", "publications_count"]:
            group_sums[group][key] += node_data[key]
            overall_sums[key] += node_data[key]

    for group, counts in group_counts.items():
        graph_data["average"][group] = {
            key: group_sums[group][key] / counts for key in group_sums[group]
        }

    graph_data["average"]["overall"] = {
        key: overall_sums[key] / overall_count for key in overall_sums
    }

    for edge in G.edges:
        graph_data["links"].append({
            "source": edge[0],
            "target": edge[1],
            "weight": G[edge[0]][edge[1]]['weight'],
            "articles": G[edge[0]][edge[1]].get('articles', [])
        })

        for article in G[edge[0]][edge[1]].get('articles', []):
            article_date = datetime.strptime(article['date'], '%Y-%m-%d')
            if min_date is None or article_date < min_date:
                min_date = article_date
            if max_date is None or article_date > max_date:
                max_date = article_date

    max_values['minDate'] = min_date.strftime('%Y-%m-%d') if min_date else None
    max_values['maxDate'] = max_date.strftime('%Y-%m-%d') if max_date else None
    graph_data["max"] = max_values

    stats = {
        "node_number": G.number_of_nodes(),
        "edge_number": G.number_of_edges(),
        "density": nx.density(G),
        "average_degree": mean(dict(G.degree()).values()),
        "degree_distribution": [d for _, d in G.degree()],
        "diameter": nx.diameter(G) if nx.is_connected(G) else None,
        "radius": nx.radius(G) if nx.is_connected(G) else None,
        "clustering_coefficient": nx.average_clustering(G),
        "average_path_length": nx.average_shortest_path_length(G) if nx.is_connected(G) else None,
        "modularity": nx.community.modularity(G, community_list),
        "assortativity": nx.degree_assortativity_coefficient(G),
        "connexity": nx.is_connected(G)
    }

    graph_data["stats"] = stats

    return graph_data


def graph(articles):
    """Main function to orchestrate the graph-building process."""
    if type(articles) == str:
        data = load_json(articles)
    else:
        data = articles

    features_data = extract_all_features(data)
    valid_authors = get_valid_authors(features_data)
    G = build_graph(data, valid_authors)
    partition = apply_louvain_partition(G)
    metrics = calculate_metrics(G)
    graph_data = format_graph_data(G, partition, metrics)
    return graph_data


def filter_graph_data(filters):
    logging.info("Starting filter_graph_data...")
    local_data = copy.deepcopy(data)
    local_article_data = copy.deepcopy(article_data)

    def filter_nodes(node):
        try:
            return (
                    filters["betweennessCentralityMin"] <= node["betweenness_centrality"] <= filters[
                "betweennessCentralityMax"] and
                    filters["closenessCentralityMin"] <= node["closeness_centrality"] <= filters[
                        "closenessCentralityMax"] and
                    filters["clusteringCoefficientMin"] <= node["clustering_coefficient"] <= filters[
                        "clusteringCoefficientMax"] and
                    filters["degreeCentralityMin"] <= node["degree_centrality"] <= filters["degreeCentralityMax"] and
                    filters["degreeMin"] <= node["degree"] <= filters["degreeMax"] and
                    filters["publicationsMin"] <= node["publications_count"] <= filters["publicationsMax"] and
                    (filters["names"] == [] or node["name"] in filters["names"]) and
                    (filters["collaborators"] == [] or node["most_frequent_collaborator"] in filters["collaborators"])
            )
        except Exception as e:
            logging.error(f"Error in filter_nodes with node {node}: {e}")
            raise

    def filter_links(link):
        try:
            if link["source"] not in node_ids or link["target"] not in node_ids:
                return False

            valid_articles = []
            for article in link["articles"]:
                if filters["dateMin"] <= article["date"] <= filters["dateMax"]:
                    valid_articles.append(article)

            if not valid_articles:
                return False

            link["articles"] = valid_articles
            link["weight"] = len(valid_articles)
            return True
        except Exception as e:
            logging.error(f"Error in filter_links with link {link}: {e}")
            raise

    def filter_objects(objects):
        try:
            index = 0
            filtered_objects = []
            for obj in objects:
                logging.info(f"Filtering object {index}/{len(objects)}: {obj}")
                index += 1
                if not (filters["dateMin"] <= obj["releaseDate"] <= filters["dateMax"]):
                    logging.debug(f"Object filtered out (date range): {obj}")
                    continue

                obj["authors"] = [author for author in obj["authors"] if author["name"] in filtered_author_names]
                if len(obj["authors"]) < 2:
                    logging.debug(f"Object filtered out (fewer than 2 authors): {obj}")
                    continue

                filtered_objects.append(obj)
            return filtered_objects
        except Exception as e:
            logging.error(f"Error in filter_objects: {e}")
            raise

    try:
        filtered_nodes = [node for node in local_data["nodes"] if filter_nodes(node)]
        node_ids = {node["id"] for node in filtered_nodes}
        filtered_author_names = {node["name"] for node in filtered_nodes}

        filtered_links = [link for link in local_data["links"] if filter_links(link)]
        used_node_ids = {link["source"] for link in filtered_links} | {link["target"] for link in filtered_links}
        filtered_nodes = [node for node in filtered_nodes if node["id"] in used_node_ids]

        if filters["recalculateGraph"]:
            objects = filter_objects(local_article_data)
            recalculated_graph_data = graph(objects)
            with open("./data/filtered_graph.json", "w") as f:
                f.write(json.dumps(recalculated_graph_data))
            return recalculated_graph_data
        else:
            return {
                "nodes": filtered_nodes,
                "links": filtered_links,
                "max": local_data["max"],
                "stats": local_data["stats"],
                "average": local_data["average"],
            }
    except Exception as e:
        logging.error(f"Unhandled error in filter_graph_data: {e}")
        raise


def find_shortest_heaviest_paths(graph_data, source, target):
    """
    Finds the shortest paths (minimal number of edges) between the source and target nodes
    and selects the heaviest path(s) (based on edge weights) among them.

    Args:
        graph_data (dict): Data containing nodes and links information.
        source (str): ID of the source node.
        target (str): ID of the target node.

    Returns:
        list: List of the heaviest shortest paths from source to target.
              Each path is a list of node IDs.
    """
    G = nx.Graph()

    for node in graph_data['nodes']:
        G.add_node(node['id'], **node)

    for link in graph_data['links']:
        G.add_edge(
            link['source'],
            link['target'],
            weight=link.get('weight', 1),
            articles=link.get('articles', [])
        )

    if source not in G or target not in G:
        raise ValueError("Source or target node not found in the graph.")

    shortest_paths = list(nx.all_shortest_paths(G, source=source, target=target))

    path_weights = []
    for path in shortest_paths:
        weight_sum = sum(G[path[i]][path[i + 1]]['weight'] for i in range(len(path) - 1))
        path_weights.append((path, weight_sum))

    max_weight = max(path_weights, key=lambda x: x[1])[1]

    heaviest_paths = [path for path, weight in path_weights if weight == max_weight]

    return heaviest_paths


def filter_graph_data_for_path(graph_data, path):
    """
    Filters the original graph_data to include only the nodes and links
    used in the specified path.

    Args:
        graph_data (dict): Original graph data with nodes and links.
        path (list): List of node IDs representing the path.

    Returns:
        dict: Filtered graph data containing only the nodes and links in the path.
    """
    logging.info(f"Graph data ({graph_data.keys()}): {graph_data}")

    path_nodes = set(path)
    logging.info(f"Path nodes ({len(path_nodes)}): {path_nodes}")

    filtered_nodes = [node for node in graph_data['nodes'] if node['id'] in path_nodes]
    logging.info(f"Filtered nodes ({len(filtered_nodes)}): {filtered_nodes}")

    path_links = set(zip(path[:-1], path[1:]))
    filtered_links = [
        link for link in graph_data['links']
        if (link['source'], link['target']) in path_links or (link['target'], link['source']) in path_links
    ]
    logging.info(f"Filtered links ({len(filtered_links)}): {filtered_links}")
    return {
        "nodes": filtered_nodes,
        "links": filtered_links,
        "max": graph_data["max"],
        "stats": graph_data["stats"],
        "average": graph_data["average"],
    }


def get_cluster(focus_node):
    logging.info("Starting get_cluster function...")
    logging.info(f"Focus node: {focus_node}")

    graph_data = copy.deepcopy(data)

    try:
        filtered_links = [
            link for link in graph_data["links"]
            if (
                    (isinstance(link["source"], dict) and link["source"].get("id") == focus_node["id"]) or
                    (link["source"] == focus_node["id"]) or
                    (isinstance(link["target"], dict) and link["target"].get("id") == focus_node["id"]) or
                    (link["target"] == focus_node["id"])
            )
        ]
        logging.info(f"Filtered links: {len(filtered_links)} found")
        for link in filtered_links:
            logging.info(link)
    except Exception as e:
        logging.error(f"Error filtering links: {e}")
        return {"error": str(e)}

    try:
        uids = set()
        for link in filtered_links:
            source_id = link["source"]["id"] if isinstance(link["source"], dict) else link["source"]
            target_id = link["target"]["id"] if isinstance(link["target"], dict) else link["target"]
            uids.add(source_id)
            uids.add(target_id)
        logging.info(f"Unique IDs collected: {uids}")
    except Exception as e:
        logging.error(f"Error collecting unique IDs: {e}")
        return {"error": str(e)}

    try:
        filtered_nodes = [node for node in graph_data["nodes"] if node["id"] in uids]
        logging.info(f"Filtered nodes: {len(filtered_nodes)} found")
        for node in filtered_nodes:
            logging.info(node)
    except Exception as e:
        logging.error(f"Error filtering nodes: {e}")
        return {"error": str(e)}

    try:
        filtered_graph = {
            "nodes": filtered_nodes,
            "links": filtered_links,
            "max": graph_data['max'],
            "stats": graph_data['stats'],
            "average": graph_data['average']
        }
        logging.info(f"Filtered graph created with {len(filtered_nodes)} nodes and {len(filtered_links)} links.")
        return filtered_graph
    except Exception as e:
        logging.error(f"Error creating filtered graph: {e}")
        return {"error": str(e)}

def get_graph():
    return data

def get_states():
    local_article_data = copy.deepcopy(article_data)
    local_article_data.sort(key=lambda article: article['releaseDate'])

    states = {}
    current_data = []
    current_index = 0

    while current_index < len(local_article_data):
        current_date = local_article_data[current_index]["releaseDate"]
        current_year = current_date[:4]  # Extract the year

        while current_index < len(local_article_data) and local_article_data[current_index]['releaseDate'][:4] == current_year:
            current_data.append(local_article_data[current_index])
            current_index += 1

        current_state = graph(current_data)
        states[current_year] = current_state

    return states

def get_graph_state(state):
    return graph_states[state]
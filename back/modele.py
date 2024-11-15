import json
from collections import defaultdict
import networkx as nx

def load_data(file_path):
    """
    Charge les données depuis un fichier JSON.
    """
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

def extract_authors(label):
    """
    Extrait les auteurs depuis le champ label_s d'une publication.
    """
    authors = label.split(". ")[0]  # Supposons que les auteurs sont listés avant le premier point.
    return [author.strip() for author in authors.split(",")]

def build_graph(data):
    """
    Construit un graphe à partir des données de publication.
    """
    G = nx.Graph()
    
    for entry in data:
        label = entry.get('label_s', '')
        uri = entry.get('uri_s', '')
        docid = entry.get('docid', '')
        
        authors = extract_authors(label)
        
        # Ajouter des nœuds pour chaque auteur
        for author in authors:
            if not G.has_node(author):
                G.add_node(author, publications_count=0, collaborations=0)
            G.nodes[author]['publications_count'] += 1
        
        # Ajouter des liens entre auteurs (collaborations)
        for i, author1 in enumerate(authors):
            for author2 in authors[i + 1:]:
                if not G.has_edge(author1, author2):
                    G.add_edge(author1, author2, weight=0, publications=[])
                
                G.edges[author1, author2]['weight'] += 1
                G.edges[author1, author2]['publications'].append({
                    'docid': docid,
                    'uri': uri,
                    'label': label
                })
                G.nodes[author1]['collaborations'] += 1
                G.nodes[author2]['collaborations'] += 1
    
    return G

def compute_metrics(G):
    """
    Calcule des métriques de centralité pour chaque nœud.
    """
    degree_centrality = nx.degree_centrality(G)
    betweenness_centrality = nx.betweenness_centrality(G)
    closeness_centrality = nx.closeness_centrality(G)
    clustering_coefficient = nx.clustering(G)
    
    for node in G.nodes():
        G.nodes[node]['degree_centrality'] = degree_centrality[node]
        G.nodes[node]['betweenness_centrality'] = betweenness_centrality[node]
        G.nodes[node]['closeness_centrality'] = closeness_centrality[node]
        G.nodes[node]['clustering_coefficient'] = clustering_coefficient[node]

def graph_to_json(G, output_file):
    """
    Convertit le graphe en format JSON pour l'export.
    """
    graph_data = {
        "nodes": [
            {
                "id": node,
                "name": node,
                "group": 1,  # Peut être adapté à des groupes spécifiques si nécessaire
                **G.nodes[node]
            }
            for node in G.nodes()
        ],
        "links": [
            {
                "source": source,
                "target": target,
                **G.edges[source, target]
            }
            for source, target in G.edges()
        ]
    }
    
    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump(graph_data, file, ensure_ascii=False, indent=4)
    print(f"Graphe sauvegardé dans {output_file}.")

if __name__ == "__main__":
    # Charger les données
    input_file = "../data/articles_L3I_2020_2024.json"
    output_file = "../data/graph.json"
    
    data = load_data(input_file)
    
    # Construire le graphe
    G = build_graph(data)
    
    # Calculer les métriques
    compute_metrics(G)
    
    # Exporter le graphe au format JSON
    graph_to_json(G, output_file)

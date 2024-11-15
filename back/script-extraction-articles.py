import requests
import json
import os

# Paramètres de l'API
BASE_URL = "https://api.archives-ouvertes.fr/search/"
QUERY = "labStructName_t:L3I"
ROWS_PER_REQUEST = 1000  # Nombre maximum de résultats par requête
START_YEAR = 2020
END_YEAR = 2024

def fetch_articles(base_url, query, start_year, end_year, rows_per_request):
    """
    Fonction pour récupérer les articles entre deux années spécifiées.
    """
    start = 0
    articles = []
    while True:
        params = {
            'q': query,
            'rows': rows_per_request,
            'start': start,
            'wt': 'json',
            'fq': f"publicationDateY_i:[{start_year} TO {end_year}]"
        }
        response = requests.get(base_url, params=params)
        if response.status_code != 200:
            print(f"Erreur: {response.status_code}")
            break
        
        data = response.json()
        docs = data.get("response", {}).get("docs", [])
        if not docs:
            break
        
        articles.extend(docs)
        start += rows_per_request
        print(f"{len(articles)} articles récupérés...")
    
    return articles

def save_to_json(data, filename):
    """
    Sauvegarde les données dans un fichier JSON.
    """
    # Création du chemin d'accès complet pour le fichier
    output_path = os.path.join("..", "data", filename)
    
    # Sauvegarde dans le dossier data
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print(f"Les données ont été sauvegardées dans le fichier {output_path}.")

# Récupération des articles
articles = fetch_articles(BASE_URL, QUERY, START_YEAR, END_YEAR, ROWS_PER_REQUEST)

# Vérification si des articles ont été trouvés
if articles:
    # Sauvegarde des articles
    save_to_json(articles, "articles_L3I_2020_2024.json")


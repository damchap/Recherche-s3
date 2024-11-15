import requests
import json
import os
from transformers import pipeline

# Paramètres de l'API
BASE_URL = "https://api.archives-ouvertes.fr/search/"
QUERY = "labStructName_t:L3I"
ROWS_PER_REQUEST = 1000
START_YEAR = 2020
END_YEAR = 2024
OUTPUT_DIR = "../data"
OUTPUT_FILENAME = "articles_L3I_2020_2024.json"

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
        
        try:
            response = requests.get(base_url, params=params, timeout=10)
            response.raise_for_status()  # Vérifie si le code de statut est 200
        except requests.RequestException as e:
            print(f"Erreur lors de la requête : {e}")
            break
        
        try:
            data = response.json()
        except json.JSONDecodeError as e:
            print(f"Erreur de décodage JSON : {e}")
            break
        
        docs = data.get("response", {}).get("docs", [])
        if not docs:
            print("Aucun nouvel article trouvé.")
            break
        
        articles.extend(docs)
        start += rows_per_request
        print(f"{len(articles)} articles récupérés jusqu'à présent...")
    
    return articles

def categorize_articles(articles):
    """
    Ajoute une étiquette de catégorie basée sur le contenu de l'article.
    """
    classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
    candidate_labels = ["Science", "Technology", "Health", "Environment", "Education", "Economy", "Politics"]
    
    for article in articles:
        title = article.get("title_s", "Titre indisponible")
        abstract = article.get("abstract_s", "Résumé indisponible")
        
        # Texte d'entrée pour l'IA
        content = f"{title}. {abstract}"
        
        # Prédiction de la catégorie
        result = classifier(content, candidate_labels)
        predicted_category = result["labels"][0]  # Meilleure catégorie prédite
        
        # Ajout de la catégorie à l'article
        article["predicted_category"] = predicted_category
        
    print("Étiquetage des catégories terminé.")
    return articles

def save_to_json(data, output_dir, filename):
    """
    Sauvegarde les données dans un fichier JSON.
    """
    # Création du répertoire de sortie si nécessaire
    os.makedirs(output_dir, exist_ok=True)
    
    # Chemin complet du fichier
    output_path = os.path.join(output_dir, filename)
    
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        print(f"Les données ont été sauvegardées dans le fichier : {output_path}")
    except IOError as e:
        print(f"Erreur lors de la sauvegarde des données : {e}")

if __name__ == "__main__":
    # Récupération des articles
    articles = fetch_articles(BASE_URL, QUERY, START_YEAR, END_YEAR, ROWS_PER_REQUEST)

    # Vérification si des articles ont été trouvés
    if articles:
        # Ajout des catégories aux articles
        categorized_articles = categorize_articles(articles)
        
        # Sauvegarde des articles
        save_to_json(categorized_articles, OUTPUT_DIR, OUTPUT_FILENAME)
    else:
        print("Aucun article à sauvegarder.")

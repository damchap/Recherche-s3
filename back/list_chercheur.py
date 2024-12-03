import requests
from bs4 import BeautifulSoup
import json

# URLs
url_current = "https://l3i.univ-larochelle.fr/Annuaire-318"
url_archive = "http://web.archive.org/web/20200807164839/https://l3i.univ-larochelle.fr/Annuaire-318"

# Fonction pour extraire les <li> dans des conteneurs .row
def extract_list_items(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        # Sélecteur pour trouver les <li> à l'intérieur des éléments avec la classe .row
        elements = soup.select('.row li')
        return [el.get_text(strip=True) for el in elements]
    else:
        print(f"Erreur lors de l'accès à {url}: {response.status_code}")
        return []

# Extraction des données depuis les deux URL
current_items = extract_list_items(url_current)
archive_items = extract_list_items(url_archive)

# Combine les deux listes et supprime les doublons
combined_items = list(set(current_items + archive_items))

# Sauvegarde des résultats dans un fichier JSON
output_file = "researchers_combined.json"
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(combined_items, f, ensure_ascii=False, indent=4)

# Affichage d'un message de confirmation
print(f"Données combinées et sauvegardées dans {output_file}")

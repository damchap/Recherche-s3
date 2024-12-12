from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from graph import get_graph, get_graph_state, filter_graph_data, find_shortest_heaviest_paths, filter_graph_data_for_path, get_cluster

app = Flask(__name__)
CORS(app)

@app.route('/graph', methods=['GET'])
def graph():
    try:
        graph_data = get_graph()
        return jsonify(graph_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/state/<state>', methods=['GET'])
def get_state(state):
    try:
        graph_data = get_graph_state(state)
        return jsonify(graph_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/filter', methods=['POST'])
def filter_data():
    try:
        filters = request.json
        graph_data = filter_graph_data(filters)

        return json.dumps(graph_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/path', methods=['POST'])
def shortest_path():
    try:
        p = request.json
        heaviest_paths = find_shortest_heaviest_paths(p["graph"], p["source"], p["target"])
        graph_data = filter_graph_data_for_path(p["graph"], heaviest_paths[0])

        return jsonify(graph_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/cluster', methods=['POST'])
def cluster():
    try:
        focus_node = request.json
        graph_data = get_cluster(focus_node)
        return jsonify(json.dumps(graph_data, indent=2)), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
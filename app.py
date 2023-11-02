from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from sklearn.cluster import KMeans
import requests
import cv2
import json
import base64
import numpy as np
  

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}})

# The base URL of the Express.js backend
EXPRESS_BACKEND_URL = "http://localhost:3000"   

# Proxy route for user routes
@app.route('/api/users/<path:path>', methods=['POST'])
@cross_origin()
def proxy_user_routes(path):
    url = f"{EXPRESS_BACKEND_URL}/users/{path}"
    data = request.get_json()
    return forward_request(url, data)

# Proxy route for image routes
@app.route('/api/images/<path:path>', methods=['POST', 'GET', 'DELETE'])
def proxy_image_routes(path):
    url = f"{EXPRESS_BACKEND_URL}/images/{path}"
    data = request.get_json() if request.is_json else None
    return forward_request(url, data)

# Proxy route for theme routes
@app.route('/api/themes/<path:path>', methods=['POST', 'GET', 'PUT', 'DELETE'])
def proxy_theme_routes(path):
    url = f"{EXPRESS_BACKEND_URL}/themes/{path}"
    data = request.get_json()
    return forward_request(url, data)

def forward_request(url, data):
    method = request.method
    try:
        if method == 'POST':
            response = requests.post(url, json=data)
        elif method == 'GET':
            response = requests.get(url)
        elif method == 'PUT':
            response = requests.put(url, json=data)
        elif method == 'DELETE':
            response = requests.delete(url)
        response_data = response.json() if response.headers.get('content-type') == 'application/json' else response.text
        status_code = response.status_code
    except Exception as e:
        response_data = {'error': str(e)}
        status_code = 500
    return jsonify(response_data), status_code


# Initialize a dictionary to store the data
combined_data = {
    "dominant_colors": {},
    "color_moments": {},
    "histogram_colors": {
        "blue": {},
        "green": {},
        "red": {}
    }
}

# POST method to process image data
@app.route('/api/process_image_data', methods=['POST'])
def process_image_data():
    data = request.get_json()
    image_base64 = data.get('image_base64')

    if image_base64:
        # Decode the base64 string to get the image data
        image_data = base64.b64decode(image_base64)

        # Convert image data to a numpy array
        nparr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Calculate histograms for each color channel (BGR)
    hist_b = cv2.calcHist([image], [0], None, [256], [0, 256])
    hist_g = cv2.calcHist([image], [1], None, [256], [0, 256])
    hist_r = cv2.calcHist([image], [2], None, [256], [0, 256])

    # Store histogram data in the combined_data dictionary
    combined_data["histogram_colors"]["blue"] = [int(value[0]) for value in hist_b]
    combined_data["histogram_colors"]["green"] = [int(value[0]) for value in hist_g]
    combined_data["histogram_colors"]["red"] = [int(value[0]) for value in hist_r]

    # Convert the image to RGB and process dominant colors
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    pixels = image_rgb.reshape(-1, 3)

    kmeans = KMeans(n_clusters=5, n_init=10)
    kmeans.fit(pixels)
    dominant_colors = kmeans.cluster_centers_.astype(int)

    # Store dominant colors data in the combined_data dictionary
    combined_data["dominant_colors"] = {
        f"color{i}": color.tolist() for i, color in enumerate(dominant_colors)
    }

    # Calculate color moments for each channel and store the data
    color_moments = []
    for channel in range(3):
        channel_image = image[:, :, channel]
        moments = cv2.moments(channel_image)
        color_moments.append(moments)

    combined_data["color_moments"] = [
        {f'moment{key}': value for key, value in moments.items()}
        for moments in color_moments
    ]

    # Return a JSON response upon processing image data
    return jsonify({'message': 'Image data processed'}) 


@app.route('/api/get_combined_data', methods=['GET'])
def get_combined_data():
    # Store the combined data in a JSON file
    with open('combined_data.json', 'w') as json_file:
        json.dump(combined_data, json_file, indent=2)

    # Return a JSON response after saving the combined data
    return jsonify({'message': 'Combined data saved in combined_data.json'})


if __name__ == '__main__':
    app.run(debug=True)

from flask import Flask, request, jsonify
import base64
import numpy as np
import cv2

app = Flask(__name__)

def validar_imagem(image_base64):
    try:
        image_bytes = base64.b64decode(image_base64)
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None:
            return False

        # Detector de rosto (simples)
        face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        if len(faces) != 1:
            return False

        #evoluir depois com anti-spoofing

        return True

    except Exception as e:
        print(e)
        return False


@app.route('/validar', methods=['POST'])
def validar():
    data = request.get_json()

    image_base64 = data.get("image")

    valido = validar_imagem(image_base64)

    return jsonify({
        "valido": valido
    })


if __name__ == '__main__':
    app.run(port=5000)
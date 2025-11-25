from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import requests
import cv2
from urllib.parse import urlparse
from tensorflow.keras.layers import Layer
import json

app = Flask(__name__)

# Cargar modelos con las capas personalizadas
try:
    print("🔄 Cargando modelo de complejidad...")
    modelo_complejidad = tf.keras.models.load_model("modelos/modelo_complejidad.keras")
    print("✅ Modelo de complejidad cargado")
except Exception as e:
    print(f"❌ Error cargando modelo de complejidad: {e}")
    modelo_complejidad = None

try:
    print("🔄 Cargando modelo de horas...")
    modelo_horas = tf.keras.models.load_model("modelos/modelo_horas.keras")
    print("✅ Modelo de horas cargado")
except Exception as e:
    print(f"❌ Error cargando modelo de horas: {e}")
    modelo_horas = None


def download_image_from_url(image_url):
    """Descarga imagen desde una URL externa"""
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        response = requests.get(image_url, headers=headers, timeout=10)
        response.raise_for_status()

        content_type = response.headers.get("content-type", "")
        if "image" not in content_type:
            raise ValueError(
                f"URL no apunta a una imagen. Content-Type: {content_type}"
            )

        return response.content

    except Exception as e:
        raise Exception(f"Error descargando imagen: {str(e)}")


def preprocess_for_resnet50(image, target_size=(64, 64)):
    """Preprocesa imagen para modelo ResNet50"""
    image_resized = cv2.resize(image, target_size)
    image_rgb = cv2.cvtColor(image_resized, cv2.COLOR_BGR2RGB)
    image_preprocessed = tf.keras.applications.resnet50.preprocess_input(image_rgb)
    image_batch = np.expand_dims(image_preprocessed, axis=0)
    return image_batch


@app.route("/predict", methods=["POST"])
def predict():
    try:
        if modelo_complejidad is None and modelo_horas is None:
            return jsonify({"error": "Modelos no cargados correctamente"}), 500

        data = request.json

        # Opción A: Si recibe features directamente
        if "features" in data:
            features = np.array(data["features"]).reshape(1, -1)
            prediction_complejidad = modelo_complejidad.predict(features)

            # Calcular horas basado en la complejidad (si no hay modelo de horas)
            if modelo_horas is not None:
                prediction_horas = modelo_horas.predict(features)
                horas_predichas = float(prediction_horas[0][0])
            else:
                # Estimación basada en complejidad si no hay modelo de horas
                predicted_class = np.argmax(prediction_complejidad[0])
                horas_estimadas = {0: 4.0, 1: 12.0, 2: 24.0}  # Valores por defecto
                horas_predichas = horas_estimadas.get(predicted_class, 8.0)

            prediction_type = "complejidad_y_horas"

        # Opción B: Si recibe array de URLs de imagen
        elif "image_urls" in data:
            image_urls = data["image_urls"]

            if not isinstance(image_urls, list):
                return jsonify({"error": "image_urls debe ser un array"}), 400

            if len(image_urls) == 0:
                return jsonify({"error": "El array image_urls está vacío"}), 400

            resultados = []

            for i, image_url in enumerate(image_urls):
                try:
                    # Validar URL
                    parsed_url = urlparse(image_url)
                    if not all([parsed_url.scheme, parsed_url.netloc]):
                        resultados.append(
                            {
                                "url": image_url,
                                "status": "error",
                                "error": "URL no válida",
                            }
                        )
                        continue

                    # Descargar imagen
                    image_bytes = download_image_from_url(image_url)
                    nparr = np.frombuffer(image_bytes, np.uint8)
                    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

                    if image is None:
                        resultados.append(
                            {
                                "url": image_url,
                                "status": "error",
                                "error": "No se pudo decodificar imagen",
                            }
                        )
                        continue

                    # Preprocesar imagen
                    processed_image = preprocess_for_resnet50(image)

                    # Predecir complejidad
                    if modelo_complejidad is None:
                        resultados.append(
                            {
                                "url": image_url,
                                "status": "error",
                                "error": "Modelo de complejidad no disponible",
                            }
                        )
                        continue

                    prediction_complejidad = modelo_complejidad.predict(processed_image)
                    predicted_class = int(np.argmax(prediction_complejidad[0]))
                    confidence = float(np.max(prediction_complejidad[0]))

                    class_names = {0: "baja", 1: "media", 2: "alta"}
                    class_name = class_names.get(predicted_class, "desconocida")

                    # Predecir horas
                    if modelo_horas is not None:
                        prediction_horas = modelo_horas.predict(processed_image)
                        horas_predichas = float(prediction_horas[0][0])

                    resultados.append(
                        {
                            "url": image_url,
                            "status": "success",
                            "complexity": {
                                "class": predicted_class,
                                "level": class_name,
                                "confidence": confidence,
                                "probabilities": prediction_complejidad[0].tolist(),
                            },
                            "hours_prediction": {
                                "estimated_hours": round(horas_predichas, 1),
                                "confidence": (
                                    "high" if modelo_horas is not None else "estimated"
                                ),
                            },
                            "summary": f"Complejidad {class_name} - {round(horas_predichas, 1)} horas estimadas",
                        }
                    )

                except Exception as e:
                    resultados.append(
                        {"url": image_url, "status": "error", "error": str(e)}
                    )

            # Calcular promedios si hay resultados exitosos
            resultados_exitosos = [r for r in resultados if r["status"] == "success"]

            if resultados_exitosos:
                # Promedio de complejidad (ponderado por confianza)
                complejidades = [r["complexity"]["class"] for r in resultados_exitosos]
                confianzas = [
                    r["complexity"]["confidence"] for r in resultados_exitosos
                ]
                complejidad_promedio = np.average(complejidades, weights=confianzas)

                # Promedio de horas
                horas = [
                    r["hours_prediction"]["estimated_hours"]
                    for r in resultados_exitosos
                ]
                horas_promedio = np.mean(horas)

                class_names = {0: "baja", 1: "media", 2: "alta"}
                complejidad_promedio_redondeada = int(round(complejidad_promedio))
                clase_promedio = class_names.get(
                    complejidad_promedio_redondeada, "media"
                )

                response_data = {
                    "results": resultados,
                    "summary": {
                        "total_images": len(image_urls),
                        "successful_predictions": len(resultados_exitosos),
                        "failed_predictions": len(resultados)
                        - len(resultados_exitosos),
                        "average_complexity": {
                            "class": complejidad_promedio_redondeada,
                            "level": clase_promedio,
                            "score": round(complejidad_promedio, 2),
                        },
                        "average_hours": round(horas_promedio, 1),
                        "total_estimated_hours": round(
                            horas_promedio * len(resultados_exitosos), 1
                        ),
                    },
                    "status": "success",
                }
            else:
                response_data = {
                    "results": resultados,
                    "summary": {
                        "total_images": len(image_urls),
                        "successful_predictions": 0,
                        "failed_predictions": len(resultados),
                        "error": "No se pudo procesar ninguna imagen",
                    },
                    "status": "partial_success" if len(resultados) > 0 else "error",
                }

            return jsonify(response_data)

        else:
            return (
                jsonify(
                    {
                        "error": 'Datos no válidos. Envíe "features" o "image_urls" (array)'
                    }
                ),
                400,
            )

    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify(
        {
            "status": "healthy",
            "complexity_model_loaded": modelo_complejidad is not None,
            "hours_model_loaded": modelo_horas is not None,
        }
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

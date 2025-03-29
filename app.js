// Espera a que todo el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Verifica que Leaflet esté disponible
    if (typeof L === 'undefined') {
        console.error('Leaflet no se cargó correctamente');
        return;
    }

    // Configuración MQTT
    const client = mqtt.connect("wss://test.mosquitto.org:8081/mqtt");

    // Inicializa el mapa con una vista por defecto
    const map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    let marker = L.marker([0, 0]).addTo(map);

    // Elementos del DOM
    const latElement = document.getElementById("lat");
    const lngElement = document.getElementById("lng");
    const altElement = document.getElementById("alt");

    // Conexión MQTT
    client.on("connect", () => {
        console.log("Conectado al broker MQTT");
        client.subscribe("gps/data");
    });

    // Procesar mensajes GPS
    client.on("message", (topic, message) => {
        if (topic === "gps/data") {
            try {
                const data = JSON.parse(message.toString());
                
                // Actualizar UI
                latElement.textContent = data.lat;
                lngElement.textContent = data.lng;
                altElement.textContent = data.alt;
                
                // Actualizar mapa si las coordenadas son válidas
                if (data.lat && data.lng) {
                    const latLng = [parseFloat(data.lat), parseFloat(data.lng)];
                    map.setView(latLng, 15);
                    marker.setLatLng(latLng);
                }
                
                console.log("Datos GPS recibidos:", data);
            } catch (e) {
                console.error("Error procesando datos GPS:", e);
            }
        }
    });
});

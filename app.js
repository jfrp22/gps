// Configuración inicial del mapa
const map = L.map('map').setView([0, 0], 2); // Vista inicial genérica
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let marker = L.marker([0, 0]).addTo(map); // Marcador inicial

// Conexión MQTT
const client = mqtt.connect("wss://test.mosquitto.org:8081/mqtt");

client.on("connect", () => {
    console.log("Conectado al broker MQTT");
    client.subscribe("gps/data");
});

client.on("message", (topic, message) => {
    if (topic === "gps/data") {
        try {
            const data = JSON.parse(message.toString());
            
            // Actualizar coordenadas en la interfaz
            document.getElementById("lat").textContent = data.lat.toFixed(6);
            document.getElementById("lng").textContent = data.lng.toFixed(6);
            document.getElementById("alt").textContent = data.alt ? data.alt.toFixed(2) + " m" : "N/A";

            // ----- Auto-enfoque clave aquí -----
            const newLatLng = [data.lat, data.lng];
            
            // Mover el marcador
            marker.setLatLng(newLatLng);
            
            // Enfocar el mapa en la nueva ubicación (con zoom 15)
            map.setView(newLatLng, 15);
            
            // Añadir popup con info
            marker.bindPopup(`
                <b>Ubicación actual</b><br>
                Lat: ${data.lat.toFixed(6)}<br>
                Lng: ${data.lng.toFixed(6)}<br>
                Alt: ${data.alt ? data.alt.toFixed(2) + " m" : "N/A"}
            `).openPopup();

        } catch (e) {
            console.error("Error al procesar datos:", e);
        }
    }
});

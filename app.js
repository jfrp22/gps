// Configuración MQTT
const client = mqtt.connect("wss://test.mosquitto.org:8081/mqtt");

// Elementos del DOM
const latElement = document.getElementById("lat");
const lngElement = document.getElementById("lng");
const altElement = document.getElementById("alt");

// Mapa (LeafletJS)
const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
let marker = L.marker([0, 0]).addTo(map);

// Conexión MQTT
client.on("connect", () => {
    console.log("Conectado al broker MQTT");
    client.subscribe("gps/data");
});

// Procesar mensajes GPS
client.on("message", (topic, message) => {
    if (topic === "gps/data") {
        const data = JSON.parse(message.toString());
        
        // Actualizar UI
        latElement.textContent = data.lat;
        lngElement.textContent = data.lng;
        altElement.textContent = data.alt;
        
        // Actualizar mapa
        map.setView([data.lat, data.lng], 15);
        marker.setLatLng([data.lat, data.lng]);
        
        console.log("Datos GPS recibidos:", data);
    }
});

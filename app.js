document.addEventListener('DOMContentLoaded', function() {
    // Verificación explícita
    if (!window.L) {
        document.getElementById('map').innerHTML = 
            '<p style="color:red">Error: Leaflet no se cargó. Recarga la página.</p>';
        return;
    }

    // Configuración MQTT
    const client = mqtt.connect("wss://test.mosquitto.org:8081/mqtt");

    // Mapa
    const map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    const marker = L.marker([0, 0]).addTo(map);

    // Suscripción MQTT
    client.on('connect', () => {
        client.subscribe('gps/data');
    });


client.on("message", (topic, message) => {
  if (topic === "gps/data") {
    try {
      // Parsear el JSON recibido
      const data = JSON.parse(message.toString());
      
      // Actualizar la interfaz
      document.getElementById("lat").textContent = data.lat;
      document.getElementById("lng").textContent = data.lng;
      document.getElementById("alt").textContent = data.alt;
      
      // Actualizar el mapa (si usas Leaflet)
      if (map && marker) {
        map.setView([data.lat, data.lng], 15);
        marker.setLatLng([data.lat, data.lng]);
      }
      
    } catch (e) {
      console.error("Error al parsear JSON:", e, "Mensaje crudo:", message.toString());
    }
  }
});
});

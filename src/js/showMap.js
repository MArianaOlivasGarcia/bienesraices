(function() {

    const lat = document.querySelector('#lat').textContent;
    const lng = document.querySelector('#lng').textContent;
    const street = document.querySelector('#street').textContent;

    const mapa = L.map('mapa').setView([lat, lng], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);


    // Add PIN
    L.marker([lat, lng])
        .addTo(mapa)
        .bindPopup(street)


})()
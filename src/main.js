import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

window.addEventListener('DOMContentLoaded', () => {
  const map = L.map('map').setView([49.5, 34.5], 7);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19, attribution: '&copy; OpenStreetMap contributors'}).addTo(map);
// layer for circle
  const ringsLayer = L.layerGroup().addTo(map);

  const currentWeapon = {
    id: 'aim-120c',
    name: 'AIM-120C AMRAAM',
    type: 'Air-to-air Missile',
    rangeKm: 105
  };

  map.on('click', (e) => {
    ringsLayer.clearLayers();
    const { lat, lng } = e.latlng;
    const circle = L.circle([lat, lng], {
//radius in meters (km*1000)
      radius: currentWeapon.rangeKm * 1000,
      color: '#a51414',
      fillColor: '#f31d1d',    
      fillOpacity: 0.15,
      weight: 2
    })
    circle.bindTooltip(`Range: ${currentWeapon.rangeKm} kilomers`, {
      sticky: true
    })
    const centerPoint = L.circleMarker([lat, lng], {
      radius: 5,
      color: '#fafaf4',
      fillColor: '#0095ff',
      fillOpacity: 1,
      weight: 2
    });
// popup window
const popupContent = `
      <div id="popup">
        <strong>${currentWeapon.name}</strong><br/>
        <span>Тип: ${currentWeapon.type}</span><br>
        <b>Розрахункова дистанція:</b> ${currentWeapon.rangeKm} км
        </div>`;
        centerPoint.bindPopup(popupContent);
        
        ringsLayer.addLayer(circle);
        ringsLayer.addLayer(centerPoint)
        
        centerPoint.openPopup();
  });
});
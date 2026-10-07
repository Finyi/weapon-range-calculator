import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {weapons_data} from './weapons.js';

window.addEventListener('DOMContentLoaded', () => {
  const map = L.map('map').setView([49.5, 34.5], 7);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19, attribution: '&copy; OpenStreetMap contributors'}).addTo(map);
// layer for circle
  const ringsLayer = L.layerGroup().addTo(map);
  const selectElement = document.getElementById('weapon-select')
  const multiModeCheckBox = document.getElementById('multi-mode')
  const clearBtn = document.getElementById('clear-btn')

  weapons_data.forEach((weapon) => {
    const option = document.createElement('option');
    option.value = weapon.id;
    option.textContent = `${weapon.name} (${weapon.baseRangeKm} kilometers)`;
    selectElement.appendChild(option);
  });

  clearBtn.addEventListener('click', () => {
    ringsLayer.clearLayers();
  });

  map.on('click', (e) => {
    if (!multiModeCheckBox.checked) {
      ringsLayer.clearLayers();
    }

    const { lat, lng } = e.latlng;
    const selectId = selectElement.value;
    const currentWeapon = weapons_data.find((w) => w.id === selectId);
    if (!currentWeapon) return;

    const batteryGroup = L.layerGroup();
//radius in meters (km*1000)
    const circle = L.circle([lat, lng], {
      radius: currentWeapon.baseRangeKm * 1000,
      color: currentWeapon.color,
      fillColor: currentWeapon.color,    
      fillOpacity: 0.15,
      weight: 2
    });
    circle.bindTooltip(`Range: ${currentWeapon.baseRangeKm} kilomers`, {
      sticky: true
    })
    const centerPoint = L.circleMarker([lat, lng], {
      radius: 6,
      color: '#fafaf4',
      fillColor: '#0095ff',
      fillOpacity: 1,
      weight: 2
    });
// popup window
const popupContent = `
      <div id="popup">
        <strong>${currentWeapon.name}</strong><br/>
        <span>Type: ${currentWeapon.category}</span><br>
        <b>Calculated distance:</b> ${currentWeapon.baseRangeKm} km
        <small style="color: #888;">ПКМ по точці для видалення</small>
        </div>`;
//delete battery in right click mouse
        centerPoint.bindPopup(popupContent);
        centerPoint.on('contextmenu', (event) =>{
          L.DomEvent.stopPropagation(event);
          ringsLayer.removeLayer(batteryGroup);
        });

        batteryGroup.addLayer(circle);
        batteryGroup.addLayer(centerPoint);
        ringsLayer.addLayer(batteryGroup);

        centerPoint.openPopup();
  });
});
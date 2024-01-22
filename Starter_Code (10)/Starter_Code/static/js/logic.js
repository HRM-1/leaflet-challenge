
const myMap = L.map('map').setView([0, 0], 2);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(myMap);

// Fetch data
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson')
  .then(response => response.json())
  .then(data => {
    
    function getColor(depth) {
      const maxDepth = 700; 
      const hue = (1 - depth / maxDepth) * 120;
      return `hsl(${hue}, 100%, 50%)`;
    }

    // Markers 
    data.features.forEach(feature => {
      const coordinates = feature.geometry.coordinates;
      const magnitude = feature.properties.mag;
      const depth = coordinates[2];

      const marker = L.circleMarker([coordinates[1], coordinates[0]], {
        radius: magnitude * 3, 
        fillColor: getColor(depth),
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });

      // Popup 
      marker.bindPopup(`<b>Magnitude:</b> ${magnitude}<br><b>Depth:</b> ${depth} km`);

      
      marker.addTo(myMap);
    });

    // Legend
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
      const div = L.DomUtil.create('div', 'info legend');
      const depthValues = [0, 100, 200, 300, 400, 500, 600, 700]; // Adjust based on your data
      div.innerHTML += '<b>Depth Legend</b><br>';
      for (let i = 0; i < depthValues.length; i++) {
        div.innerHTML +=
          '<i style="background:' + getColor(depthValues[i] + 1) + '"></i> ' +
          depthValues[i] + (depthValues[i + 1] ? '&ndash;' + depthValues[i + 1] + ' km<br>' : '+ km');
      }
      return div;
    };

    legend.addTo(myMap);
  });

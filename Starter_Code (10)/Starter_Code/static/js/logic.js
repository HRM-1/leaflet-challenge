
const myMap = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(myMap);

// Fetch data using D3
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson')
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
            marker.bindPopup(`<b>Location:</b> ${feature.properties.place}<br><b>Magnitude:</b> ${magnitude}<br><b>Depth:</b> ${depth} km`);

            marker.addTo(myMap);
        });

        // Legend
        const legend = L.control({ position: 'bottomright' });

        legend.onAdd = function (map) {
            const div = L.DomUtil.create('div', 'info legend');
            const depthValues = [0, 100, 200, 300, 400, 500, 600, 700]; // Adjust based on your data
            div.innerHTML += '<b>Depth Legend</b><br>';

            // Circle next to each legend item
            for (let i = 0; i < depthValues.length; i++) {
                const backgroundColor = getColor(depthValues[i] + 1);
                const textColor = '#fff'; // Text color is always white for better contrast
                div.innerHTML +=
                    '<i style="background:' + backgroundColor + '; color:' + textColor + '"></i> ' +
                    (i === depthValues.length - 1 ? depthValues[i] + '+ km' : depthValues[i] + '&ndash;' + depthValues[i + 1] + ' km') + '<br>';

                
                const circle = document.createElement('div');
                circle.classList.add('legend-circle');
                circle.style.backgroundColor = backgroundColor;
                div.appendChild(circle);
                div.innerHTML += '<br>';
            }

            return div;
        };

        legend.addTo(myMap);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

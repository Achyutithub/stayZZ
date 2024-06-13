mapboxgl.accessToken = mapToken;
let coord = coordinates.split(',');
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: coord, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

const marker2 = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(coord)
        .setPopup(new mapboxgl.Popup({offset: 25})
        .setHTML("<h3>Fun Place To Visit</h3><h6>Exact loacation provided after booking</h6>")
)
        .addTo(map);


mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    center: campground.geometry.coordinates,
    style: 'mapbox://styles/mapbox/streets-v12', // stylesheet location
    zoom: 8, // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());
const Marker1 = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    // setting a popup when the map is clicked 
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                // Displaying the title and location of the campg 
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map)
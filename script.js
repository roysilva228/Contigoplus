// Espera a que todo el contenido del HTML se cargue antes de ejecutar el script
window.addEventListener('load', () => {
    // Coordenadas de Lima, Perú. Puedes cambiarlas por cualquier otra ciudad.
    const lat = -12.0464;
    const lon = -77.0428;
    const apiKey = "TU_API_KEY"; // <-- ¡PEGA TU API KEY AQUÍ!
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;

    // Elementos del HTML que vamos a actualizar
    const locationEl = document.getElementById('location');
    const tempEl = document.getElementById('temperature');
    const weatherEl = document.getElementById('weather-description');
    const effectEl = document.getElementById('game-effect');
    const cityMapEl = document.getElementById('city-map');

    // Usamos fetch para obtener los datos de la API
    fetch(apiUrl)
        .then(response => {
            // Si la respuesta no es exitosa, lanzamos un error
            if (!response.ok) {
                throw new Error('Error al obtener los datos del clima. Verifica tu API Key.');
            }
            // Convertimos la respuesta a formato JSON
            return response.json();
        })
        .then(data => {
            // Una vez que tenemos los datos, actualizamos la interfaz
            console.log(data); // Muestra los datos crudos en la consola para que los explores

            const location = data.name;
            const temp = data.main.temp;
            const weather = data.weather[0].description;
            const weatherMain = data.weather[0].main; // Ej: "Clear", "Clouds", "Rain"

            locationEl.textContent = location;
            tempEl.textContent = temp.toFixed(1); // Muestra la temp con 1 decimal
            weatherEl.textContent = weather.charAt(0).toUpperCase() + weather.slice(1);

            // Lógica simple del juego: El clima afecta la ciudad
            updateCityBasedOnWeather(weatherMain);
        })
        .catch(error => {
            // Si algo sale mal, lo mostramos en la consola y en la UI
            console.error('Hubo un problema:', error);
            locationEl.textContent = "Error al cargar datos.";
            locationEl.style.color = 'red';
        });

    function updateCityBasedOnWeather(weatherMain) {
        let effectText = "";
        let cityColor = "";

        switch (weatherMain) {
            case 'Clear':
                effectText = "Día soleado. ¡El turismo aumenta!";
                cityColor = "#a5d6a7"; // Verde claro
                break;
            case 'Clouds':
                effectText = "Está nublado. La producción de energía solar baja.";
                cityColor = "#bdbdbd"; // Gris
                break;
            case 'Rain':
            case 'Drizzle':
                effectText = "Está lloviendo. Los ciudadanos se quedan en casa.";
                cityColor = "#90a4ae"; // Gris azulado
                break;
            case 'Thunderstorm':
                effectText = "¡Tormenta eléctrica! Riesgo de apagones.";
                cityColor = "#616161"; // Gris oscuro
                break;
            default:
                effectText = "El clima es estable.";
                cityColor = "#b0bec5"; // Gris por defecto
                break;
        }

        effectEl.textContent = effectText;
        cityMapEl.style.backgroundColor = cityColor;
    }
});

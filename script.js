// Espera a que todo el contenido del HTML se cargue antes de ejecutar el script
window.addEventListener('load', () => {
    // --- NUEVO: Variables de Recursos del Juego ---
    let money = 1000;
    let energy = 500;
    let population = 100;

    // --- NUEVO: Elementos del HTML para los recursos ---
    const moneyDisplay = document.getElementById('money-display');
    const energyDisplay = document.getElementById('energy-display');
    const populationDisplay = document.getElementById('population-display');

    // Coordenadas de Lima, Perú.
    const lat = -12.0464;
    const lon = -77.0428;
    const apiKey = "a5059de5f58e8bbea36df155a5ea20c5"; 
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;

    // Elementos del HTML que vamos a actualizar
    const locationEl = document.getElementById('location');
    const tempEl = document.getElementById('temperature');
    const weatherEl = document.getElementById('weather-description');
    const effectEl = document.getElementById('game-effect');
    const cityMapEl = document.getElementById('city-map');
    const weatherIconEl = document.getElementById('weather-icon'); // NUEVO

    // Usamos fetch para obtener los datos de la API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos del clima. Verifica tu API Key.');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); 

            const location = data.name;
            const temp = data.main.temp;
            const weather = data.weather[0].description;
            const weatherMain = data.weather[0].main;

            locationEl.textContent = location;
            tempEl.textContent = temp.toFixed(1);
            weatherEl.textContent = weather.charAt(0).toUpperCase() + weather.slice(1);

            updateCityBasedOnWeather(weatherMain);
        })
        .catch(error => {
            console.error('Hubo un problema:', error);
            locationEl.textContent = "Error al cargar datos.";
            locationEl.style.color = 'red';
        });

    function updateCityBasedOnWeather(weatherMain) {
        let effectText = "";
        let cityColor = "";
        let iconHTML = "";

        switch (weatherMain) {
            case 'Clear':
                effectText = "Día soleado. ¡El turismo aumenta los ingresos!";
                cityColor = "#a5d6a7";
                iconHTML = '<i class="fas fa-sun" style="color: #fdd835;"></i>';
                money += 100;
                energy += 50;
                break;
            case 'Clouds':
                effectText = "Está nublado. La producción de energía solar baja.";
                cityColor = "#bdbdbd";
                iconHTML = '<i class="fas fa-cloud" style="color: #90a4ae;"></i>';
                energy -= 10;
                break;
            case 'Rain':
            case 'Drizzle':
                effectText = "Está lloviendo. El consumo de energía aumenta.";
                cityColor = "#90a4ae";
                iconHTML = '<i class="fas fa-cloud-showers-heavy" style="color: #447799;"></i>';
                money -= 20;
                energy -= 30;
                break;
            case 'Thunderstorm':
                effectText = "¡Tormenta eléctrica! Riesgo de apagones.";
                cityColor = "#616161";
                iconHTML = '<i class="fas fa-bolt" style="color: #ffeb3b;"></i>';
                energy -= 100;
                break;
            default:
                effectText = "El clima es estable.";
                cityColor = "#b0bec5";
                iconHTML = '<i class="fas fa-smog" style="color: #78909c;"></i>';
                break;
        }

        // Actualiza toda la interfaz
        effectEl.textContent = effectText;
        cityMapEl.style.backgroundColor = cityColor;
        weatherIconEl.innerHTML = iconHTML;
        moneyDisplay.textContent = money;
        energyDisplay.textContent = energy;
        populationDisplay.textContent = population;
    }

    // --- NUEVO: Lógica del botón de construir ---
    const buildBtn = document.getElementById('build-house-btn');

    buildBtn.addEventListener('click', () => {
        const cost = 200;
        if (money >= cost) {
            money -= cost;
            population += 10;

            // Actualiza la pantalla
            moneyDisplay.textContent = money;
            populationDisplay.textContent = population;

            alert("¡Has construido una nueva casa! La población aumenta.");
        } else {
            alert("¡No tienes suficiente dinero para construir una casa!");
        }
    });
});

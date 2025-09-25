window.addEventListener('load', () => {
    // --- Variables de Recursos del Juego ---
    let money = 1000;
    let energy = 500;
    let population = 100;

    // --- Elementos del HTML ---
    const moneyDisplay = document.getElementById('money-display');
    const energyDisplay = document.getElementById('energy-display');
    const populationDisplay = document.getElementById('population-display');
    const locationEl = document.getElementById('location');
    const tempEl = document.getElementById('temperature');
    const weatherEl = document.getElementById('weather-description');
    const effectEl = document.getElementById('game-effect');
    const cityMapEl = document.getElementById('city-map');
    const weatherIconEl = document.getElementById('weather-icon');
    const buildBtn = document.getElementById('build-house-btn');
    const saveBtn = document.getElementById('save-btn');
    const loadBtn = document.getElementById('load-btn');

    // --- API de Clima ---
    const lat = -12.0464;
    const lon = -77.0428;
    const apiKey = "a5059de5f58e8bbea36df155a5ea20c5";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;

    fetch(apiUrl)
        .then(response => response.ok ? response.json() : Promise.reject('Error de API'))
        .then(data => {
            locationEl.textContent = data.name;
            tempEl.textContent = data.main.temp.toFixed(1);
            weatherEl.textContent = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
            updateCityBasedOnWeather(data.weather[0].main);
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
                effectText = "Día soleado. ¡El turismo aumenta los ingresos!"; cityColor = "#a5d6a7"; iconHTML = '<i class="fas fa-sun" style="color: #fdd835;"></i>'; money += 100; energy += 50;
                break;
            case 'Clouds':
                effectText = "Está nublado. La producción de energía solar baja."; cityColor = "#bdbdbd"; iconHTML = '<i class="fas fa-cloud" style="color: #90a4ae;"></i>'; energy -= 10;
                break;
            case 'Rain': case 'Drizzle':
                effectText = "Está lloviendo. El consumo de energía aumenta."; cityColor = "#90a4ae"; iconHTML = '<i class="fas fa-cloud-showers-heavy" style="color: #447799;"></i>'; money -= 20; energy -= 30;
                break;
            case 'Thunderstorm':
                effectText = "¡Tormenta eléctrica! Riesgo de apagones."; cityColor = "#616161"; iconHTML = '<i class="fas fa-bolt" style="color: #ffeb3b;"></i>'; energy -= 100;
                break;
            default:
                effectText = "El clima es estable."; cityColor = "#b0bec5"; iconHTML = '<i class="fas fa-smog" style="color: #78909c;"></i>';
                break;
        }
        
        effectEl.textContent = effectText;
        cityMapEl.style.backgroundColor = cityColor;
        weatherIconEl.innerHTML = iconHTML;
        updateUI(); // Centralizamos la actualización de la UI
    }

    // --- Lógica del Juego ---
    buildBtn.addEventListener('click', () => {
        const cost = 200;
        const emptySlot = document.querySelector('.building[data-status="empty"]');
        
        if (!emptySlot) {
            alert("¡No hay más espacio para construir!");
            return;
        }

        if (money >= cost) {
            money -= cost;
            population += 10;
            emptySlot.dataset.status = 'built'; // Cambia el estado del lote a construido
            updateUI();
        } else {
            alert("¡No tienes suficiente dinero para construir una casa!");
        }
    });

    // --- NUEVO: Lógica para Guardar y Cargar ---
    saveBtn.addEventListener('click', saveGame);
    loadBtn.addEventListener('click', loadGame);

    function saveGame() {
        const buildingStatuses = [];
        document.querySelectorAll('.building').forEach(b => {
            buildingStatuses.push(b.dataset.status);
        });

        const saveData = {
            money: money,
            energy: energy,
            population: population,
            buildings: buildingStatuses
        };
        localStorage.setItem('apiTycoonSave', JSON.stringify(saveData));
        alert('¡Partida guardada!');
    }

    function loadGame() {
        const savedData = JSON.parse(localStorage.getItem('apiTycoonSave'));
        if (savedData) {
            money = savedData.money;
            energy = savedData.energy;
            population = savedData.population;

            const buildingElements = document.querySelectorAll('.building');
            buildingElements.forEach((building, index) => {
                building.dataset.status = savedData.buildings[index] || 'empty';
            });
            
            updateUI();
            alert('¡Partida cargada!');
        } else {
            alert('No se encontró ninguna partida guardada.');
        }
    }

    // Función para cargar automáticamente al iniciar
    loadGame(); 

    // --- Función central para actualizar la UI ---
    function updateUI() {
        moneyDisplay.textContent = money;
        energyDisplay.textContent = energy;
        populationDisplay.textContent = population;
    }
});

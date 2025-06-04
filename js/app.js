// Modern JavaScript with ES6+ features
document.addEventListener('DOMContentLoaded', () => {
    // State management using a simple store
    const store = {
        weather: null,
        cleanupEvents: [],
        userLocation: null
    };    // Weather API integration using data.gov.sg
    async function fetchWeather() {
        try {
            // Fetch current weather
            const currentResponse = await fetch('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast');
            const currentData = await currentResponse.json();
            
            // Fetch 4-day forecast
            const forecastResponse = await fetch('https://api.data.gov.sg/v1/environment/4-day-weather-forecast');
            const forecastData = await forecastResponse.json();
            
            // Get temperature data
            const tempResponse = await fetch('https://api.data.gov.sg/v1/environment/air-temperature');
            const tempData = await tempResponse.json();

            store.weather = {
                current: currentData,
                forecast: forecastData,
                temperature: tempData
            };
            
            updateWeatherUI();
        } catch (error) {
            console.error('Error fetching weather:', error);
            document.querySelector('.weather-loading').textContent = 'Error loading weather data. Please try again later.';
        }
    }

    // Update weather UI with fetched data
    function updateWeatherUI() {
        const currentWeatherEl = document.getElementById('current-weather');
        const forecastContainer = document.getElementById('forecast-container');
        
        if (!store.weather) return;

        // Update current conditions
        const currentTemp = store.weather.temperature.items[0].readings[0].value;
        const currentForecast = store.weather.current.items[0].forecasts.find(
            f => f.area === 'Pasir Ris'
        );

        currentWeatherEl.innerHTML = `
            <div class="weather-card">
                <h4>Pasir Ris - Right Now</h4>
                <div class="weather-info">
                    <i class="fas fa-thermometer-half"></i>
                    <span>${currentTemp.toFixed(1)}°C</span>
                </div>
                <div class="weather-info">
                    <i class="fas fa-cloud"></i>
                    <span>${currentForecast.forecast}</span>
                </div>
            </div>
        `;

        // Update 4-day forecast
        const forecastHTML = store.weather.forecast.items[0].forecasts.map(day => `
            <div class="weather-card">
                <h4>${formatDate(day.date)}</h4>
                <div class="weather-info">
                    <i class="fas fa-cloud"></i>
                    <span>${day.forecast}</span>
                </div>
                <div class="weather-info">
                    <i class="fas fa-temperature-high"></i>
                    <span>${day.temperature.high}°C</span>
                </div>
                <div class="weather-info">
                    <i class="fas fa-temperature-low"></i>
                    <span>${day.temperature.low}°C</span>
                </div>
            </div>
        `).join('');

        forecastContainer.innerHTML = `<div class="forecast-grid">${forecastHTML}</div>`;
        
        // Remove loading message
        document.querySelector('.weather-loading').style.display = 'none';
    }

    // Helper function to format dates
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-SG', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    // Map initialization (placeholder)
    function initMap() {
        // TODO: Initialize map with preferred mapping library (e.g., Leaflet, Google Maps)
        const mapContainer = document.getElementById('cleanup-map');
        // Map initialization code will go here
    }

    // Weather UI updates
    function updateWeatherUI() {
        const weatherContainer = document.querySelector('.weather-container');
        if (store.weather) {
            // TODO: Update weather display
        }
    }

    // Geolocation handling
    function getUserLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    store.userLocation = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    };
                    fetchWeather(store.userLocation.lat, store.userLocation.lon);
                },
                error => {
                    console.error('Error getting location:', error);
                }
            );
        }
    }

    // Mobile menu toggle
    const setupMobileMenu = () => {
        // TODO: Implement mobile menu functionality
    };

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });    // Initialize features
    fetchWeather(); // Fetch weather data immediately
    initMap();
    setupMobileMenu();
    
    // Refresh weather data every 30 minutes
    setInterval(fetchWeather, 30 * 60 * 1000);
});

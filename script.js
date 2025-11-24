const apiKey = "bd5e378503939ddaee76f12ad7a97608";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const errorText = document.getElementById("error");

const card = document.getElementById("weather-card");
const cityNameEl = document.getElementById("city-name");
const dateTimeEl = document.getElementById("date-time");
const tempEl = document.getElementById("temperature");
const descEl = document.getElementById("description");
const iconEl = document.getElementById("icon");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const pressureEl = document.getElementById("pressure");
const visibilityEl = document.getElementById("visibility");

async function fetchWeather(city) {
    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    try {
        errorText.textContent = "";
        const url = `${baseUrl}?q=${encodeURIComponent(
            city
        )}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found. Check spelling.");
            } else {
                throw new Error("Failed to fetch weather data.");
            }
        }

        const data = await response.json();
        updateUI(data);
    } catch (err) {
        showError(err.message);
    }
}

function updateUI(data) {
    const city = `${data.name}, ${data.sys.country}`;
    const temp = Math.round(data.main.temp); // °C
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon; // e.g. "10d"
    const humidity = data.main.humidity; // %
    const wind = data.wind.speed; // m/s
    const pressure = data.main.pressure; // hPa
    const visibility = data.visibility; // meters

    const localTime = new Date(data.dt * 1000);
    const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };

    cityNameEl.textContent = city;
    dateTimeEl.textContent = localTime.toLocaleString("en-IN", options);
    tempEl.textContent = temp;
    descEl.textContent = description;

    iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    iconEl.alt = description;

    humidityEl.textContent = `Humidity: ${humidity}%`;
    windEl.textContent = `Wind: ${wind} m/s`;
    pressureEl.textContent = `Pressure: ${pressure} hPa`;
    visibilityEl.textContent = `Visibility: ${(visibility / 1000).toFixed(1)} km`;

    card.classList.remove("hidden");
}

function showError(msg) {
    errorText.textContent = msg;
    card.classList.add("hidden");
}

searchBtn.addEventListener("click", () => {
    fetchWeather(cityInput.value.trim());
});

cityInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        fetchWeather(cityInput.value.trim());
    }
});

// optional: load default city at start
fetchWeather("Mumbai");
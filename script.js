// ===== Live Weather =====

// Get live weather for a city from the Open-Meteo API
async function getWeather(cityName, latitude, longitude) {
  // Clear the old city's info while the new one loads
  document.getElementById("city").textContent = "Loading " + cityName + "...";
  document.getElementById("temperature").textContent = "";
  document.getElementById("description").textContent = "";
  document.getElementById("wind").textContent = "";
  document.getElementById("advice").textContent = "";

  // Build the API address with the city's location
  let url = "https://api.open-meteo.com/v1/forecast"
    + "?latitude=" + latitude
    + "&longitude=" + longitude
    + "&current=temperature_2m,weather_code,wind_speed_10m,is_day";

  try {
    // 1. Ask the API for the data
    let response = await fetch(url);

    // 2. Turn the answer into a JSON object
    let data = await response.json();

    // 3. Pull out the numbers we need
    let temp = data.current.temperature_2m;
    let code = data.current.weather_code;
    let wind = data.current.wind_speed_10m;
    let isDay = data.current.is_day;

    // 4. Update the page with the live data
    showWeather(cityName, temp, code, wind, isDay);
  } catch (error) {
    document.getElementById("city").textContent = "Could not load the weather. Try again.";
  }
}

// Change the text and colours based on the data
function showWeather(cityName, temp, code, wind, isDay) {
  document.getElementById("city").textContent = cityName;
  document.getElementById("temperature").textContent = temp + " °C";
  document.getElementById("description").textContent = describe(code);
  document.getElementById("wind").textContent = "Wind: " + wind + " km/h";

  // The temperature decides the background colour and the advice
  let color = "";
  let advice = "";

  if (temp < 0) {
    color = "#a9c8f0";
    advice = "Freezing! Wear a winter coat.";
  } else if (temp < 15) {
    color = "#c8dff0";
    advice = "Cool. Bring a jacket.";
  } else if (temp < 25) {
    color = "#f6e3a1";
    advice = "Nice weather. A t-shirt is fine.";
  } else {
    color = "#f4a77a";
    advice = "Hot! Drink lots of water.";
  }

  // At night, use a darker colour
  if (isDay === 0) {
    color = "#2b3350";
    advice = advice + " (It's night there right now.)";
    document.body.style.color = "white";
  } else {
    document.body.style.color = "#22263a";
  }

  document.body.style.backgroundColor = color;
  document.getElementById("advice").textContent = advice;
}

// Turn the weather code number into words
function describe(code) {
  if (code === 0) {
    return "Clear sky";
  } else if (code <= 3) {
    return "Partly cloudy";
  } else if (code <= 48) {
    return "Foggy";
  } else if (code <= 67) {
    return "Rain";
  } else if (code <= 77) {
    return "Snow";
  } else if (code <= 82) {
    return "Rain showers";
  } else if (code <= 86) {
    return "Snow showers";
  } else {
    return "Thunderstorm";
  }
}

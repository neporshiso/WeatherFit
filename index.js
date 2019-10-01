// ? So far using three APIs.  ZipCode to Lat/Lon API.  DarkSky for weather data.  Open Weather for weather icon.

const apiKey = "1387466109e308e8de851d6f09a87c39";
const zipCode = "64111";

function get(url) {
    return fetch(url)
        .then(response => response.json())
        .then(data => data);
}

function convertZipToCoordinates(zip) {
    get(
        `https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude&q=${zip}&facet=state&facet=timezone&facet=dst`
    ).then(function(response) {
        let coordinates = response.records[0].geometry.coordinates;
        getWeather(coordinates);
    });
}

function getWeather(coordinates) {
    const para = document.getElementById("p");
    let lat = coordinates[1];
    let lon = coordinates[0];
    let url = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${apiKey}/${lat},${lon}`;
    get(url).then(function(response) {
        let apparentTemp = response.currently.apparentTemperature;
        para.innerHTML = `Feels like ${apparentTemp} degrees Farenheit in ${zipCode}.`;
    });
}

function getIcon(zip) {
    let u = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&APPID=c7d69379e4f97e2b0e42695dddb0ad27`;
    const iconImg = document.getElementById("icon");
    get(u)
        .then(response => response)
        .then(function(data) {
            let iconCode = data.weather[0].icon;
            return iconCode;
        })
        .then(function(iconCode) {
            // Use the icon code to get the icon using OpenWeatherMap.org
            const iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;
            return iconURL;
        })
        .then(function(iconURL) {
            iconImg.src = iconURL;
        });
}

// ! commenting out so I don't constantly call these APIs
getClothes();
// convertZipToCoordinates(zipCode)
// getIcon(zipCode)

/* API Counter  

1. public.opendatasoft.com API:  Take a zipcode. Give lat/lon and city/state.
2. DarkSky API: Temperatures and Precipitation Chance
3. Open Weather: Weather Icon
4. [In Progress]: Unofficial ASOS for Clothing

*/

function get(url) {
    return fetch(url)
        .then(response => response.json())
        .then(data => data);
}

// When the zip code form is submitted, grab the zip code, convert it to coordinates and get the weather data and icon
zipcodeForm.addEventListener("submit", function(event) {
    event.preventDefault(); 
    let zipcodeValue = document.getElementById("zipcodeInput").value;
    convertZipToCoordinates(zipcodeValue)
    getIcon(zipcodeValue)
})  

function convertZipToCoordinates(zip) {
    const location = document.getElementById("todayLocation");
    get(
        `https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude&q=${zip}&facet=state&facet=timezone&facet=dst`
    ).then(function(response) {
        let coordinates = response.records[0].geometry.coordinates;
        let city = response.records[0].fields.city
        let state = response.records[0].fields.state
        location.innerHTML = `${city}, ${state}`
        getWeather(coordinates);
    });
}

function printOutfit (temp) { 
    var outfits = { 
        hot:["T-shirt","Shorts"],
        warm:["T-shirt","Jeans"],
        chilly:["T-shirt","Jeans", "Sweater"],
        cold:["T-shirt","Pants", "Coat" ], 
        wintry:["Long Sleeves", "Pants", "Hoodie", "Winter Jacket", "Everything you own"]  
    }; 
    let myOutfit = 0; 
    if (temp >= 80) myOutfit = outfits.hot; 
    if (temp >= 65 && temp < 80) myOutfit = outfits.warm;
    if (temp >= 45 && temp < 64) myOutfit = outfits.chilly;
    if (temp >= 25 && temp < 44) myOutfit = outfits.cold;
    if (temp < 25) myOutfit = outfits.chilly;

    // return myOutfit; 
    for (i = 0; i < myOutfit.length; i++){
        console.log(myOutfit[i]);
    }
}

function getWeather(coordinates) {
    let tempHtml = document.getElementById("feelsLike")

    let tmrTempHigh = document.getElementById("tmrTempHigh")
    let tmrTempLow = document.getElementById("tmrTempLow")
    let tmrRain= document.getElementById("tmrRainChance")

    let lat = coordinates[1];
    let lon = coordinates[0];
    let url = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/1387466109e308e8de851d6f09a87c39/${lat},${lon}`;

    get(url).then(function(response) {
        // Storing appropriate values
        let apparentTemp = response.currently.apparentTemperature;
        let tmrwTempHighValue = response.daily.data[0].apparentTemperatureHigh
        let tmrwTempLowValue = response.daily.data[0].apparentTemperatureLow
        let tmrwRainChanceValue = response.daily.data[0].precipProbability * 100
        
        // Populate DOM with weather data
        tempHtml.innerHTML = `${apparentTemp}&#176F`
        tmrTempHigh.innerHTML = `${tmrwTempHighValue}&#176F`
        tmrTempLow.innerHTML = `${tmrwTempLowValue}&#176F`
        tmrRain.innerHTML = `${tmrwRainChanceValue}&#37;`

        // Call printOutfit 
        // printOutfit(apparentTemp);
    });
}

function getIcon(zip) {
    let u = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&APPID=c7d69379e4f97e2b0e42695dddb0ad27`;
    const iconImg = document.getElementById("weatherIcon");
    
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

// IIFE with default city Atlanta, GA
(function(){
    convertZipToCoordinates(30342)
    getIcon(30342)
})();
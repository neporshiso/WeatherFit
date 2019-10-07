/* API Counter  

1. public.opendatasoft.com API:  Take a zipcode. Give lat/lon and city/state.
2. DarkSky API: Temperatures and Precipitation Chance
3. Open Weather: Weather Icon
4. [In Progress]: Unofficial ASOS for Clothing

*/
function getDate() {
    var currentDate = new Date();
    var options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    let todayDate = document.getElementById("currentDate");
    todayDate.innerHTML = new Intl.DateTimeFormat("en-US", options).format(
        currentDate
    );
}

function get(url) {
    return fetch(url)
        .then(response => response.json())
        .then(data => data);
}

modalBtn.addEventListener("click", function(e) {
    e.preventDefault();
    modal.style.display = "block";
});

closeBtn.onclick = function() {
    modal.style.display = "none";
};

window.onclick = function(e) {
    if (e.target == modal) {
        modal.style.display = "none";
    }
};

// When the zip code form is submitted, grab the zip code, convert it to coordinates and get the weather data and icon
zipcodeForm.addEventListener("submit", function(event) {
    event.preventDefault();
    let clothesToday = document.getElementById("todayClothes");
    let clothesTomorrow = document.getElementById("tomorrowClothes");

    clothesTomorrow.innerHTML = "";
    clothesToday.innerHTML = "";

    let zipcodeValue = document.getElementById("zipcodeInput").value;
    convertZipToCoordinates(zipcodeValue);
    getIcon(zipcodeValue);
});

function convertZipToCoordinates(zip) {
    const location = document.getElementById("todayLocation");
    get(
        `https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude&q=${zip}&facet=state&facet=timezone&facet=dst`
    ).then(function(response) {
        let coordinates = response.records[0].geometry.coordinates;
        let city = response.records[0].fields.city;
        let state = response.records[0].fields.state;
        location.innerHTML = `${city}, ${state}`;
        getWeather(coordinates);
    });
}

function printOutfit(temp, temp2, todayPrecip, tmrwPrecip) {
    let clothesToday = document.getElementById("todayClothes");
    let clothesTomorrow = document.getElementById("tomorrowClothes");
    let todayPrecipPercentage = Math.round(todayPrecip * 100);
    let todayPrecipSpan = document.getElementById("todayPrecip");

    todayPrecipSpan.innerHTML = `${todayPrecipPercentage}%`;

    var outfits = {
        hot: [
            "images/shorts.png",
            "images/whitetshirt.png",
            "images/dress.png"
        ],
        warm: [
            "images/greytshirt.png",
            "images/jeans.png",
            "images/dress.png",
            "images/sweatshirt.png",
            "images/shorts.png"
        ],
        chilly: [
            "images/whitetshirt.png",
            "images/sweatpants.png",
            "images/sweatshirt.png",
            "images/blackjacket.png",
            "images/dress.png",
            "images/jeans.png"
        ],
        cold: [
            "images/greytshirt.png",
            "images/jeans.png",
            "images/coat.png",
            "images/scarf.png",
            "images/blackjacket.png",
        ],
        wintry: [
            "images/freezing.png"
        ]
    };

    let myOutfit = 0;

    if (temp >= 80) myOutfit = outfits.hot;
    if (temp >= 65 && temp < 80) myOutfit = outfits.warm;
    if (temp >= 45 && temp < 64) myOutfit = outfits.chilly;
    if (temp >= 25 && temp < 44) myOutfit = outfits.cold;
    if (temp < 25) myOutfit = outfits.wintry;

    for (i = 0; i < myOutfit.length; i++) {
        newImg = document.createElement("img");
        newImg.setAttribute("src", myOutfit[i]);
        newImg.setAttribute("class", "round image is-128x128");
        clothesToday.append(newImg);
    }

    if (todayPrecip > 0.35) {
        newImg = document.createElement("img");
        newImg.setAttribute("src", "images/umbrella.png");
        newImg.setAttribute("class", "round image is-128x128");
        clothesToday.append(newImg);
    }

    let myTomorrowOutfit = 0;
    if (temp2 >= 80) myTomorrowOutfit = outfits.hot;
    if (temp2 >= 65 && temp2 < 80) myTomorrowOutfit = outfits.warm;
    if (temp2 >= 45 && temp2 < 64) myTomorrowOutfit = outfits.chilly;
    if (temp2 >= 25 && temp2 < 44) myTomorrowOutfit = outfits.cold;
    if (temp2 < 25) myTomorrowOutfit = outfits.wintry;

    for (j = 0; j < myTomorrowOutfit.length; j++) {
        newImg2 = document.createElement("img");
        newImg2.setAttribute("src", myTomorrowOutfit[j]);
        newImg2.setAttribute("class", "round image is-128x128");
        clothesTomorrow.append(newImg2);
    }

    if (tmrwPrecip > 0.35) {
        newImg = document.createElement("img");
        newImg.setAttribute("src", "images/umbrella.png");
        newImg.setAttribute("class", "round image is-128x128");
        clothesTomorrow.append(newImg);
    }
    return myOutfit;
}

function getWeather(coordinates) {
    let tempHtml = document.getElementById("feelsLike");
    let tmrTempHigh = document.getElementById("tmrTempHigh");
    let tmrTempLow = document.getElementById("tmrTempLow");
    let tmrRain = document.getElementById("tmrRainChance");

    let hourlyPrecipProb = [];

    let lat = coordinates[1];
    let lon = coordinates[0];
    let url = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/1387466109e308e8de851d6f09a87c39/${lat},${lon}`;

    get(url).then(function(response) {
        // Storing appropriate values
        let apparentTemp = response.currently.apparentTemperature;
        let tmrwTempHighValue = response.daily.data[0].apparentTemperatureHigh;
        let tmrwTempLowValue = response.daily.data[0].apparentTemperatureLow;
        let tmrwRainChanceValue =
            response.daily.data[0].precipProbability * 100;
        let tmrwRainChanceDec = response.daily.data[0].precipProbability;

        // loop over every hours precip probability and store in an array
        response.hourly.data.forEach(element => {
            hourlyPrecipProb.push(element.precipProbability);
        });

        // grab max precip value from array
        let maxHourlyProb = Math.max(...hourlyPrecipProb);

        // Populate DOM with weather data
        tempHtml.innerHTML = `${Math.round(apparentTemp)}&#176F`;
        tmrTempHigh.innerHTML = `${Math.round(tmrwTempHighValue)}&#176F`;
        tmrTempLow.innerHTML = `${Math.round(tmrwTempLowValue)}&#176F`;
        tmrRain.innerHTML = `${Math.round(tmrwRainChanceValue)}&#37;`;

        // Call printOutfit
        printOutfit(
            apparentTemp,
            tmrwTempLowValue,
            maxHourlyProb,
            tmrwRainChanceDec
        );
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
(function() {
    convertZipToCoordinates(30318);
    getIcon(30318);
    getDate();
})();

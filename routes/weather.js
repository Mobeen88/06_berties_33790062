
//Create new routers
const express = require("express");
const router = express.Router();
const request = require("request");

//render form
router.get("/", (req, res, next) => {
  let apiKey = process.env.WEATHER_API_KEY;
  let queryCity = (req.query.city || "").trim();
  let city = queryCity;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  //if city is null
  if(!queryCity){
    return res.render("weather", { weather: null, error: null, city: "" });
  }

  request(url, function (err, response, body) {
    if(err) return next(err);

    let weather;
    try{ weather = JSON.parse(body); }
    catch(e){
      return res.render("weather", { weather: null, error: "Unable to parse weather data.", city });
    }

    if(!weather || !weather.main) {
      //API returns an error or no data
      return res.render("weather", { weather: null, error: weather && weather.message ? weather.message : "City not found.", city });
    }

    res.render("weather", { weather, error: null, city });
  });
});

router.post("/results", (req, res, next) => {
  let apiKey = process.env.WEATHER_API_KEY;
  let city = (req.body.city || "").trim();
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  if(!city) {
    return res.render("weather", { weather: null, error: "Please enter a city name.", city: "" });
  }

  request(url, function (err, response, body) {
    if(err) return next(err);

    let weather;
    try{ weather = JSON.parse(body); }
    catch(e){
      return res.render("weather", { weather: null, error: "Unable to parse weather data.", city });
    }

    if(!weather || !weather.main) {
      return res.render("weather", { weather: null, error: weather && weather.message ? weather.message : "City not found.", city });
    }

    res.render("weather", { weather, error: null, city });
  });
});

router.get("/now", (req, res, next) => {
  let apiKey = process.env.WEATHER_API_KEY;
  let city = req.query.city || "london";
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  request(url, function (err, response, body) {
    if(err) return next(err);

    let weather;
    try{ weather = JSON.parse(body); }
    catch(e){ 
        return res.send("Invalid weather data returned."); 
    }

    if(!weather || !weather.main){
      return res.send("No data found");
    }

    const wmsg =
      "It is " + weather.main.temp + "°C in " + weather.name +
      "!<br>Humidity: " + weather.main.humidity +
      "<br>Wind: " + (weather.wind && weather.wind.speed ? weather.wind.speed + " m/s" : "N/A");

    res.send(wmsg);
  });
});


// Export the router object so index.js can access it
module.exports = router
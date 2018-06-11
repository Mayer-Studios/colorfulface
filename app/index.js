function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

import document from "document";
import clock from "clock";
import Weather from '../common/weather/device'
import { HeartRateSensor } from "heart-rate";
import * as messaging from "messaging"
import { today } from 'user-activity';
import * as util from "../common/utils";
import { preferences } from "user-settings";
import { battery } from "power";
import { charger } from "power";
import { user } from "user-profile";
import { units } from "user-settings";




console.log("App Started");

let myDate = document.getElementById("myDate");
let myTime = document.getElementById("myTime");
let myHR = document.getElementById("myHR");
//let mySteps = document.getElementById("mySteps");
let myPower = document.getElementById("myPower")
let myTemp = document.getElementById("myTemp");
let myDescription = document.getElementById("myDescription");
let myLocation = document.getElementById("myLocation")
let myImage = document.getElementById("myImage")
let myImage = document.getElementById("myImage")
let mySteps = document.getElementById("mySteps")
let myCalories = document.getElementById("myCalories")
let myActiveMinutes = document.getElementById("myActiveMinutes")

clock.granularity = 'seconds';

let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];l
let months = ["Jan", "Feb",  "Mar",  "Apr",  "May",  "Jun",  "Jul",  "Aug",  "Sep",  "Oct",  "Nov", "Dec"];

clock.ontick = function(evt) {
    let today = evt.date;
  let hours = today.getHours();
  let seconds = util.zeroPad(today.getSeconds());
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
    }
  else {
    // 24h format
    hours = util.zeroPad(hours);
    }
  let mins = util.zeroPad(today.getMinutes());
  myTime.text = `${hours}:${mins}`;
  
    myDate.text =  days[evt.date.getDay()]
                    + "                                 " + months[evt.date.getMonth()] 
                    + " " + evt.date.getDate();
                  //  + " " + evt.date.getFullYear();
}
    
//--- Add heart rate monitor. ---------------------------------------------------------------
var hrm = new HeartRateSensor();

hrm.start();
function refresh_myHR() {
    myHR.text = "" + hrm.heartRate
    };

setInterval(refresh_myHR, 1000);

//Add Batery Meter--------------------------------------------------------------------------
function refresh_myPower() {
myPower.text = (Math.floor(battery.chargeLevel) + "%") + (" " + (charger.connected ? "Charging..." : " ") + "");
};

setInterval(refresh_myPower, 1000);
//Add Weather For <Tap>------------------------------------------------------------------------
// Import the weather module

let provider = 0
// Enter your own api keys below
const PROVIDERS = [
  { name : 'yahoo', key : '' },
  { name : 'owm', key : '' },
  { name : 'wunderground', key : '' },
  { name : 'darksky', key : '' },
  { name : 'weatherbit', key : '' }
]

// Create the weather object
let weather = new Weather()

let showWeather = function(data){
  if (data) {
    if (units.temperature == "F")
    myTemp.text =  data.temperatureF + " °F";
    
  else
    myTemp.text = data.temperatureC + " °C";
    
    myDescription.text = data.description
    myLocation.text = data.location
  }
}

// Display the weather data received from the companion
weather.onsuccess = showWeather

weather.onerror = (error) => {
  console.log("Weather error " + JSON.stringify(error))
  
  document.getElementById("location").text = JSON.stringify(error)
}

let fetchWeather = function(){
  // Set the provider : yahoo / owm / wunderground / darksky / weatherbit
  weather.setProvider(PROVIDERS[provider].name)
  // set your api key
  weather.setApiKey(PROVIDERS[provider].key)
  
  
  weather.fetch()
}

showWeather( weather.getData() )

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  fetchWeather()
}


//Add Tap for your stats--------------------------------------------------
var hiddenButton = document.getElementById("hiddenButton");



function refresh_myActivity() {
mySteps.text = today.adjusted.steps + " Steps"
  myCalories.text = today.adjusted.calories + " Cals"
  myActiveMinutes.text = today.adjusted.activeMinutes + " Active Mins"

}


setInterval(refresh_myActivity, 50); 

function showElement(element) {
    element.style.display = "inline";
}
function hideElement(element) {
    element.style.display = "none";
}


hiddenButton.onactivate = function (evt) {
    
    
    showElement(mySteps);
  showElement(myCalories);
  showElement(myActiveMinutes);
  showElement(myTemp);
  showElement(myDescription);
  showElement(myLocation);
  hideElement(myTime);
  hideElement(myDate);
  hideElement(myHR);
 hideElement(myImage);
  hideElement(myPower);
  
    
  setTimeout(function () {
        hideElement(mySteps);
        hideElement(myCalories);
    hideElement(myActiveMinutes);
     hideElement(myTemp);
  hideElement(myDescription);
  hideElement(myLocation);
   
      showElement(myTime);
      showElement(myDate);
      showElement(myHR);
      showElement(myImage);
    showElement(myPower);
      
    }, 10000);
};
hideElement(mySteps);
hideElement(myCalories);
hideElement(myActiveMinutes);
showElement(myTime);
showElement(myDate);
showElement(myPower);
showElement(myImage);
 hideElement(myTemp);
  hideElement(myDescription);
  hideElement(myLocation)


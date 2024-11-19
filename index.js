// const { default: axios } = require("axios");
const CityName = document.getElementById('city');
const CitiesList = document.getElementById('CitiesList');
const dropdown = document.getElementById('dropdown');
const hijriya = document.getElementById('hijri');
const miladiya = document.getElementById('miladi');
const search = document.getElementById('default-search');
const fajrTime = document.getElementById('fajr');
const sunriseTime = document.getElementById('sunrise');
const dhuhrTime = document.getElementById('dohr');
const asrTime = document.getElementById('asr');
const maghribTime = document.getElementById('maghrib');
const ishaTime = document.getElementById('isha');
const TimeRest = document.getElementById('TimeRest');
const prayName = document.getElementById('prayName');

fetch('./Cities.Json')
    .then(response => response.json())
    .then(data => {
              const cities = data.moroccan_cities;
                CitiesList.innerHTML = '';
              showCities(cities);
      })
function showCities(cities){
        cities.forEach(city => {
            const span = document.createElement('span');
    span.classList.add("block","text-right", "cursor-pointer", "px-4", "py-2", "hover:bg-gray-100");
    span.appendChild(document.createTextNode(city.city));
    span.addEventListener('click', () => {
            console.log("City selected:", city.city);
            getPrayerTimes(city.city);
        });

    const li = document.createElement('li');
    li.appendChild(span);
    CitiesList.appendChild(li);
        }); 
}

CitiesList.addEventListener('click', function(event) {
  if (event.target && event.target.matches('span')) {
    event.stopPropagation()
        CityName.innerHTML = event.target.textContent;
        dropdown.classList.toggle('hidden');
        dropdown.classList.toggle('block');
        dropdown.style.transform = `translate3d(154.4px, 198.4px, 0px)`;
        dropdown.setAttribute('data-popper-placement', 'bottom');
    }
});


///////////////////////////////////////////////////////////////////////////////////////////////////
            ///////////////hijriya //////////////////////////////////
var today = new Date();
var hours = today.getHours(); 
var minutes = today.getMinutes(); 

var time = hours + ":" + (minutes < 10 ? "0" : "") + minutes;

// Format the date as YYYY-MM-DD
var formattedDate = today.getDate().toString().padStart(2, '0') + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getFullYear() ;
// Fetch Hijri date using the formatted date
fetch(`http://api.aladhan.com/v1/gToH/${formattedDate}`)
  .then(response => response.json())
  .then(data => {
        formattedDate = data.data.hijri.weekday.ar+' '+ data.data.hijri.day + ' ' + data.data.hijri.month.ar + ' ' + data.data.hijri.year + ' ه';
        hijriya.innerHTML = formattedDate;
  })
  .catch(error => console.error('Error:', error));
          ////////////////////////////////// miladiya ////////////////////////////////////////

    // Format date in en-US (English) locale
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
     formattedDate = today.toLocaleDateString('en-US', options);

    // Arabic translations for days and months
    const daysInEnglish = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const daysInArabic = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

    const monthsInEnglish = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthsInArabic = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

    // Remove any commas and split the date string into components
   const dateParts = formattedDate.replace(/,/g, '').split(' '); // This will remove all commas

    // Extract the individual parts from the date
    const dayName = dateParts[0]; // Example: "Sunday"
    const monthName = dateParts[1]; // Example: "November"
    const day = dateParts[2]; // Example: "17"
    const year = dateParts[3]; // Example: "2024"
    // Map the English names to Arabic equivalents
    const arabicDayName = daysInArabic[daysInEnglish.indexOf(dayName)];
    const arabicMonthName = monthsInArabic[monthsInEnglish.indexOf(monthName)];

    // Format the Arabic date string
    const arabicDate = `${arabicDayName}، ${day} ${arabicMonthName} ${year}`;
    miladiya.innerHTML = arabicDate+' م';

    ////////////////////////////////////////////////////////////////////////////////////////////////
    if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    var fetchedData=null;
    var CityInAr=null;

    console.log("Latitude: " + latitude);
    console.log("Longitude: " + longitude);
fetch(`https://us1.locationiq.com/v1/reverse?key=pk.1f9a63171128418c8232f7a106d41a29&lat=${latitude}&lon=${longitude}&format=json&lang=ar`)
  .then(response => response.json())
  .then(data => {
    
    if(data.address.city == null)
        fetchedData = data.address.town;
    else
        fetchedData = data.address.city;
    console.log(fetchedData+"hbhj");
    getPrayerTimes(fetchedData);
    CityInAr=getCityInArabic(fetchedData);
  })
.catch(error => {
    console.error('Error:', error);
    getPrayerTimes('Rabat');
  });    // You can use these coordinates for further actions, such as calling a geolocation API
  }, function(error) {
    console.error("Error Code: " + error.code + " - " + error.message);
  });
} else {
  console.log("Geolocation is not supported by this browser.");
}
function getCityInArabic(cityName) {
  fetch('./TranslateCities.Json')
    .then(response => response.json())
    .then(data => {
        const cities = data.cities;
      const city = cities[cityName];
      CityName.innerHTML = city.ar;
      console.log(city.en);
})
}
  search.addEventListener( 'input',() => {
      const input = search.value;
    fetch('./Cities.Json')
    .then(response => response.json())
    .then(data => {
        const cities = data.moroccan_cities;
        const filteredCities = cities.filter(city => city.city.toLowerCase().includes(input.toLowerCase()));
        CitiesList.innerHTML = '';
        showCities(filteredCities);

    })

})



/////////////////////////////////prays times /////////////////////////////////////////////
function getCity(city) {
    fetch('./Cities.Json')
    .then(response => response.json())
    .then(data => {
        const cities = data.TranslateCities;
        const filteredCities = cities.filter(city => city.city.toLowerCase().includes(input.toLowerCase()));
        CitiesList.innerHTML = '';
    })
}
function getPrayerTimes(city){console.log(city+'hh');
  axios.get(`http://api.aladhan.com/v1/timingsByCity/current?city=${city}&country=Morocco&method=3`)
.then(response => {
        const timings = response.data.data.timings;
        const prayerTimes = [
            { name: "الفجر", time: timings.Fajr },
            { name: "الشروق", time: timings.Sunrise },
            { name: "الظهر", time: timings.Dhuhr },
            { name: "العصر", time: timings.Asr },
            { name: "المغرب", time: timings.Maghrib },
            { name: "العشاء", time: timings.Isha },
        ];

        const nextPrayer = getNextPrayer(time, prayerTimes);
        console.log(
            `الوقت المتبقي للصلاة ${nextPrayer.name}: ${formatTime(nextPrayer.timeDiff)}`
        );
        TimeRest.innerHTML = nextPrayer.name+formatTime(nextPrayer.timeDiff);
  fajrTime.innerHTML = timings.Fajr;
  sunriseTime.innerHTML = timings.Sunrise ;
  dhuhrTime.innerHTML = timings.Dhuhr;
  asrTime.innerHTML = timings.Asr;
  maghribTime.innerHTML = timings.Maghrib;
  ishaTime.innerHTML = timings.Isha;
  console.log(timings.Fajr,timings.Sunrise, timings.Dhuhr,timings.Asr ,timings.Maghrib,timings.Isha);
  
    })
    .catch(error => {
        console.error(error);
    });
}




    //////////////////////////////// count down //////////////////////////////////////////////
function compareTimes(time1, time2) {
    const convertToMinutes = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const diff = convertToMinutes(time1) - convertToMinutes(time2);
    return diff;
}

function formatTime(minutes) {
    const hours = Math.floor(Math.abs(minutes) / 60);
    const mins = Math.abs(minutes) % 60;
    const h='ساعات و';
    const m='دقيقة';
    return ` بعد ${hours} ${h} ${mins}  ${m} `;
}

function getNextPrayer(time, prayerTimes) {
    const convertToMinutes = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const currentMinutes = convertToMinutes(time);

    // Iterate through prayer times and find the next prayer
    for (const prayer of prayerTimes) {
        const prayerMinutes = convertToMinutes(prayer.time);
        if (prayerMinutes > currentMinutes) {
            return { ...prayer, timeDiff: prayerMinutes - currentMinutes };
        }
    }

    // If all prayers have passed, return Fajr for the next day
    const fajrTomorrow = prayerTimes[0]; // Assuming Fajr is the first in the array
    const totalMinutesInDay = 24 * 60;
    const fajrMinutes = convertToMinutes(fajrTomorrow.time);
    return {
        ...fajrTomorrow,
        timeDiff: totalMinutesInDay - currentMinutes + fajrMinutes,
    };
}





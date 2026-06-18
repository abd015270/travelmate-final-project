const cities = [
  {
    city: "New York",
    country: "USA",
    airline: "American Airlines",
    lat: 40.7128,
    lng: -74.006,
    flightHours: 12,
    image:
      "https://images.unsplash.com/photo-1534430480872-3498386e7856",
  },
  {
    city: "Los Angeles",
    country: "USA",
    airline: "United Airlines",
    lat: 34.0522,
    lng: -118.2437,
    flightHours: 13,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  },
  {
    city: "Miami",
    country: "USA",
    airline: "American Airlines",
    lat: 25.7617,
    lng: -80.1918,
    flightHours: 13,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  },
  {
    city: "Paris",
    country: "France",
    airline: "Air France",
    lat: 48.8566,
    lng: 2.3522,
    flightHours: 5,
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
  },
  {
    city: "London",
    country: "United Kingdom",
    airline: "British Airways",
    lat: 51.5074,
    lng: -0.1278,
    flightHours: 5,
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad",
  },
  {
    city: "Rome",
    country: "Italy",
    airline: "ITA Airways",
    lat: 41.9028,
    lng: 12.4964,
    flightHours: 4,
    image:
      "https://images.unsplash.com/photo-1529260830199-42c24126f198",
  },
  {
    city: "Madrid",
    country: "Spain",
    airline: "Iberia",
    lat: 40.4168,
    lng: -3.7038,
    flightHours: 5,
    image:
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4",
  },
  {
    city: "Barcelona",
    country: "Spain",
    airline: "Vueling Airlines",
    lat: 41.3874,
    lng: 2.1686,
    flightHours: 5,
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded",
  },
  {
    city: "Berlin",
    country: "Germany",
    airline: "Lufthansa",
    lat: 52.52,
    lng: 13.405,
    flightHours: 4,
    image:
      "https://images.unsplash.com/photo-1560969184-10fe8719e047",
  },
  {
    city: "Amsterdam",
    country: "Netherlands",
    airline: "KLM",
    lat: 52.3676,
    lng: 4.9041,
    flightHours: 5,
    image:
      "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4",
  },
  {
    city: "Istanbul",
    country: "Turkey",
    airline: "Turkish Airlines",
    lat: 41.0082,
    lng: 28.9784,
    flightHours: 2,
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200",
  },
  {
    city: "Dubai",
    country: "UAE",
    airline: "Emirates Airlines",
    lat: 25.2048,
    lng: 55.2708,
    flightHours: 3,
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
  },
  {
    city: "Abu Dhabi",
    country: "UAE",
    airline: "Etihad Airways",
    lat: 24.4539,
    lng: 54.3773,
    flightHours: 3,
    image:
      "https://images.unsplash.com/photo-1518684079-3c830dcef090",
  },
  {
    city: "Doha",
    country: "Qatar",
    airline: "Qatar Airways",
    lat: 25.2854,
    lng: 51.531,
    flightHours: 3,
    image:
      "https://images.unsplash.com/photo-1569154941061-e231b4725ef1",
  },
  {
    city: "Riyadh",
    country: "Saudi Arabia",
    airline: "Saudia",
    lat: 24.7136,
    lng: 46.6753,
    flightHours: 2,
    image:
      "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6",
  },
  {
    city: "Cairo",
    country: "Egypt",
    airline: "EgyptAir",
    lat: 30.0444,
    lng: 31.2357,
    flightHours: 1,
    image:
      "https://images.unsplash.com/photo-1572252009286-268acec5ca0a",
  },
  {
    city: "Sharm El Sheikh",
    country: "Egypt",
    airline: "EgyptAir",
    lat: 27.9158,
    lng: 34.33,
    flightHours: 1,
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd",
  },
  {
    city: "Tokyo",
    country: "Japan",
    airline: "Japan Airlines",
    lat: 35.6762,
    lng: 139.6503,
    flightHours: 12,
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
  },
  {
    city: "Seoul",
    country: "South Korea",
    airline: "Korean Air",
    lat: 37.5665,
    lng: 126.978,
    flightHours: 11,
    image:
      "https://images.unsplash.com/photo-1538485399081-7191377e8241",
  },
  {
    city: "Bangkok",
    country: "Thailand",
    airline: "Thai Airways",
    lat: 13.7563,
    lng: 100.5018,
    flightHours: 9,
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365",
  },
  {
    city: "Singapore",
    country: "Singapore",
    airline: "Singapore Airlines",
    lat: 1.3521,
    lng: 103.8198,
    flightHours: 10,
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd",
  },
  {
    city: "Sydney",
    country: "Australia",
    airline: "Qantas",
    lat: -33.8688,
    lng: 151.2093,
    flightHours: 17,
    image:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9",
  },
  {
    city: "Toronto",
    country: "Canada",
    airline: "Air Canada",
    lat: 43.6532,
    lng: -79.3832,
    flightHours: 12,
    image:
      "https://images.unsplash.com/photo-1517935706615-2717063c2225",
  },
  {
    city: "Moscow",
    country: "Russia",
    airline: "Aeroflot",
    lat: 55.7558,
    lng: 37.6173,
    flightHours: 5,
    image:
      "https://images.unsplash.com/photo-1513326738677-b964603b136d",
  },
  {
    city: "Athens",
    country: "Greece",
    airline: "Aegean Airlines",
    lat: 37.9838,
    lng: 23.7275,
    flightHours: 3,
    image:
      "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb",
  },
  {
    city: "Zurich",
    country: "Switzerland",
    airline: "Swiss International Air Lines",
    lat: 47.3769,
    lng: 8.5417,
    flightHours: 5,
    image:
      "https://images.unsplash.com/photo-1515488764276-beab7607c1e6",
  },
  {
    city: "Vienna",
    country: "Austria",
    airline: "Austrian Airlines",
    lat: 48.2082,
    lng: 16.3738,
    flightHours: 4,
    image:
      "https://images.unsplash.com/photo-1516550893885-985c6278f408",
  },
  {
    city: "Prague",
    country: "Czech Republic",
    airline: "Czech Airlines",
    lat: 50.0755,
    lng: 14.4378,
    flightHours: 4,
    image:
      "https://images.unsplash.com/photo-1541849546-216549ae216d",
  },
  {
    city: "Kuala Lumpur",
    country: "Malaysia",
    airline: "Malaysia Airlines",
    lat: 3.139,
    lng: 101.6869,
    flightHours: 10,
    image:
      "https://images.unsplash.com/photo-1596422846543-75c6fc197f07",
  },
  {
    city: "Los Cabos",
    country: "Mexico",
    airline: "Aeromexico",
    lat: 22.8905,
    lng: -109.9167,
    flightHours: 15,
    image:
      "https://images.unsplash.com/photo-1512813195386-6cf811ad3542",
  },
];

export default cities;
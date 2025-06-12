const temperatureLevels = [
    {max: 0, label: `<i class="bi bi-thermometer-snow"></i>`},
    {max: 5, label: `<i class="fa-solid fa-temperature-empty"></i>`},
    {max: 10, label: `<i class="fa-solid fa-temperature-low"></i>`},
    {max: 15, label: `<i class="fa-solid fa-temperature-quarter"></i>`},
    {max: 20, label: `<i class="fa-solid fa-temperature-half"></i>`},
    {max: 25, label: `<i class="fa-solid fa-temperature-three-quarters"></i>`},
    {max: 30, label: `<i class="fa-solid fa-temperature-high"></i>`},
    {max: 35, label: `<i class="bi bi-thermometer-sun"></i>`},
]

function getTemperatureRating(celsius) {
    const level = temperatureLevels.find(l => celsius <= l.max);
    return level ? level.label : `<i class="fa-solid fa-temperature-full"></i>`;
}
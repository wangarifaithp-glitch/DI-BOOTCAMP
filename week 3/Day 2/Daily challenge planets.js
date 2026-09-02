const planets = [
    { name: 'Mercury', className: 'mercury', moons: 0 },
    { name: 'Venus', className: 'venus', moons: 0 },
    { name: 'Earth', className: 'earth', moons: 1 },
    { name: 'Mars', className: 'mars', moons: 2 },
    { name: 'Jupiter', className: 'jupiter', moons: 4 },
    { name: 'Saturn', className: 'saturn', moons: 3 },
    { name: 'Uranus', className: 'uranus', moons: 2 },
    { name: 'Neptune', className: 'neptune', moons: 2 }
];

const section = document.querySelector('.listPlanets');

planets.forEach((planet) => {
    const planetDiv = document.createElement('div');
    planetDiv.classList.add('planet', planet.className);
    planetDiv.textContent = planet.name;

    for (let i = 0; i < planet.moons; i++) {
        const moon = document.createElement('div');
        moon.classList.add('moon');

        const angle = (Math.PI * 2 * i) / planet.moons;
        const radius = 28;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        moon.style.left = `${50 + x}px`;
        moon.style.top = `${50 + y}px`;

        planetDiv.appendChild(moon);
    }

    section.appendChild(planetDiv);
});

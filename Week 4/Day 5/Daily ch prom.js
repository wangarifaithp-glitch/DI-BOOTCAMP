document.getElementById('sunrise-form').addEventListener('submit', fetchSunriseTimes);

// Helper function to fetch data for a single city coordinates set
async function fetchCitySunrise(lat, lng) {
  const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch data for coordinates: (${lat}, ${lng})`);
  }
  
  const data = await response.json();
  return data.results.sunrise;
}

// Main handler using Promise.all()
async function fetchSunriseTimes(event) {
  event.preventDefault();

  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = 'Fetching sunrise times...';

  // Get input values
  const lat1 = document.getElementById('lat1').value;
  const lng1 = document.getElementById('lng1').value;
  const lat2 = document.getElementById('lat2').value;
  const lng2 = document.getElementById('lng2').value;

  try {
    // Execute both fetch requests concurrently using Promise.all
    const [sunrise1, sunrise2] = await Promise.all([
      fetchCitySunrise(lat1, lng1),
      fetchCitySunrise(lat2, lng2)
    ]);

    // Format ISO string times into readable local times
    const time1 = new Date(sunrise1).toLocaleTimeString();
    const time2 = new Date(sunrise2).toLocaleTimeString();

    // Display both results ONLY after both promises resolve
    resultsDiv.innerHTML = `
      <p><strong>City 1 Sunrise:</strong> ${time1}</p>
      <p><strong>City 2 Sunrise:</strong> ${time2}</p>
    `;

  } catch (error) {
    console.error('Error fetching sunrise data:', error);
    resultsDiv.innerHTML = `<p style="color: red;">Error retrieving sunrise data. Please check inputs and try again.</p>`;
  }
}
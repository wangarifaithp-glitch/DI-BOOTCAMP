/* =============
   EXERCISE 1 : Giphy API - Basic fetch() with .then()
   ============================================================ */


const url1 = "https://api.giphy.com/v1/gifs/search?q=hilarious&rating=g&api_key=hpvZycW22qCjn5cRM1xtWB8NKq4dQ2My";

fetch(url1)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error("Error fetching data:", error));


/* ============================================================
   EXERCISE 2 : Giphy API - Search "sun", 10 results, offset 2
    */



const apiKey = "hpvZycW22qCjn5cRM1xtWB8NKq4dQ2My";
const url2 = `https://api.giphy.com/v1/gifs/search?q=sun&rating=g&limit=10&offset=2&api_key=${apiKey}`;

fetch(url2)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error("Error fetching data:", error));

/* ==
   /* ============================================================
   EXERCISE 3 : Async function - Star Wars API
   ============================================================ */


async function getStarship() {
    try {
        const response = await fetch("https://www.swapi.tech/api/starships/9/");

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const objectStarWars = await response.json();
        console.log(objectStarWars.result);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

getStarship();


/* ============================================================
   EXERCISE 4 : Analyze - resolveAfter2Seconds / asyncCall
   ============================================================ */



function resolveAfter2Seconds() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('resolved');
        }, 2000);
    });
}

async function asyncCall() {
    console.log('calling');
    let result = await resolveAfter2Seconds();
    console.log(result);
}

asyncCall();



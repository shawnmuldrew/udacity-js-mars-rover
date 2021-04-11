let store = {
    user: { name: "Student" },
    apod: '',
    rovers: [ { name: 'Curiosity',
                image: 'assets/images/spirit_resize.jpg'},
                { name: 'Opportunity',
                image: 'assets/images/opportunity_resize.jpg'},
                { name: 'Spirit',
                image: 'assets/images/spirit_resize.jpg'},
                { name: 'Perseverance',
                image: 'assets/images/perseverance_resize.jpg'}                
            ],
    roverData: '',
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { rovers, apod, roverData } = state
    return `
        <header></header>
        <main>
            ${Greeting(store.user.name)}
            <section>
                <h2>Mars Rovers</h2>
                <div class="grid">
                    ${ShowRoverList(rovers)}
                </div>
                ${ShowRoverData(roverData)}
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
    //Test getting rover data
    getRoverData('curiosity');
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

const ShowRoverList = (rovers) => {
    roverList = '';
    rovers.forEach(rover => {
        roverList += 
        `<article>
            <img src="${rover.image}" alt="${rover.name}">
            <h3 class="rover-text">${rover.name} Rover</h3>
            <button class="rover-button">Show Images</button>
        </article>`
    })
    return roverList;
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    //console.log(photodate.getDate(), today.getDate());

    //console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        //getImageOfTheDay(store)
        getImageOfTheDay()
    }

    // check if the photo of the day is actually type video!
    if (apod) {
        if (apod.media_type === "video") {
            return (`
                <p>See today's featured video <a href="${apod.url}">here</a></p>
                <p>${apod.title}</p>
                <p>${apod.explanation}</p>
            `)
        } else {
            return (`
                <img src="${apod.image.url}" height="350px" width="100%" />
                <p>${apod.image.explanation}</p>
            `)
        }
    }
}

const ShowRoverData = (roverData) => {

    if (roverData) {
    
        return (`
            <p>Rover: ${roverData.roverInfo.photo_manifest.name}</p>
            <p>Landing Date: ${roverData.roverInfo.photo_manifest.landing_date}</p>
            <p>Launch Date: ${roverData.roverInfo.photo_manifest.launch_date}</p>
        `)
    }
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = () => {
    // let { apod } = state

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))

    //return data
}

const getRoverData = (roverName) => {
    fetch(`http://localhost:3000/rover?name=${roverName}`)
        .then(res => res.json())
        .then(roverData => updateStore(store, { roverData }))
}



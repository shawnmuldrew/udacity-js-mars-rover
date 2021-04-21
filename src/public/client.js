let store = {
    user: { name: "Student" },
    apod: '',
    rovers: [ { name: 'Curiosity',
                image: 'assets/images/curiosity_resize.jpg'},
                { name: 'Opportunity',
                image: 'assets/images/opportunity_resize.jpg'},
                { name: 'Spirit',
                image: 'assets/images/spirit_resize.jpg'},
                { name: 'Perseverance',
                image: 'assets/images/perseverance_resize.jpg'}                
            ],
    roverData: '',
    roverImages: '',
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
    let { rovers, apod, roverData, roverImages } = state
    return `
        <header></header>
        <main>
            <section>
                <h2>Mars Rovers</h2>
                <p>Learn about the Mars rovers and view pictures they took of the planet</p>
                <div class="grid">
                    ${ShowRoverList(rovers)}
                </div>
                ${ShowRoverData(roverData)}
            </section>
            ${ShowRoverImages(roverImages)}
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
// const Greeting = (name) => {
//     if (name) {
//         return `
//             <h1>Welcome, ${name}!</h1>
//         `
//     }

//     return `
//         <h1>Hello!</h1>
//     `
// }

const ShowRoverList = (rovers) => {
    console.log('In ShowRoverList')
    roverList = '';
    rovers.forEach(rover => {
        roverList += 
        `<article>
            <img src="${rover.image}" alt="${rover.name}">
            <h3 class="rover-text">${rover.name}</h3>
            <button class="rover-button" id="rover-${rover.name}-btn" onclick="getRoverData('${rover.name}')">Learn more</button>
        </article>`
    })
    return roverList;
}

// // Example of a pure function that renders infomation requested from the backend
// const ImageOfTheDay = (apod) => {

//     // If image does not already exist, or it is not from today -- request it again
//     const today = new Date()
//     const photodate = new Date(apod.date)
//     //console.log(photodate.getDate(), today.getDate());

//     //console.log(photodate.getDate() === today.getDate());
//     if (!apod || apod.date === today.getDate() ) {
//         //getImageOfTheDay(store)
//         getImageOfTheDay()
//     }

//     // check if the photo of the day is actually type video!
//     if (apod) {
//         if (apod.media_type === "video") {
//             return (`
//                 <p>See today's featured video <a href="${apod.url}">here</a></p>
//                 <p>${apod.title}</p>
//                 <p>${apod.explanation}</p>
//             `)
//         } else {
//             return (`
//                 <img src="${apod.image.url}" height="350px" width="100%" />
//                 <p>${apod.image.explanation}</p>
//             `)
//         }
//     }
// }

const ShowRoverData = (roverData) => {
    console.log('In ShowRoverData')
    if (roverData) {
        return (`
            <h2>${roverData.roverInfo.photo_manifest.name} Rover mission is ${roverData.roverInfo.photo_manifest.status}</h2>
            <p>Landing Date: ${roverData.roverInfo.photo_manifest.landing_date}</p>
            <p>Launch Date: ${roverData.roverInfo.photo_manifest.launch_date}</p>
            <p>Photos Taken: ${roverData.roverInfo.photo_manifest.total_photos}</p>
            <p>Last Photo Date: ${roverData.roverInfo.photo_manifest.max_date}</p>
            <p>Sols of Photos: ${roverData.roverInfo.photo_manifest.max_sol}</p>
            <button class="rover-image-button" id="rover-images-${roverData.roverInfo.photo_manifest.name}-btn" onclick=getRoverImages('${roverData.roverInfo.photo_manifest.name}','${roverData.roverInfo.photo_manifest.max_sol}')>Show Images</button>
        `)
    } else {
        return ''
    }
}

const ShowRoverImages = (roverImages) => {
    console.log('In ShowRoverImages')
    if (roverImages) {
        let imageInfo = 
            `<h2>Images</h2> 
            <div class="image-row">
                <div class="image-column">`
    //TODO: 
    //   Do we want to display camera and other information about the photo               
    //   Do we want to resize the photos
    //   We need to remove photos when a diffeent rover to selected
        roverImages.roverImages.photos.forEach(photo => {
            imageInfo += `<img src="${photo.img_src}" alt="${photo.id}">`
        })
        imageInfo += `    </div>`
        imageInfo += `</div>`
        return imageInfo
    } else {
        return ''
    }
}

// ------------------------------------------------------  API CALLS

// // Example API call
// const getImageOfTheDay = () => {
//     // let { apod } = state

//     fetch(`http://localhost:3000/apod`)
//         .then(res => res.json())
//         .then(apod => updateStore(store, { apod }))

//     //return data
// }

// API call to retrieve data for a rover
const getRoverData = (roverName) => {
    fetch(`http://localhost:3000/rover?name=${roverName}`)
        .then(res => res.json())
        .then(roverData => updateStore(store, { roverData }))
}

// API call to retrieve images for a rover
const getRoverImages = (roverName, sol) => {
    fetch(`http://localhost:3000/images?name=${roverName}&sol=${sol}`)
        .then(res => res.json())
        .then(roverImages => updateStore(store, { roverImages }))
}


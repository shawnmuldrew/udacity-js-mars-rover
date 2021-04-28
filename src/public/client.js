
let store = Immutable.Map({
//let store = {
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
});

// Add our markup to the page
const root = document.getElementById('root')

// const updateStore = (store, newState) => {
//     store = Object.assign(store, newState)
//     render(root, store)
// }

const updateStore = (state, newState) => {
    store = state.merge(newState);
    render(root, store);
}

// const render = async (root, state) => {
//     root.innerHTML = App(state)
// }

const render = async (root, state) => {
    root.innerHTML = App(state.toJS())
}

// Create content
const App = (state) => {
    let { rovers, roverData, roverImages } = state
    return `
        <header></header>
        <main>
            <section>
                <h2>Mars Rovers</h2>
                <p>Learn about the rovers and view pictures they took of the planet Mars</p>
                <div class="grid">
                    ${ShowRoverList(rovers)}
                </div>
                ${ShowRoverData(roverData)}
                ${ShowRoverImages(roverImages)}
            </section>
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
            <button type="button" class="rover-button" id="rover-${rover.name}-btn" onclick="getRoverData('${rover.name}')">Learn more</button>
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
    if (roverData === 'getRoverData') {
        return (`<h2> Loading rover data...</h2>`)
    }
    else if (!roverData) {
        return ''
    }
    else {
        console.log(roverData.roverInfo.photo_manifest.photos[0].total_photos)
        const maxPhotoDay = roverData.roverInfo.photo_manifest.photos.reduce( (maxSol, currentSol) => {
            return maxSol.total_photos > currentSol.total_photos ? maxSol : currentSol
        })
        console.log(maxPhotoDay)
        return (`
            <h2>${roverData.roverInfo.photo_manifest.name} Rover mission is ${roverData.roverInfo.photo_manifest.status}</h2>
            <p>Landing Date: ${roverData.roverInfo.photo_manifest.landing_date}</p>
            <p>Launch Date: ${roverData.roverInfo.photo_manifest.launch_date}</p>
            <p>Photos Taken: ${roverData.roverInfo.photo_manifest.total_photos}</p>
            <p>Last Photo Date: ${roverData.roverInfo.photo_manifest.max_date}</p>
            <p>Sols of Photos: ${roverData.roverInfo.photo_manifest.max_sol}</p>
            <p>Sol ${maxPhotoDay.sol} (Earth Date: ${maxPhotoDay.earth_date}) was the day with the most photos. A total of ${maxPhotoDay.total_photos} snapshots were taken</p>
            <form onsubmit=getRoverImages('${roverData.roverInfo.photo_manifest.name}')>
                <label for="sol">Enter Sol Number for Images (between 1 and ${roverData.roverInfo.photo_manifest.max_sol}):</label><br>
                <input type="number" min="1" max="${roverData.roverInfo.photo_manifest.max_sol}" class="rover-image-input" id="sol-id" name="sol-name" placeholder="Enter Sol..." required>
                <button type="submit" class="rover-image-button" id="rover-images-${roverData.roverInfo.photo_manifest.name}-btn">Show Images</button>
            </form>
        `)
    }
}

const ShowRoverImages = (roverImages) => {
    console.log('In ShowRoverImages')
    if (roverImages === 'getRoverImages') {
        return (`<h2> Loading rover images...</h2>`)
    }
    else if (!roverImages) {
        return ''
    }
    else {
        let imageInfo = 
            `<h2>${roverImages.roverImages.photos[0].rover.name} Images for Sol ${roverImages.roverImages.photos[0].sol}</h2> 
            <div class="grid">`
    //TODO: 
    //   Count photos for that day with reduce function and ask for confirmation to return
    //   Use map function for something ??
    //   Day with most photos
    //   Count photos by each camera
    //   Show cameras for each rover
        roverImages.roverImages.photos.forEach(photo => {
            imageInfo += `<article>`
            imageInfo += `  <p>Camera: ${photo.camera.name}</p>`
            imageInfo += `  <img src="${photo.img_src}" alt="${photo.id}">`
            imageInfo += `</article>`
        })
        imageInfo += `</div>`
        return imageInfo
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
    roverData = 'getRoverData'
    roverImages = ''
    updateStore(store, { roverData, roverImages })
    fetch(`http://localhost:3000/rover?name=${roverName}`)
        .then(res => res.json())
        .then(roverData => updateStore(store, { roverData }))
}

// API call to retrieve images for a rover
const getRoverImages = (roverName) => {
    roverImages = 'getRoverImages'
    const solImages = document.getElementById('sol-id').value
    console.log('Sol: '+solImages)
    updateStore(store, { roverImages })
    fetch(`http://localhost:3000/images?name=${roverName}&sol=${solImages}`)
        .then(res => res.json())
        .then(roverImages => updateStore(store, { roverImages }))
}


// Data storage for rover information gathered from APIs
let store = Immutable.Map({
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

const updateStore = (state, newState) => {
    store = state.merge(newState);
    render(root, store);
}

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

// Listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

/**
* @description Configures the markup to show Mars rovers in cards with pictures. This is the initial display state of the app
* @param {Array} rovers - array of rover names and some nice pictures of the rovers to make the app pop!
* @returns {String} - html markup for rover cards 
*/
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

/**
* @description Configures the markup to show the requested rover data
* @param {Object} roverData - object with array of rover information
* @returns {String} - html markup for rover section of the app
*/
const ShowRoverData = (roverData) => {
    console.log('In ShowRoverData')
    if (roverData === 'getRoverData') {
        return (`<h2> Loading rover data...</h2>`)
    }
    else if (!roverData) {
        return ''
    }
    else {  
        const maxPhotoDay = roverData.photo_manifest.photos.reduce( (maxSol, currentSol) => {
            return maxSol.total_photos > currentSol.total_photos ? maxSol : currentSol
        })
        
        return (`
            <h2>${roverData.photo_manifest.name} Rover mission is ${roverData.photo_manifest.status}</h2>
            <p>Landing Date: ${roverData.photo_manifest.landing_date}</p>
            <p>Launch Date: ${roverData.photo_manifest.launch_date}</p>
            <p>Photos Taken: ${roverData.photo_manifest.total_photos}</p>
            <p>Last Photo Date: ${roverData.photo_manifest.max_date}</p>
            <p>Sols of Photos: ${roverData.photo_manifest.max_sol}</p>
            <p>Sol ${maxPhotoDay.sol} (Earth Date: ${maxPhotoDay.earth_date}) was the day with the most photos. A total of ${maxPhotoDay.total_photos} snapshots were taken</p><br>
            <form onsubmit=getRoverImages('${roverData.photo_manifest.name}')>
                <label for="sol">Enter Sol Number for Images (between 1 and ${roverData.photo_manifest.max_sol}):</label><br>
                <input type="number" min="1" max="${roverData.photo_manifest.max_sol}" class="rover-image-input" id="sol-id" name="sol-name" placeholder="Enter Sol..." required>
                <button type="submit" class="rover-image-button" id="rover-images-${roverData.photo_manifest.name}-btn">Show Images</button>
            </form>
        `)
    }
}

/**
* @description Configures the markup to show the requested rover images
* @param {Object} roverImages - object with array of photo information
* @returns {String} - html markup for image section of the app
*/
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
            `<h2>${roverImages.photos[0].rover} Images for Sol ${roverImages.photos[0].sol}</h2> 
            <div class="grid">`
        roverImages.photos.forEach(photo => {
            imageInfo += `<article>`
            imageInfo += `  <p>Camera: ${photo.camera}</p>`
            imageInfo += `  <img src="${photo.img_src}" alt="${photo.id}">`
            imageInfo += `</article>`
        })
        imageInfo += `</div>`
        return imageInfo
    }
}

/**
* @description Maps the raw rover image data down to an object with the data we want for the application
* @param {Object} rawImagePhotos - object with array of photo information
* @returns {Object} - object with array of photo information
*/
const mapImageData = (rawImagePhotos) => {
    const photos = rawImagePhotos.roverImages.photos.map(photosSol => 
        ({  id: photosSol.id,
            sol: photosSol.sol,
            camera: photosSol.camera.name,
            img_src: photosSol.img_src,
            earth_date: photosSol.earth_date,
            rover: photosSol.rover.name
        })
    )
    return {photos}
}

/**
* @description API call to retrieve data for a rover
*/
const getRoverData = (roverName) => {
    roverData = 'getRoverData'
    roverImages = ''
    updateStore(store, { roverData, roverImages })
    fetch(`http://localhost:3000/rover?name=${roverName}`)
        .then(res => res.json())
        .then(roverData => updateStore(store,  roverData ))
}


/**
* @description API call to retrieve images for a rover
*/
const getRoverImages = (roverName) => {
    roverImages = 'getRoverImages'
    const solImages = document.getElementById('sol-id').value
    updateStore(store, { roverImages })
    fetch(`http://localhost:3000/images?name=${roverName}&sol=${solImages}`)
        .then(res => res.json())
        .then(rawImageData => mapImageData(rawImageData))
        .then(roverImages => updateStore(store, { roverImages }))
}


require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')
// import immutablejs.js
const Immutable = require('immutable');

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

// example API call
app.get('/apod', async (req, res) => {
    try {
        let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ image })
    } catch (err) {
        console.log('error:', err);
    }
})

// API call for rover data - query string must be name of rover
app.get('/rover', async (req, res) => {
    try {
        const roverName = req.query.name;
        //let roverData = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
        let roverInfo = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${roverName}?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
            //.then(json => console.log(json))
        res.send( {roverInfo} )
    } catch (err) {
        console.log('error:', err);
    }
})

app.get('/images', async (req, res) => {
    try {
        const roverName = req.query.name;
        const sol = req.query.sol;
        let roverImages = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/photos?sol=${sol}&api_key=${process.env.API_KEY}`)
            .then(res => res.json())
            //.then(json => console.log(json))
        res.send({ roverImages })
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Mars Rover information app listening on port ${port}!`))
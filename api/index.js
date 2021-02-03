/* SERVER */
const express = require('express')            // express server
const bodyParser = require('body-parser')     // parser for the request body
const cors = require('cors')                  // middleware for cross issue

/* MJML */
const mjml2html = require('mjml')             // mjml render function

/* TWIG */
const Twig = require('twig')                  // twig module
Twig.cache(false)                             // disable twig cache, allow to edit twig file without restarting the api server

const app = express()
const port = 3000

const jsonParser = bodyParser.json()          // create application/json parser

app.use('/assets', express.static('assets'))  // middleware to serve assets
app.options('/renderTwig', cors())            // middleware for cors

app.post('/renderTwig', jsonParser, cors(), (req, res) => {

  const mainTwigFile = 'twig/index.twig'      // path of the main twig file
  let mailContext = req.body.mailContext      // get all variables in req.body.mailContext

  Twig.renderFile(mainTwigFile, {...mailContext}, (err, html) => {
    let resHtml = mjml2html(html)             // compile mjml to html
    res.send(resHtml)                         // Send the html back
  });
})

app.listen(port, () => {
  console.log(`API Server is Ready`, `http://localhost:${port}`)
})

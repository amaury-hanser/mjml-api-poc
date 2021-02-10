/* SERVER */
const express = require('express')            // express server
const bodyParser = require('body-parser')     // parser for the request body
const cors = require('cors')                  // middleware for cross issue

/* MAILER */
const nodemailer = require("nodemailer");

/* WATCH */
const chokidar = require('chokidar')

/* MJML */
const mjml2html = require('mjml')             // mjml render function

/* TWIG */
const Twig = require('twig')                  // twig module
Twig.cache(false)                             // disable twig cache, allow to edit twig file without restarting the api server

/* BASIC FUNCTIONS */
const fs = require('fs');
const path = require('path');



/**
 ** GET LIST OF FOLDERS
 *  Will be used for themes
 */
function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

const themes = getFolders('./assets/twig/themes');


/**
 ** SERVER CONFIG
 */
const app = express()
const port = 3000
const jsonParser = bodyParser.json()          // create application/json parser

app.use('/assets', express.static('assets'))  // middleware to serve assets
app.options('/renderTwig', cors())            // middleware for cors
app.options('/sendMail', cors())              // middleware for cors
app.options('/getForms', cors())              // middleware for cors
app.options('/watch', cors())                 // middleware for cors

let mailHTML = ''                             // create variable for later use

/**
 ** GET FORMS
 */

app.post('/getForms', jsonParser, cors(), (req, res) => {
  // const mailContext = req.body.mailContext      // get all variables in req.body.mailContext
  const mainTwigFile = `assets/twig/form/index.twig`  // path of the main twig file
  let themesConfigs = []

  themes.forEach((theme) => {
    let jsonData = JSON.parse(fs.readFileSync(`./assets/twig/themes/${theme}/config.json`, 'utf8'));

    // let jsonData = require(`./assets/twig/themes/${theme}/config.json`);
    if (jsonData) {
      themesConfigs.push(jsonData)
    }
  })

  Twig.renderFile(mainTwigFile, {...themesConfigs}, (err, html) => {
    res.send(JSON.stringify(html))                         // Send the html back
  });
})

/**
 ** RENDER TWIG AND MJML
 *  Get context from client
 *  Render TWIG with context
 *  Render MJML
 *  Send back compiled HTML
 */

app.post('/renderTwig', jsonParser, cors(), (req, res) => {
  const mailContext = req.body.mailContext      // get all variables in req.body.mailContext
  const mainTwigFile = `assets/twig/themes/${mailContext.theme}/index.twig`  // path of the main twig file

  Twig.renderFile(mainTwigFile, {...mailContext}, (err, html) => {
    let resHtml = mjml2html(html)             // Compile mjml to html
    res.send(resHtml)                         // Send the html back
    mailHTML = resHtml.html                   // Store result for email sending
  });
})


/**
 ** CLIENT SUBSCRIPTION
 *  Create a subscription between the client browser and the API
 *  Update client variable
 */

let client    // Create client variable for later use

app.get('/watch', jsonParser, cors(), (req, res) => {
  res.writeHead(200, {
    'Connection': 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache'
  });
  client = res;
});


/**
 ** WATCH
 *  Watch files in assets
 *  If there is a modification, send a message to the client,
 *  so the client can ask to re-render the mail
 */

let assetsWatcher = chokidar.watch('assets/**/*.*', {
  usePolling: true,
  awaitWriteFinish: {
      pollInterval: 100,
      stabilityThreshold: 250
  },
  ignoreInitial: true,
  persistent: true
})
.on('all', (event, path) => {
  // First we check if client exists
  if (client) {
    client.write('data: ' + JSON.stringify({ refresh : true }) + '\n\n');
  }
});

let configsWatcher = chokidar.watch(['assets/**/config.json', 'assets/twig/form/**/*.*'], {
  usePolling: true,
  awaitWriteFinish: {
      pollInterval: 100,
      stabilityThreshold: 250
  },
  ignoreInitial: true,
  persistent: true
})
.on('all', (event, path) => {
  // First we check if client exists
  if (client) {
    client.write('data: ' + JSON.stringify({ getNewForms : true }) + '\n\n');
  }
});

assetsWatcher
configsWatcher

/**
 ** SEND EMAIL
 *  Use nodemailer to send an email
 *  Actual config will use ethereal to have an online preview
 */
app.post('/sendMail', jsonParser, cors(), (req, res) => {
  // Replace placeholder text
  mailHTML = mailHTML.replace('{lastname}', 'Schmitt')
  mailHTML = mailHTML.replace('{firstname}', 'Nicolas')

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"POC - mjml / twig" <foo@example.com>',  // sender address
      to: "amaury.hanser@prestashop.com",             // list of receivers
      subject: "POC - mjml / twig",                   // subject line
      text: "Hello world?",                           // plain text body, didn't care about this one for now
      html: mailHTML,                                 // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    previewURL = nodemailer.getTestMessageUrl(info);

    res.send({url: previewURL})
  }
  main().catch(console.error)


  /**
   * TODO:  write an html file to use to send email
   */
})


app.listen(port, () => {
  console.log(`API Server is Ready`, `http://localhost:${port}`)
})

# Mjml-twig-poc

![Preview of Mjml twig poc](https://raw.githubusercontent.com/amaury-hanser/mjml-twig-poc/main/mjml-twig-poc_preview.png)

## Mjml-twig-poc, what's that?
**Mjml-twig-poc** was created as an exemple to show how one can work with *mjml*, *twig* to configure and edit an email in his browser.  
This is a proof of concept and is by no mean a project ready for production.

## What's the magic behind it?
Every time you change the value of an input, a request is sent to a server with every inputs values, the server will compile the twig and the mjml using your values.

When it's done, it sends the html result back and the preview is updated.

## What features ca I expect?
- Auto-generation of the form for each theme depending on their config file
- Live compilation of Twig and Mjml
- Live preview of the email in the browser
- Watch twig to update the live preview in the browser
- Watch config files to update the form in the browser
- Mail sender to check what is sent

## I'm hyped! How do I install it?
Clone the repository, then run docker-compose up.  
The command will install all the required packages and run two servers:
- one server for the api
- one server for the client

When both servers are ready, *api* and *client* side, simply open [http://localhost:8080](http://localhost:8080).

## What do the files do?
```
├── api
│   ├── assets
│   │   ├── img
│   │   │   └── ...
│   │   └── twig
│   │       ├── form
│   │       │   ├── _partials
│   │       │   │   └── ...
│   │       │   └── index.twig      // Template to render the forms
│   │       └── themes
│   │           ├── boxy
│   │           │   ├── _layouts
│   │           │   │   └── ...
│   │           │   ├── _partials
│   │           │   │   └── ...
│   │           │   ├── config.json // Contains all the necessary form inputs 
│   │           │   └── index.twig  // Mail template
│   │           └── sendy
│   │               ├── _layouts
│   │               │   └── ...
│   │               ├── _partials
│   │               │   └── ...
│   │               ├── config.json // Contains all the necessary form inputs 
│   │               └── index.twig  // Mail template
│   ├── index.js                    // API: Server, Twig/Mjml rendering, MailSender
├── docker-compose.yml
├── mjml-twig-poc_preview.png
├── README.md
└── server
    ├── favicon.ico
    └── index.html                  // Webpage, live edit mail and preview
````
## What's next ?
- [x] Add a script for watching twig files during development phase.
- [x] Add a mail sender to the api.
- [x] Check how to render a twig/mjml partial (e.g. cart)
- [x] Render the form on the fly with a config file
- [ ] Adapt the api for a php server
  
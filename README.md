# Mjml-twig-poc

## Mjml-twig-poc, what's that?
**Mjml-twig-poc** was created as an exemple to show how one can work with *mjml*, *twig* to configure and edit an email in his browser.  
This is a proof of concept and is by no mean a project ready for production.

## What's the magic behind it?
Every time you change the value of an input, a request is sent to a server with every inputs values, the server will compile the twig and the mjml using your values.

When it's done, it sends the html result back and the preview is updated.

## I'm hyped! How do I install it?
Clone the repository, then run docker-compose up.  
The command will install all the required packages and run two servers:
- one server for the api
- one server for the client

When both servers are ready, *api* and *client* side, simply open [http://localhost:8080](http://localhost:8080).

## What do the files do?
```
├── .gitignore
├── api
│   ├── assets
│   │   └── img
│   ├── index.js              // API Script: Server, twig and mjml rendering functions
│   ├── package-lock.json
│   ├── package.json
│   └── twig
│       ├── _layouts
│       │   └── default.twig  // Base layout with default variables value
│       ├── index.twig        // Mail template
│       └── partials
│           ├── header.twig   // Partial used by index.twig
│           └── socials.twig  // Partial used by index.twig
├── docker-compose.yml
├── README.md
└── server
    ├── index.html            // Web page with a form and a live preview
    ├── package-lock.json
    └── package.json
````
## What's next ?
- [ ] Add a script for watching twig files during development phase.
- [ ] Adapt the api for a php server
- [ ] Adapt a button to save the mail as an html file

# Mjml-twig-poc

![Preview of Mjml twig poc](https://raw.githubusercontent.com/amaury-hanser/mjml-twig-poc/main/mjml-twig-poc_preview.png)

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

You can now edit your email in the web browser, you'll see the changes reflected on the preview, if you click on send email, you'll get a link to preview the sent email.  
You'll see that variables `{firstname}` and `{lastname}` are parsed when the mail is sent.  

By the way, if you make any change to your twig files, your browser will render the preview and keep the edit you had made with the form.

## What do the files do?
```
├── .gitignore
├── api
│   ├── assets
│   │   ├── img
│   │   │   └── ...
│   │   └── twig
│   │       ├── boxy
│   │       │   ├── _layouts
│   │       │   │   └── ...
│   │       │   ├── _partials
│   │       │   │   └── ...
│   │       │   └── index.twig  // Mail template
│   │       └── sendy
│   │           ├── _layouts
│   │           │   └── ...
│   │           ├── _partials
│   │           │   └── ...
│   │           └── index.twig  // Mail template
│   ├── index.js                // API: Server, Twig/Mjml rendering, MailSender
│   ├── package-lock.json
│   └── package.json
├── docker-compose.yml
├── README.md
└── server
    ├── favicon.ico
    ├── index.html              // Webpage, live edit mail and preview
    ├── package-lock.json
    └── package.json
````
## What's next ?
- [x] Add a script for watching twig files during development phase.
- [x] Add a mail sender to the api.
- [ ] Adapt the api for a php server
- [ ] Check how to render a twig/mjml partial (e.g. cart) 

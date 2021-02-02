# mjml-api-poc

## What is the purpose of this repository
**mjml-api-poc** was created as an exemple to show how one can work with *mjml*, *twig* to configure and edit an email in his browser.  
This is a proof of concept and is by no mean a project ready for production.

## How it works
You get a form in your browser with different fields you can change.  
On the side, the preview of the email.

Every time you change the value of an input, a request is sent to a server with every inputs values, the server will compile the twig and the mjml using your values.  
When it's done, it sends the html result back and the preview is updated.

## How to install?
Clone the repository, then run docker-compose up.  
The command will install all the required packages.  
When both servers are ready, *api* and *client* side, simply open [http://localhost:8080](http://localhost:8080).

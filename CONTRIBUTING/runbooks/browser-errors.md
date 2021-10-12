
## Failed to load resource: the server responded with a status of 403 () /.netlify/functions/whoami:1
-> look for another error in the console

## Uncaught (in promise) Error: Error: OA∙API…ensure_user_through_netlify: self signed certificate
Issue with db, most likely the chain postgres / heroku / postgres driver "pg" / knex
Check the latest doc:
- https://devcenter.heroku.com/articles/heroku-postgresql#connecting-in-node-js
- https://devcenter.heroku.com/articles/connecting-to-relational-databases-on-heroku-with-java#using-ssl-with-postgresql

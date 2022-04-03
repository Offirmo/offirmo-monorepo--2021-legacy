

## dev

* Insomnia
* pg with proper version
* pgAdmin
* `yarn dev` + `yarn start`

export UDA_OVERRIDE__LOGGER_OA∙API_LOGLEVEL=\"silly\" \


## Notes
official AWS lambda limits: https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html
* 50Mo zipped, 250Mo unzipped


## Tosort
doc:
* packaging
  * [netlify-lambda](https://github.com/netlify/netlify-lambda)
* https://www.netlify.com/docs/functions/
  * Selecting the JS runtime: https://www.netlify.com/docs/functions/#javascript-runtime-settings
    * mirroring AWS lambda runtimes https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html
    * see the root netlify.toml (no netlify.toml on online-adventur.es)
    * see Netlify UI build variables
    * Adjust it into [.babelrc](update marker)
    * Adjust it into [.nvmrc](update marker)
  * Versions seen (real-time from /echo) [](update marker)
    * 2021/10/12 seen 14.17.4 (14x required)
    * 2021/10/12 seen 12.22.4 (12.x manually required due to pg issue)
    * 2020/11/2 seen 12.18.4 (12.x manually required due to pg issue)
    * 2020/09/22 seen 12.18.3
    * 2020/08 seen 12.18.2
    * 2020/06 seen 12.16.3
    * 2019/12 seen 10.17
* https://serverless.com/blog/common-node8-mistakes-in-lambda/
* status codes https://www.codetinkerer.com/2015/12/04/choosing-an-http-status-code.html

`yarn start`

Tools
* https://insomnia.rest/
* https://offirmo-monorepo.netlify.app/ test app:
```
query('.netlify/functions/key-value/foo', 'GET', body = undefined)
query('.netlify/functions/key-value/foo', 'PATCH', body = { foo: 42 })
query('.netlify/functions/key-value/foo', 'PATCH', body = { schema_version: 1, revision: 1, foo: 42 })
```


## ...
TODO https://hackernoon.com/package-lambda-functions-the-easy-way-with-npm-e38fc14613ba
TODO https://httptoolkit.tech/blog/netlify-function-error-reporting-with-sentry/

https://medium.com/braintree-product-technology/braintree-functions-18a5ceb27af4

https://aws.amazon.com/blogs/compute/announcing-websocket-apis-in-amazon-api-gateway/


https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html#nodejs-prog-model-handler-callback

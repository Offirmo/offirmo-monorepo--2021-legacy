"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const http_1 = require("http");
const express_1 = tslib_1.__importDefault(require("express"));
const build_1 = require("./build");
console.log('Hello world from Typescript express server!');
const PORT = process.env.PORT || 5000;
const app = express_1.default();
// https://expressjs.com/en/4x/api.html#app.settings.table
app.enable('trust proxy');
app.disable('x-powered-by');
// respond with "hello world" when a GET request is made to this path
app.get('/', function (req, res) {
    res.send(`
This is not what you’re looking for.<br />
node: v${process.versions.node}<br />
build: ${build_1.BUILD_DATE}<br />
now: ${+(new Date())}
`);
});
const server = http_1.createServer(app);
server.on('error', (err) => {
    console.error('server encountered an error', err);
});
server.listen(PORT, () => {
    console.info(`server is listening on ${PORT}`);
});

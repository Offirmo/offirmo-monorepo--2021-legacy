"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const http_1 = require("http");
const express_1 = tslib_1.__importDefault(require("express"));
const build_1 = require("./build");
console.log('Hello world from Typescript express server!');
////////////////////////////////////
const app = (0, express_1.default)();
// https://expressjs.com/en/4x/api.html#app.settings.table
app.enable('trust proxy');
app.disable('x-powered-by');
// respond with "hello world" when a GET request is made to this path
app.get('/', function (req, res) {
    res.send(`
This is not what you’re looking for.<br />
<hr>
node: v${process.versions.node}<br />
code: v${build_1.VERSION}<br />
build: ${build_1.BUILD_DATE}<br />
now: ${+(new Date())}
`);
});
// monitoring badges https://shields.io/endpoint
const BADGE_BODY = {
    "schemaVersion": 1,
    "label": "TODO label",
    "message": "TODO message",
    //"color": "orange",
    "isError": false,
    //"namedLogo": "foo",
};
app.get('/badges/time', function (req, res) {
    res.send({
        ...BADGE_BODY,
        label: 'build date',
        message: build_1.BUILD_DATE,
    });
});
app.get('/badges/version', function (req, res) {
    res.send({
        ...BADGE_BODY,
        label: 'version',
        message: build_1.VERSION,
    });
});
////////////////////////////////////
const server = (0, http_1.createServer)(app);
server.on('error', (err) => {
    console.error('server encountered an error', err);
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.info(`server is listening on ${PORT}`);
});

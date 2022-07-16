const express = require('express');
const app = express();
const fs = require('fs')
const path = require('path')

app.use(async (req, res) => {
    const url = req.url.replace(/\?.+$/, '').replace(/^\//, '').replace(/\/+/g, '.');
    const jsonfile = path.resolve(__dirname, './mock', url + '.json');
    const jsFile = path.resolve(__dirname, './mock', url + '.js');
    if (fs.existsSync(jsFile)) {
        for (let i in require.cache) {
            delete require.cache[i]
        }
        console.info(req.method, req.url, jsFile);
        const handle = require(jsFile);
        const params = req.method.toLocaleUpperCase == 'GET' ? req.query : req.body;
        res.send(await handle(params, req))
    } else {
        console.info(req.method, req.url, jsonfile);
        res.sendFile(jsonfile);
    }
});


// Serve the files on port 8989.
app.listen(8989, function () { });
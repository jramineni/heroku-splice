const express = require("express");
const bodyParser = require("body-parser");
const chalk = require("chalk");
const util = require('util');

const DEFAULT_PORT = 3333;
const app = express();
const jsonParser = bodyParser.json();

app.set("port", process.env.PORT || DEFAULT_PORT);
app.set("json spaces", 2);
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const server = app.listen(app.get("port"), () => {
    console.log("Server Started", `http://localhost:${DEFAULT_PORT}`);
    server.keepAliveTimeout = 0;
});

/**
 * Subrouter StackOverflow
 * https://stackoverflow.com/questions/25260818/rest-with-express-js-nested-router
 */

const router = express.Router();
const apiRouter = express.Router({mergeParams: true});
router.use("/api/v1", jsonParser, apiRouter);

apiRouter.route("/").post((req, res, next) => {
    console.log(chalk.green("Got a request at"), chalk.yellow(`${req.originalUrl}`));

    printObject(req.body);
    console.log(chalk.white(`Stringified for copying:`));
    console.log(chalk.white(`${JSON.stringify(req.body)}`));

    res.send({});
    next();
});

app.use('/', router);

function printObject(obj, depth) {
    if (!depth) {
        depth = 0;
    }

    let indentation = "";
    for(let i=0; i < depth; i++){
        indentation += "  ";
    }

    console.log(chalk.blue(`${indentation}{`));

    for (let key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
            console.log(`${indentation}  ${chalk.blue(key)} : `);
            printObject(obj[key], depth + 1);
        } else {
            console.log(`${indentation}  ${chalk.blue(key)} : ${chalk.red(obj[key])}`);
        }
    }

    console.log(chalk.blue(`${indentation}}`));
}

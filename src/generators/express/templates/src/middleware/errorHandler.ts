import chalk from "chalk";
import { ErrorRequestHandler } from "express";
import Fault from "../errors/Fault";

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof Fault) {
        return res.status(err.httpCode).send({
            code: err.httpCode,
            message: err.message,
        });
    }

    console.error(chalk.red(err.message));
    console.error(chalk.red(err.stack));

    return res.status(500).send({
        code: 500,
        message: "Internal server error",
    });
};

export default errorHandler;

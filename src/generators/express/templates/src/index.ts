import express from "express";
import chalk from "chalk";
import "./config/config";
import logRequest from "./middleware/logRequest";
import ConfigService from "./services/ConfigService/ConfigService";
import errorHandler from "./middleware/errorHandler";
import Service from "./services/Service/Service";
import ServiceLoadingFault from "./errors/ServiceLoadingFault";

const app = express();
const config = ConfigService.getConfig();

app.use(logRequest);

app.get("/", (_req, res) => {
    return res.sendStatus(200);
});

app.use(errorHandler);

Service.onReady((serviceId) => {
    console.info(chalk.green(`✅ ${serviceId} ready.`));
})
    .onAllReady(() => {
        console.info(chalk.green("✅ All services ready!"));

        app.listen(config.port, () => {
            Object.entries(config).forEach(([key, value]) => {
                const paddedKey = key.padEnd(25, " ");
                console.info(
                    chalk.keyword("orange")(`🔧 ${paddedKey}: ${value}`)
                );
            });
            console.info();
        });
    })
    .onError((serviceId, error) => {
        if (error instanceof ServiceLoadingFault) {
            console.error(chalk.keyword("red")(`🔥 ${serviceId}`));
            console.error(chalk.keyword("red")(error.message));
            console.error(chalk.keyword("red")(error.stack));
            console.error();
            process.exit(1);
        }
    });

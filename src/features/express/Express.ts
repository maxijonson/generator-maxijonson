import Generator from "yeoman-generator";
import bind from "../../decorators/bind";
import Feature, { GetFeature } from "../../services/FeatureService/Feature";
import copyTpl from "../../utils/copyTpl";
import Env from "../Env";
import PM2 from "./PM2";

export default class Express extends Feature {
    constructor(enabled = false, available = true) {
        super("express", "Express", enabled, available);
    }

    @bind
    public async apply(
        generator: Generator,
        getFeature: GetFeature
    ): Promise<void> {
        const dotenv = getFeature(Env);
        const pm2 = getFeature(PM2);

        [
            "src/config/constants.ts",
            "src/errors/Fault.ts",
            "src/errors/ServiceLoadingFault.ts",
            "src/middleware/errorHandler.ts",
            "src/middleware/logRequest.ts",
            "src/services/ConfigService/ConfigService.ts",
            "src/services/Service/Service.ts",
        ].forEach((file) => {
            copyTpl(
                generator,
                generator.templatePath(file),
                generator.destinationPath(file)
            );
        });

        copyTpl(
            generator,
            generator.templatePath("src/config/config.ts"),
            generator.destinationPath("src/config/config.ts"),
            {
                dotenv: dotenv?.isEnabled(),
            }
        );

        await generator.addDependencies({
            chalk: "4.1.2",
            express: "5.0.0-beta.1",
        });
        await generator.addDevDependencies(["@types/express"]);

        const scripts = {
            start: "node dist/esm/index.js",
            dev: "ts-node -P tsconfig.esm.json src/index.ts",
            prod: "npm run build && npm run start",
            build: "npm-run-all clean build:esm",
        };

        if (pm2?.isEnabled()) {
            scripts.start = "pm2-runtime start pm2.config.cjs --env production";
        }

        generator.packageJson.merge({
            scripts,
            type: "module",
            main: "dist/esm/index.js",
        });
        const filteredScripts = generator.packageJson.get("scripts");

        delete filteredScripts["build:cjs"];
        delete filteredScripts["build:types"];

        generator.packageJson.setPath("scripts", filteredScripts);
    }
}

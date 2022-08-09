import Generator from "yeoman-generator";
import bind from "../../decorators/bind";
import Feature, { GetFeature } from "../../services/FeatureService/Feature";
import copyTpl from "../../utils/copyTpl";
import Env from "../Env";

export default class PM2 extends Feature {
    constructor(enabled = false, available = true) {
        super("pm2", "PM2", enabled, available);
    }

    @bind
    public async apply(
        generator: Generator,
        getFeature: GetFeature
    ): Promise<void> {
        const dotenv = getFeature(Env);

        copyTpl(
            generator,
            generator.templatePath("pm2.config.cjs"),
            generator.destinationPath("pm2.config.cjs"),
            {
                dotenv: dotenv?.isEnabled(),
                appname: generator.appname,
            }
        );

        await generator.addDependencies(["pm2"]);
    }
}

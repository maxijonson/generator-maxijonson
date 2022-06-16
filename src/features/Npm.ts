import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature, { GetFeature } from "../services/FeatureService/Feature";
import copyTpl from "../utils/copyTpl";
import Tests from "./Tests";

export default class Npm extends Feature {
    constructor(enabled = false, available = true) {
        super("npm", "NPM Publishing", enabled, available);
    }

    @bind
    public async apply(
        generator: Generator,
        getFeature: GetFeature
    ): Promise<void> {
        const tests = getFeature(Tests);

        copyTpl(
            generator,
            generator.templatePath(".np-config.json"),
            generator.destinationPath(".np-config.json"),
            { tests: tests?.isEnabled() }
        );

        await generator.addDevDependencies(["np"]);
    }
}

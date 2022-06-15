import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature, { GetFeature } from "../services/FeatureService/Feature";
import copyTpl from "../utils/copyTpl";
import Tests from "./Tests";

export default class TSConfig extends Feature {
    constructor(enabled = false, available = true) {
        super("tsconfig", "TSConfigs", enabled, available);
    }

    @bind
    public apply(generator: Generator, getFeature: GetFeature): void {
        const tests = getFeature(Tests);

        [
            "tsconfig.base.json",
            "tsconfig.json",
            "tsconfig.cjs.json",
            "tsconfig.esm.json",
            "tsconfig.prod.json",
        ].forEach((file) =>
            copyTpl(
                generator,
                generator.templatePath(file),
                generator.destinationPath(file),
                {
                    react: generator.options.react,
                    tests: tests?.isEnabled() ?? false,
                }
            )
        );

        copyTpl(
            generator,
            generator.templatePath(".build"),
            generator.destinationPath(".build")
        );
    }
}

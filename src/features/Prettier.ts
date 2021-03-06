import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature, { GetFeature } from "../services/FeatureService/Feature";
import copyTpl from "../utils/copyTpl";
import Tests from "./Tests";

export default class Prettier extends Feature {
    constructor(enabled = false, available = true) {
        super("prettier", "Prettier", enabled, available);
    }

    @bind
    public async apply(
        generator: Generator,
        getFeature: GetFeature
    ): Promise<void> {
        const tests = getFeature(Tests);

        copyTpl(
            generator,
            generator.templatePath(".prettierrc"),
            generator.destinationPath(".prettierrc")
        );

        copyTpl(
            generator,
            generator.templatePath(".prettierignore"),
            generator.destinationPath(".prettierignore"),
            { tests: tests?.isEnabled() }
        );

        await generator.addDevDependencies(["prettier"]);
    }
}

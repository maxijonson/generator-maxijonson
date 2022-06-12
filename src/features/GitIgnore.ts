import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature, { GetFeature } from "../services/FeatureService/Feature";
import copyTpl from "../utils/copyTpl";
import Tests from "./Tests";
import VSCodeLaunch from "./VSCodeLaunch";
import VSCodeSettings from "./VSCodeSettings";

export default class GitIgnore extends Feature {
    constructor(enabled = true, available = true, hidden = true) {
        super("gitignore", ".gitignore", enabled, available, hidden);
    }

    @bind
    public apply(generator: Generator, getFeature: GetFeature): void {
        const settings = getFeature(VSCodeSettings);
        const launch = getFeature(VSCodeLaunch);
        const tests = getFeature(Tests);

        copyTpl(
            generator,
            generator.templatePath("gitignore"),
            generator.destinationPath(".gitignore"),
            {
                settings: settings?.isEnabled() ?? false,
                launch: launch?.isEnabled() ?? false,
                tests: tests?.isEnabled() ?? false,
            }
        );
    }
}

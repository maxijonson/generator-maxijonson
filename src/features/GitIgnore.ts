import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature, { GetFeature } from "../services/FeatureService/Feature";
import copyTpl from "../utils/copyTpl";
import Env from "./Env";
import Express from "./express/Express";
import Tests from "./Tests";
import VSCodeLaunch from "./VSCodeLaunch";
import VSCodeSettings from "./VSCodeSettings";

export default class GitIgnore extends Feature {
    constructor(enabled = false, available = true) {
        super("gitignore", ".gitignore", enabled, available);
    }

    @bind
    public apply(generator: Generator, getFeature: GetFeature): void {
        const settings = getFeature(VSCodeSettings);
        const launch = getFeature(VSCodeLaunch);
        const tests = getFeature(Tests);
        const dotenv = getFeature(Env);
        const express = getFeature(Express);

        copyTpl(
            generator,
            generator.templatePath("gitignore"),
            generator.destinationPath(".gitignore"),
            {
                settings: settings?.isEnabled(),
                launch: launch?.isEnabled(),
                tests: tests?.isEnabled(),
                dotenv: dotenv?.isEnabled(),
                express: express?.isEnabled(),
            }
        );
    }
}

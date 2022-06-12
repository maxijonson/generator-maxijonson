import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature, { GetFeature } from "../services/FeatureService/Feature";
import copyTpl from "../utils/copyTpl";
import Inquirer from "./Inquirer";
import Yargs from "./Yargs";

export default class TSIndex extends Feature {
    constructor(enabled = true, available = true, hidden = true) {
        super("tsindex", "index.ts", enabled, available, hidden);
    }

    @bind
    public apply(generator: Generator, getFeature: GetFeature): void {
        const yargs = getFeature(Yargs);
        const inquirer = getFeature(Inquirer);

        copyTpl(
            generator,
            generator.templatePath("src/index.ts"),
            generator.destinationPath("src/index.ts"),
            {
                yargs: yargs?.isEnabled() ?? false,
                inquirer: inquirer?.isEnabled() ?? false,
            }
        );
    }
}

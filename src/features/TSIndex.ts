import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature, { GetFeature } from "../services/FeatureService/Feature";
import copyTpl from "../utils/copyTpl";
import Inquirer from "./Inquirer";
import Yargs from "./Yargs";

export default class TSIndex extends Feature {
    constructor(enabled = false, available = true) {
        super("tsindex", "index.ts", enabled, available);
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
                yargs: yargs?.isEnabled(),
                inquirer: inquirer?.isEnabled(),
            }
        );
    }
}

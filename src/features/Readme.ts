import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature from "../services/FeatureService/Feature";
import copyTpl from "../utils/copyTpl";

export default class Readme extends Feature {
    constructor(enabled = false, available = true) {
        super("readme", "README.md", enabled, available);
    }

    @bind
    public apply(generator: Generator): void {
        copyTpl(
            generator,
            generator.templatePath("README.md"),
            generator.destinationPath("README.md"),
            { appname: generator.appname }
        );
    }
}

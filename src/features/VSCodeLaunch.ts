import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature from "../services/FeatureService/Feature";
import copyTpl from "../utils/copyTpl";

export default class VSCodeLaunch extends Feature {
    constructor(enabled = false, available = true) {
        super("vscode-launch", "VSCode Launch Settings", enabled, available);
    }

    @bind
    public apply(generator: Generator): void {
        copyTpl(
            generator,
            generator.templatePath(".vscode/launch.json"),
            generator.destinationPath(".vscode/launch.json")
        );
    }
}

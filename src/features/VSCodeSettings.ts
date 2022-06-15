import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature from "../services/FeatureService/Feature";
import copyTpl from "../utils/copyTpl";

export default class VSCodeSettings extends Feature {
    constructor(enabled = false, available = true) {
        super("vscode-settings", "VSCode Project Settings", enabled, available);
    }

    @bind
    public apply(generator: Generator): void {
        copyTpl(
            generator,
            generator.templatePath(".vscode/settings.json"),
            generator.destinationPath(".vscode/settings.json")
        );
    }
}

import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature from "../services/FeatureService/Feature";
import copyTpl from "../utils/copyTpl";

export default class DevContainer extends Feature {
    constructor(enabled = false, available = true) {
        super("devcontainer", "Dev Container", enabled, available);
    }

    @bind
    public apply(generator: Generator): void {
        copyTpl(
            generator,
            generator.templatePath(".devcontainer"),
            generator.destinationPath(".devcontainer"),
            { appname: generator.appname }
        );
    }
}

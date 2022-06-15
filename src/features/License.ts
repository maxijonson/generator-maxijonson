import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature from "../services/FeatureService/Feature";
import copyTpl from "../utils/copyTpl";

export default class License extends Feature {
    constructor(enabled = false, available = true) {
        super("license", "License", enabled, available);
    }

    @bind
    public apply(generator: Generator): void {
        copyTpl(
            generator,
            generator.templatePath("LICENSE"),
            generator.destinationPath("LICENSE"),
            { year: new Date().getFullYear() }
        );
    }
}

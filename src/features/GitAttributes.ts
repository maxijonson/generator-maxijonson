import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature from "../services/FeatureService/Feature";
import copyTpl from "../utils/copyTpl";

export default class GitAttributes extends Feature {
    constructor(enabled = false, available = true) {
        super("gitattributes", ".gitattributes", enabled, available);
    }

    @bind
    public apply(generator: Generator): void {
        copyTpl(
            generator,
            generator.templatePath("gitattributes"),
            generator.destinationPath(".gitattributes")
        );
    }
}

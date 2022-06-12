import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature from "../services/FeatureService/Feature";
import copyTpl from "../utils/copyTpl";

export default class GitAttributes extends Feature {
    constructor(enabled = true, available = true, hidden = true) {
        super("gitattributes", ".gitattributes", enabled, available, hidden);
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

import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature from "../services/FeatureService/Feature";
import copyTpl from "../utils/copyTpl";

export default class GlobalDTs extends Feature {
    constructor(enabled = false, available = true, hidden = false) {
        super("globaldts", "global.d.ts", enabled, available, hidden);
    }

    @bind
    public async apply(generator: Generator): Promise<void> {
        copyTpl(
            generator,
            generator.templatePath("src/global.d.ts"),
            generator.destinationPath("src/global.d.ts")
        );
    }
}

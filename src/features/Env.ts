import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature from "../services/FeatureService/Feature";
import copyTpl from "../utils/copyTpl";

export default class Env extends Feature {
    constructor(enabled = false, available = true, hidden = false) {
        super("env", ".env", enabled, available, hidden);
    }

    @bind
    public async apply(generator: Generator): Promise<void> {
        copyTpl(
            generator,
            generator.templatePath(".env"),
            generator.destinationPath(".env")
        );

        await generator.addDependencies(["dotenv"]);
    }
}

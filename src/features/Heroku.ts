import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature from "../services/FeatureService/Feature";
import copyTpl from "../utils/copyTpl";

export default class Heroku extends Feature {
    constructor(enabled = false, available = true) {
        super("heroku", "Heroku", enabled, available);
    }

    @bind
    public async apply(generator: Generator): Promise<void> {
        // https://vitejs.dev/guide/static-deploy.html#heroku
        copyTpl(
            generator,
            generator.templatePath("static.json"),
            generator.destinationPath("static.json")
        );
    }
}

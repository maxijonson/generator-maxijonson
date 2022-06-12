import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature from "../services/FeatureService/Feature";

export default class Yargs extends Feature {
    constructor(enabled = false, available = true, hidden = false) {
        super("yargs", "Yargs", enabled, available, hidden);
    }

    @bind
    public async apply(generator: Generator): Promise<void> {
        await generator.addDependencies(["yargs"]);
        await generator.addDevDependencies(["@types/yargs"]);
    }
}

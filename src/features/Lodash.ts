import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature from "../services/FeatureService/Feature";

export default class Lodash extends Feature {
    constructor(enabled = false, available = true) {
        super("lodash", "Lodash", enabled, available);
    }

    @bind
    public async apply(generator: Generator): Promise<void> {
        await generator.addDependencies(["lodash"]);
        await generator.addDevDependencies(["@types/lodash"]);
    }
}

import Generator from "yeoman-generator";
import bind from "../../decorators/bind";
import Feature from "../../services/FeatureService/Feature";

export default class Inquirer extends Feature {
    constructor(enabled = false, available = true) {
        super("inquirer", "Inquirer", enabled, available);
    }

    @bind
    public async apply(generator: Generator): Promise<void> {
        await generator.addDependencies(["inquirer"]);
        await generator.addDevDependencies(["@types/inquirer"]);
    }
}

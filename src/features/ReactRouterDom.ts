import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature from "../services/FeatureService/Feature";

export default class ReactRouterDom extends Feature {
    constructor(enabled = true, available = true, hidden = false) {
        super("reactrouterdom", "React Router DOM", enabled, available, hidden);
    }

    @bind
    public async apply(generator: Generator): Promise<void> {
        await generator.addDependencies(["react-router-dom"]);
    }
}

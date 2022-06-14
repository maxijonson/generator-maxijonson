import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature from "../services/FeatureService/Feature";

export default class React extends Feature {
    constructor(enabled = true, available = true, hidden = true) {
        super("react", "React", enabled, available, hidden);
    }

    @bind
    public async apply(generator: Generator): Promise<void> {
        await generator.addDependencies(["react", "react-dom"]);
        await generator.addDevDependencies([
            "@types/react",
            "@types/react-dom",
        ]);
    }
}

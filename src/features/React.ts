import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature from "../services/FeatureService/Feature";

export default class React extends Feature {
    constructor(enabled = false, available = true) {
        super("react", "React", enabled, available);
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

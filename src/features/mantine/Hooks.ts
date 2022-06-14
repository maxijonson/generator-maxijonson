import Generator from "yeoman-generator";
import bind from "../../decorators/bind";
import Feature from "../../services/FeatureService/Feature";

export default class MantineHooks extends Feature {
    constructor() {
        super("mantine-hooks", "Hooks", true);
    }

    @bind
    public apply(generator: Generator): void {
        generator.addDependencies(["@mantine/hooks"]);
    }
}

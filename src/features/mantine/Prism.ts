import Generator from "yeoman-generator";
import bind from "../../decorators/bind";
import Feature from "../../services/FeatureService/Feature";

export default class MantinePrism extends Feature {
    constructor(enabled = false, available = true) {
        super("mantine-prism", "Prism", enabled, available);
    }

    @bind
    public apply(generator: Generator): void {
        generator.addDependencies(["@mantine/prism"]);
    }
}

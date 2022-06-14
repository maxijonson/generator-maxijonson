import Generator from "yeoman-generator";
import bind from "../../decorators/bind";
import Feature from "../../services/FeatureService/Feature";

export default class MantinePrism extends Feature {
    constructor() {
        super("mantine-prism", "Prism");
    }

    @bind
    public apply(generator: Generator): void {
        generator.addDependencies(["@mantine/prism"]);
    }
}

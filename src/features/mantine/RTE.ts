import Generator from "yeoman-generator";
import bind from "../../decorators/bind";
import Feature from "../../services/FeatureService/Feature";

export default class MantineRTE extends Feature {
    constructor() {
        super("mantine-rte", "RTE");
    }

    @bind
    public apply(generator: Generator): void {
        generator.addDependencies(["@mantine/rte"]);
    }
}

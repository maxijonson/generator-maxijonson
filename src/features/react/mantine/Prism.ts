import Generator from "yeoman-generator";
import bind from "../../../decorators/bind";
import Feature from "../../../services/FeatureService/Feature";

export default class MantinePrism extends Feature {
    constructor(enabled = false, available = true) {
        super("mantine-prism", "Prism", enabled, available);
    }

    @bind
    public async apply(generator: Generator): Promise<void> {
        await generator.addDependencies(["@mantine/prism"]);
    }
}

import Generator from "yeoman-generator";
import bind from "../../../decorators/bind";
import Feature from "../../../services/FeatureService/Feature";

export default class MantineRTE extends Feature {
    constructor(enabled = false, available = true) {
        super("mantine-rte", "RTE", enabled, available);
    }

    @bind
    public async apply(generator: Generator): Promise<void> {
        await generator.addDependencies(["@mantine/rte"]);
    }
}

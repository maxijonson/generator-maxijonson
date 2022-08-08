import Generator from "yeoman-generator";
import bind from "../../../decorators/bind";
import Feature from "../../../services/FeatureService/Feature";

export default class MantineModals extends Feature {
    constructor(enabled = false, available = true) {
        super("mantine-modals", "Modals", enabled, available);
    }

    @bind
    public async apply(generator: Generator): Promise<void> {
        await generator.addDependencies(["@mantine/modals"]);
    }
}

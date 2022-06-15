import Generator from "yeoman-generator";
import bind from "../../decorators/bind";
import Feature from "../../services/FeatureService/Feature";

export default class MantineModals extends Feature {
    constructor(enabled = false, available = true) {
        super("mantine-modals", "Modals", enabled, available);
    }

    @bind
    public apply(generator: Generator): void {
        generator.addDependencies(["@mantine/modals"]);
    }
}

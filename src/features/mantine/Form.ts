import Generator from "yeoman-generator";
import bind from "../../decorators/bind";
import Feature from "../../services/FeatureService/Feature";

export default class MantineForm extends Feature {
    constructor(enabled = false, available = true) {
        super("mantine-form", "Form", enabled, available);
    }

    @bind
    public apply(generator: Generator): void {
        generator.addDependencies(["@mantine/form"]);
    }
}

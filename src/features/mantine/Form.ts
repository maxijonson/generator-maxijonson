import Generator from "yeoman-generator";
import bind from "../../decorators/bind";
import Feature from "../../services/FeatureService/Feature";

export default class MantineForm extends Feature {
    constructor() {
        super("mantine-form", "Form");
    }

    @bind
    public apply(generator: Generator): void {
        generator.addDependencies(["@mantine/form"]);
    }
}

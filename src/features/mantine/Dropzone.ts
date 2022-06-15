import Generator from "yeoman-generator";
import bind from "../../decorators/bind";
import Feature from "../../services/FeatureService/Feature";

export default class MantineDropzone extends Feature {
    constructor(enabled = false, available = true) {
        super("mantine-dropzone", "Dropzone", enabled, available);
    }

    @bind
    public apply(generator: Generator): void {
        generator.addDependencies(["@mantine/dropzone"]);
    }
}

import Generator from "yeoman-generator";
import bind from "../../decorators/bind";
import Feature from "../../services/FeatureService/Feature";

export default class MantineDropzone extends Feature {
    constructor() {
        super("mantine-dropzone", "Dropzone");
    }

    @bind
    public apply(generator: Generator): void {
        generator.addDependencies(["@mantine/dropzone"]);
    }
}

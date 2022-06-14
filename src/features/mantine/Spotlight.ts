import Generator from "yeoman-generator";
import bind from "../../decorators/bind";
import Feature from "../../services/FeatureService/Feature";

export default class MantineSpotlight extends Feature {
    constructor() {
        super("mantine-spotlight", "Spotlight");
    }

    @bind
    public apply(generator: Generator): void {
        generator.addDependencies(["@mantine/spotlight"]);
    }
}

import Generator from "yeoman-generator";
import bind from "../../decorators/bind";
import Feature from "../../services/FeatureService/Feature";

export default class MantineDates extends Feature {
    constructor() {
        super("mantine-dates", "Dates");
    }

    @bind
    public apply(generator: Generator): void {
        generator.addDependencies(["@mantine/dates", "dayjs"]);
    }
}

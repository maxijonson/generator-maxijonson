import Generator from "yeoman-generator";
import bind from "../../decorators/bind";
import Feature from "../../services/FeatureService/Feature";

export default class MantineDates extends Feature {
    constructor(enabled = false, available = true) {
        super("mantine-dates", "Dates", enabled, available);
    }

    @bind
    public async apply(generator: Generator): Promise<void> {
        await generator.addDependencies(["@mantine/dates", "dayjs"]);
    }
}

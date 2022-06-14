import Generator from "yeoman-generator";
import bind from "../../decorators/bind";
import Feature from "../../services/FeatureService/Feature";

export default class MantineNotifications extends Feature {
    constructor() {
        super("mantine-notifications", "Notifications");
    }

    @bind
    public apply(generator: Generator): void {
        generator.addDependencies(["@mantine/notifications"]);
    }
}

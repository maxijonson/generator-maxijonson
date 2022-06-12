import which from "which";
import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature from "../services/FeatureService/Feature";
import setDestinationRoot from "../utils/setDestinationRoot";

export default class Gh extends Feature {
    constructor(
        enabled = false,
        available = !!which.sync("gh", { nothrow: true }),
        hidden = false
    ) {
        super("gh", "Github Repo", enabled, available, hidden);
    }

    public override getName(): string {
        return this.available ? this.name : `${this.name} ('gh' not installed)`;
    }

    @bind
    public apply(generator: Generator): void {
        generator.spawnCommandSync("gh", [
            "repo",
            "create",
            generator.appname,
            "--clone",
            "--private",
        ]);
        setDestinationRoot(generator);
        generator.env.cwd = generator.destinationPath();
    }
}

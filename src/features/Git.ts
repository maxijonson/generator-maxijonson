import chalk from "chalk";
import which from "which";
import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature, { GetFeature } from "../services/FeatureService/Feature";
import setDestinationRoot from "../utils/setDestinationRoot";
import Gh from "./Gh";

export default class Git extends Feature {
    constructor(
        enabled = false,
        available = !!which.sync("git", { nothrow: true })
    ) {
        super("git", "Git Init", enabled, available);
    }

    public override getName(): string {
        return this.available
            ? this.name
            : `${this.name} ('git' not installed)`;
    }

    @bind
    public apply(generator: Generator, getFeature: GetFeature): void {
        const gh = getFeature(Gh);

        if (gh?.isEnabled()) return;
        setDestinationRoot(generator);

        if (!which.sync("git", { nothrow: true })) {
            generator.log(chalk.yellow("Git is not installed"));
            return;
        }

        generator.spawnCommandSync("git", ["init"]);
        generator.env.cwd = generator.destinationPath();
    }
}

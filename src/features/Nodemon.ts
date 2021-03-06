import Generator from "yeoman-generator";
import Feature, { GetFeature } from "../services/FeatureService/Feature";
import copyTpl from "../utils/copyTpl";
import DevContainer from "./DevContainer";

export default class Nodemon extends Feature {
    constructor(enabled = false, available = true) {
        super("nodemon", "Nodemon", enabled, available);
    }

    public async apply(
        generator: Generator,
        getFeature: GetFeature
    ): Promise<void> {
        const devcontainer = getFeature(DevContainer);

        copyTpl(
            generator,
            generator.templatePath("nodemon.json"),
            generator.destinationPath("nodemon.json"),
            { devcontainer: devcontainer?.isEnabled() }
        );

        await generator.addDevDependencies(["nodemon"]);
    }
}

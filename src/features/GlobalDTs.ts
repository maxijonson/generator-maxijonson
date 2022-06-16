import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature, { GetFeature } from "../services/FeatureService/Feature";
import copyTpl from "../utils/copyTpl";
import React from "./React";

export default class GlobalDTs extends Feature {
    constructor(enabled = false, available = true) {
        super("globaldts", "global.d.ts", enabled, available);
    }

    @bind
    public async apply(
        generator: Generator,
        getFeature: GetFeature
    ): Promise<void> {
        const react = getFeature(React);

        copyTpl(
            generator,
            generator.templatePath("src/global.d.ts"),
            generator.destinationPath("src/global.d.ts"),
            { react: react?.isEnabled() }
        );
    }
}

import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature, { GetFeature } from "../services/FeatureService/Feature";
import copyTpl from "../utils/copyTpl";
import React from "./React";

export default class I18next extends Feature {
    constructor(enabled = false, available = true) {
        super("i18next", "i18next", enabled, available);
    }

    @bind
    public async apply(
        generator: Generator,
        getFeature: GetFeature
    ): Promise<void> {
        const react = getFeature(React);

        copyTpl(
            generator,
            generator.templatePath("src/i18n"),
            generator.destinationPath("src/i18n")
        );

        await generator.addDependencies([
            "i18next",
            "i18next-resources-to-backend",
        ]);

        if (react?.isEnabled()) {
            await generator.addDependencies([
                "react-i18next",
                "i18next-browser-languagedetector",
            ]);
        }
    }
}

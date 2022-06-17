import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature, { GetFeature } from "../services/FeatureService/Feature";
import copyTpl from "../utils/copyTpl";
import I18next from "./I18next";
import Mantine from "./mantine/Mantine";
import React from "./React";

export default class Vite extends Feature {
    constructor(enabled = false, available = true) {
        super("vite", "Vite", enabled, available);
    }

    @bind
    public async apply(
        generator: Generator,
        getFeature: GetFeature
    ): Promise<void> {
        const react = getFeature(React);
        const mantine = getFeature(Mantine);
        const i18next = getFeature(I18next);

        generator.packageJson.merge({
            scripts: {
                start: "vite serve src",
                preview: "vite preview",
                build: "npm-run-all clean build:esm build:cjs build:types && vite build",
            },
        });

        copyTpl(
            generator,
            generator.templatePath("vite.config.ts"),
            generator.destinationPath("vite.config.ts"),
            {
                react: react?.isEnabled(),
                mantine: mantine?.isEnabled(),
                i18next: i18next?.isEnabled(),
            }
        );

        await generator.addDevDependencies([
            "vite",
            "vite-imagetools",
            "wildcard-match",
        ]);

        if (react?.isEnabled()) {
            await generator.addDevDependencies(["@vitejs/plugin-react"]);
        }
    }
}

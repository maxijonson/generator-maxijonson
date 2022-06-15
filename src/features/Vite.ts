import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature, { GetFeature } from "../services/FeatureService/Feature";
import copyTpl from "../utils/copyTpl";
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

        generator.packageJson.merge({
            start: "vite serve src",
            preview: "vite preview",
            build: "npm-run-all clean build:esm build:cjs build:types && vite build",
        });

        copyTpl(
            generator,
            generator.templatePath("vite.config.ts"),
            generator.destinationPath("vite.config.ts")
        );

        await generator.addDevDependencies(["vite"]);

        if (react?.isEnabled()) {
            await generator.addDevDependencies(["@vitejs/plugin-react"]);
        }
    }
}

import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature, { GetFeature } from "../services/FeatureService/Feature";
import copyTpl from "../utils/copyTpl";
import React from "./react/React";
import Tests from "./Tests";
import Vite from "./react/Vite";

export default class TSConfig extends Feature {
    constructor(enabled = false, available = true) {
        super("tsconfig", "TSConfigs", enabled, available);
    }

    @bind
    public apply(generator: Generator, getFeature: GetFeature): void {
        const tests = getFeature(Tests);
        const vite = getFeature(Vite);
        const react = getFeature(React);

        [
            "tsconfig.base.json",
            "tsconfig.json",
            "tsconfig.cjs.json",
            "tsconfig.esm.json",
            "tsconfig.prod.json",
        ].forEach((file) =>
            copyTpl(
                generator,
                generator.templatePath(file),
                generator.destinationPath(file),
                {
                    react: react?.isEnabled(),
                    tests: tests?.isEnabled(),
                    vite: vite?.isEnabled(),
                }
            )
        );

        copyTpl(
            generator,
            generator.templatePath(".build"),
            generator.destinationPath(".build")
        );
    }
}

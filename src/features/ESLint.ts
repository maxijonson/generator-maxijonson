import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature, { GetFeature } from "../services/FeatureService/Feature";
import copyTpl from "../utils/copyTpl";
import Express from "./express/Express";
import Prettier from "./Prettier";
import React from "./react/React";
import Tests from "./Tests";

export default class ESLint extends Feature {
    constructor(enabled = false, available = true) {
        super("eslint", "ESLint", enabled, available);
    }

    @bind
    public async apply(
        generator: Generator,
        getFeature: GetFeature
    ): Promise<void> {
        const prettier = getFeature(Prettier);
        const react = getFeature(React);
        const tests = getFeature(Tests);
        const express = getFeature(Express);

        copyTpl(
            generator,
            generator.templatePath(".eslintrc"),
            generator.destinationPath(".eslintrc"),
            {
                prettier: prettier?.isEnabled(),
                react: react?.isEnabled(),
                express: express?.isEnabled(),
            }
        );

        copyTpl(
            generator,
            generator.templatePath(".eslintignore"),
            generator.destinationPath(".eslintignore"),
            { tests: tests?.isEnabled() }
        );

        await generator.addDevDependencies([
            "eslint",
            "@typescript-eslint/eslint-plugin",
            "@typescript-eslint/parser",
            "eslint-config-airbnb",
            "eslint-config-typescript",
            "eslint-plugin-import",
        ]);

        if (prettier?.isEnabled()) {
            await generator.addDevDependencies([
                "eslint-plugin-prettier",
                "eslint-config-prettier",
            ]);
        }

        if (react?.isEnabled()) {
            await generator.addDevDependencies(["eslint-plugin-react-hooks"]);
        }
    }
}

import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature, { GetFeature } from "../services/FeatureService/Feature";
import copyTpl from "../utils/copyTpl";
import React from "./React";

export default class Tests extends Feature {
    constructor(enabled = false, available = true) {
        super("tests", "Tests", enabled, available);
    }

    @bind
    public async apply(
        generator: Generator,
        getFeature: GetFeature
    ): Promise<void> {
        const react = getFeature(React);

        copyTpl(
            generator,
            generator.templatePath("src/index.test.ts"),
            generator.destinationPath("src/index.test.ts")
        );

        copyTpl(
            generator,
            generator.templatePath("src/config/setupTests.ts"),
            generator.destinationPath("src/config/setupTests.ts")
        );

        copyTpl(
            generator,
            generator.templatePath("jest.config.ts"),
            generator.destinationPath("jest.config.ts"),
            { react: react?.isEnabled() ?? false }
        );

        await generator.addDevDependencies(["jest", "@types/jest", "ts-jest"]);

        if (react?.isEnabled()) {
            await generator.addDevDependencies([
                "@testing-library/react",
                "@testing-library/jest-dom",
                "@types/testing-library__jest-dom",
            ]);
        }
    }
}

import Generator from "yeoman-generator";
import fs from "fs-extra";
import bind from "../../decorators/bind";
import Feature, { GetFeature } from "../../services/FeatureService/Feature";
import copyTpl from "../../utils/copyTpl";
import Tests from "../Tests";

export default class React extends Feature {
    constructor(enabled = false, available = true) {
        super("react", "React", enabled, available);
    }

    @bind
    public async apply(
        generator: Generator,
        getFeature: GetFeature
    ): Promise<void> {
        const tests = getFeature(Tests);

        copyTpl(
            generator,
            generator.templatePath("src/components/Catcher/index.tsx"),
            generator.destinationPath("src/components/Catcher/index.tsx")
        );

        ["fonts", "images"].forEach((dir) => {
            fs.ensureDirSync(generator.destinationPath(`src/assets/${dir}`));
        });

        await generator.addDependencies(["react", "react-dom"]);
        await generator.addDevDependencies([
            "@types/react",
            "@types/react-dom",
        ]);

        if (tests?.isEnabled()) {
            copyTpl(
                generator,
                generator.templatePath("src/components/App/App.test.tsx"),
                generator.destinationPath("src/components/App/App.test.tsx")
            );

            copyTpl(
                generator,
                generator.templatePath("src/config/setupTests.ts"),
                generator.destinationPath("src/config/setupTests.ts")
            );

            await generator.addDevDependencies([
                "@testing-library/react",
                "@testing-library/jest-dom",
                "@types/testing-library__jest-dom",
                "jest-environment-jsdom",
            ]);
        }
    }
}

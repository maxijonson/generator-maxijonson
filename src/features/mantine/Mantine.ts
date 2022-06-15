import Generator from "yeoman-generator";
import bind from "../../decorators/bind";
import Feature, { GetFeature } from "../../services/FeatureService/Feature";
import copyTpl from "../../utils/copyTpl";
import I18next from "../I18next";
import Tests from "../Tests";
import MantineCore from "./Core";

export default class Mantine extends Feature {
    constructor(enabled = false, available = true) {
        super("mantine", "Mantine", enabled, available);
    }

    @bind
    public apply(generator: Generator, getFeature: GetFeature): void {
        const core = getFeature(MantineCore);
        const i18next = getFeature(I18next);
        const tests = getFeature(Tests);

        copyTpl(
            generator,
            generator.templatePath("src/index.html"),
            generator.destinationPath("src/index.html"),
            { appname: generator.appname }
        );

        copyTpl(
            generator,
            generator.templatePath("src/index.tsx"),
            generator.destinationPath("src/index.tsx"),
            {
                core: core?.isEnabled(),
                i18next: i18next?.isEnabled(),
            }
        );

        copyTpl(
            generator,
            generator.templatePath("src/components/App/App.tsx"),
            generator.destinationPath("src/components/App/App.tsx")
        );

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
        }
    }
}

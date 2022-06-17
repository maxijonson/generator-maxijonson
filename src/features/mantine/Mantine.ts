import Generator from "yeoman-generator";
import bind from "../../decorators/bind";
import Feature, { GetFeature } from "../../services/FeatureService/Feature";
import copyTpl from "../../utils/copyTpl";
import I18next from "../I18next";
import ReactRouterDom from "../ReactRouterDom";
import MantineHooks from "./Hooks";

export default class Mantine extends Feature {
    constructor(enabled = false, available = true) {
        super("mantine", "Mantine", enabled, available);
    }

    @bind
    public apply(generator: Generator, getFeature: GetFeature): void {
        const i18next = getFeature(I18next);
        const router = getFeature(ReactRouterDom);
        const hooks = getFeature(MantineHooks);

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
                i18next: i18next?.isEnabled(),
                hooks: hooks?.isEnabled(),
            }
        );

        copyTpl(
            generator,
            generator.templatePath("src/components/App/index.tsx"),
            generator.destinationPath("src/components/App/index.tsx"),
            { router: router?.isEnabled() }
        );

        copyTpl(
            generator,
            generator.templatePath("src/components/GlobalStyles/index.tsx"),
            generator.destinationPath("src/components/GlobalStyles/index.tsx")
        );

        copyTpl(
            generator,
            generator.templatePath("src/components/Fonts/index.tsx"),
            generator.destinationPath("src/components/Fonts/index.tsx")
        );

        copyTpl(
            generator,
            generator.templatePath("src/components/DebugTools/index.tsx"),
            generator.destinationPath("src/components/DebugTools/index.tsx"),
            { i18next: i18next?.isEnabled() }
        );

        copyTpl(
            generator,
            generator.templatePath("src/pages/Home/index.tsx"),
            generator.destinationPath("src/pages/Home/index.tsx"),
            { i18next: i18next?.isEnabled() }
        );
    }
}

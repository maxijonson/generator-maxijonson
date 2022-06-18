import path from "path";
import bind from "../decorators/bind";
import MantineCore from "../features/mantine/Core";
import MantineDates from "../features/mantine/Dates";
import MantineDropzone from "../features/mantine/Dropzone";
import MantineForm from "../features/mantine/Form";
import MantineHooks from "../features/mantine/Hooks";
import MantineModals from "../features/mantine/Modals";
import MantineNotifications from "../features/mantine/Notifications";
import MantinePrism from "../features/mantine/Prism";
import MantineRTE from "../features/mantine/RTE";
import MantineSpotlight from "../features/mantine/Spotlight";
import MantineFramework from "../features/mantine/Mantine";
import Features from "../prompts/Features";
import FeatureService from "../services/FeatureService/FeatureService";
import Framework from "../services/ReactFrameworkService/ReactFramework";
import GeneratorReact from "../generators/react";
import { PROMPT_ORDER_REACTFRAMEWORK } from "../utils/constants";

interface Answers {
    packages: (string | string[])[];
}

class Mantine extends Framework {
    private packagesFeatureService!: FeatureService;

    answers!: Answers;

    constructor(generator: GeneratorReact) {
        super("mantine", "Mantine", generator);
    }

    @bind
    async initialize() {
        const sourceRoot = path.join(
            __dirname,
            "../generators/react/templates",
            "Mantine"
        );
        this.packagesFeatureService = new FeatureService(this.generator)
            .setGenerator(this.generator, sourceRoot)
            .addHiddenFeature(new MantineCore(true))
            .addFeature(new MantineHooks(true))
            .addFeature(new MantineForm())
            .addFeature(new MantineDates())
            .addFeature(new MantineNotifications())
            .addFeature(new MantinePrism())
            .addFeature(new MantineRTE())
            .addFeature(new MantineDropzone())
            .addFeature(new MantineModals())
            .addFeature(new MantineSpotlight());

        this.generator.featureService
            .setGenerator(this.generator, sourceRoot)
            .extend(this.packagesFeatureService, true)
            .addHiddenFeature(new MantineFramework(true));

        this.generator.promptService.addPrompt(
            new Features(
                this.packagesFeatureService,
                "checkbox",
                "mantine-packages",
                "Which Mantine packages do you want to use?"
            ),
            PROMPT_ORDER_REACTFRAMEWORK
        );
    }
}

export default Mantine;

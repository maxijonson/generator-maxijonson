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
import Vite from "../features/Vite";
import MantineFramework from "../features/mantine/Mantine";
import Features from "../prompts/Features";
import FeatureService from "../services/FeatureService/FeatureService";
import Framework from "../services/ReactFrameworkService/ReactFramework";
import GeneratorReact from "../generators/react";
import {
    FEATURE_DISABLED,
    PROMPT_ORDER_REACTFRAMEWORK,
} from "../utils/constants";
import TSIndex from "../features/TSIndex";

interface Answers {
    packages: (string | string[])[];
}

class Mantine extends Framework {
    private packagesFeatureService!: FeatureService;
    private bundlerFeatureService!: FeatureService;

    answers!: Answers;

    constructor(generator: GeneratorReact) {
        super("mantine", generator);
    }

    @bind
    public getName(): string {
        return "Mantine";
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
            .addFeature(new MantineCore())
            .addFeature(new MantineHooks())
            .addFeature(new MantineForm())
            .addFeature(new MantineDates())
            .addFeature(new MantineNotifications())
            .addFeature(new MantinePrism())
            .addFeature(new MantineRTE())
            .addFeature(new MantineDropzone())
            .addFeature(new MantineModals())
            .addFeature(new MantineSpotlight());

        this.bundlerFeatureService = new FeatureService(this.generator)
            .setGenerator(this.generator, sourceRoot)
            .addFeature(new Vite());

        this.generator.featureService
            .setGenerator(this.generator, sourceRoot)
            .addFeature(new TSIndex(...FEATURE_DISABLED))
            .addFeature(new MantineFramework());

        this.generator.promptService
            .addPrompt(
                new Features(
                    this.packagesFeatureService,
                    "checkbox",
                    "mantine-packages",
                    "Which Mantine packages do you want to use?"
                ),
                PROMPT_ORDER_REACTFRAMEWORK
            )
            .addPrompt(
                new Features(
                    this.bundlerFeatureService,
                    "list",
                    "mantine-bundler",
                    "Which bundler do you want to use?"
                ),
                PROMPT_ORDER_REACTFRAMEWORK
            );
    }

    override async writing(): Promise<void> {
        await this.bundlerFeatureService.applyFeatures();
        await this.packagesFeatureService.applyFeatures();
    }
}

export default Mantine;

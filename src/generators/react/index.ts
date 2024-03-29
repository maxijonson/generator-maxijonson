import Generator from "yeoman-generator";
import path from "path";
import GeneratorApp, { GeneratorOptions } from "../app";
import ReactFrameworkService from "../../services/ReactFrameworkService/ReactFrameworkService";
import ReactFrameworks from "../../prompts/ReactFrameworks";
import Mantine from "../../react-frameworks/Mantine";
import React from "../../features/react/React";
import ReactRouterDom from "../../features/react/ReactRouterDom";
import {
    PROMPT_ORDER_REACTFEATURES,
    PROMPT_ORDER_REACTBUNDLER,
    PROMPT_ORDER_REACTFRAMEWORKS,
} from "../../utils/constants";
import Heroku from "../../features/Heroku";
import TSIndex from "../../features/TSIndex";
import FeatureService from "../../services/FeatureService/FeatureService";
import Features from "../../prompts/Features";
import Vite from "../../features/react/Vite";

interface Options {
    framework?: string;
}

class GeneratorReact extends GeneratorApp<Options> {
    public frameworkService: ReactFrameworkService = new ReactFrameworkService(
        this
    );
    private reactFeatureService: FeatureService = new FeatureService(this);
    private bundlerFeatureService: FeatureService = new FeatureService(this);

    constructor(
        args: ConstructorParameters<typeof Generator>[0],
        options: GeneratorOptions<Options>
    ) {
        super(args, options);
        this.option("framework", { type: String });
    }

    override async initializing() {
        await super.initializing();
        this.reactFeatureService
            .setGenerator(this, path.join(__dirname, "templates", "Common"))
            .addHiddenFeature(new React(true))
            .addHiddenFeature(new ReactRouterDom(true))
            .addHiddenFeature(new TSIndex())
            .addFeature(new Heroku());

        this.frameworkService
            .setGenerator(this)
            .addFramework(new Mantine(this));

        this.bundlerFeatureService
            .setGenerator(this, path.join(__dirname, "templates", "Common"))
            .addFeature(new Vite());

        this.promptService
            .setGenerator(this)
            .addPrompt(
                new ReactFrameworks(this.frameworkService),
                PROMPT_ORDER_REACTFRAMEWORKS
            )
            .addPrompt(
                new Features(
                    this.bundlerFeatureService,
                    "list",
                    "react-bundler",
                    "Which bundler do you want to use?"
                ),
                PROMPT_ORDER_REACTBUNDLER
            )
            .addPrompt(
                new Features(
                    this.reactFeatureService,
                    "checkbox",
                    "react-features",
                    "Which React features do you want to use?"
                ),
                PROMPT_ORDER_REACTFEATURES
            );

        this.featureService
            .extend(this.reactFeatureService, true)
            .extend(this.bundlerFeatureService, true);
    }

    override async prompting() {
        await super.prompting();
        await this.frameworkService.prompting();
    }

    override async configuring() {
        await super.configuring();
        await this.frameworkService.configuring();
    }

    override async writing() {
        await super.writing();
        await this.frameworkService.writing();
    }

    override async conflicts() {
        await super.conflicts();
        await this.frameworkService.conflicts();
    }

    override async install() {
        await super.install();
        await this.frameworkService.install();
    }

    override async end() {
        await super.end();
        await this.frameworkService.end();
    }
}

export default GeneratorReact;

import path from "path";
import Generator from "yeoman-generator";
import Express from "../../features/express/Express";
import PM2 from "../../features/express/PM2";
import Npm from "../../features/Npm";
import Tests from "../../features/Tests";
import TSIndex from "../../features/TSIndex";
import Features from "../../prompts/Features";
import FeatureService from "../../services/FeatureService/FeatureService";
import { PROMPT_ORDER_EXPRESSFEATURES } from "../../utils/constants";
import GeneratorApp, { GeneratorOptions } from "../app";

interface Options {}

class GeneratorExpress extends GeneratorApp<Options> {
    private expressFeatureService: FeatureService = new FeatureService(this);

    constructor(
        args: ConstructorParameters<typeof Generator>[0],
        options: GeneratorOptions<Options>
    ) {
        super(args, options);
    }

    override async initializing() {
        await super.initializing();
        this.expressFeatureService
            .setGenerator(this, path.join(__dirname, "templates"))
            .addHiddenFeature(new Express(true))
            .addHiddenFeature(new TSIndex(true))
            .addFeature(new PM2());

        this.promptService
            .setGenerator(this)
            .addPrompt(
                new Features(
                    this.expressFeatureService,
                    "checkbox",
                    "express-features",
                    "Which Express features do you want to use?"
                ),
                PROMPT_ORDER_EXPRESSFEATURES
            );

        this.featureService
            .extend(this.expressFeatureService, true)
            .removeFeature(Tests)
            .removeFeature(Npm);
    }

    override async prompting() {
        await super.prompting();
    }

    override async configuring() {
        await super.configuring();
    }

    override async writing() {
        await super.writing();
    }

    override async conflicts() {
        await super.conflicts();
    }

    override async install() {
        await super.install();
    }

    override async end() {
        await super.end();
    }
}

export default GeneratorExpress;

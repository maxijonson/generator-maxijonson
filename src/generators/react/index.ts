import Generator from "yeoman-generator";
import path from "path";
import GeneratorApp, { GeneratorOptions } from "../app";
import ReactFrameworkService from "../../services/ReactFrameworkService/ReactFrameworkService";
import ReactFrameworks from "../../prompts/ReactFrameworks";
import Mantine from "../../react-frameworks/Mantine";
import React from "../../features/React";
import ReactRouterDom from "../../features/ReactRouterDom";
import { PROMPT_ORDER_REACTFRAMEWORKS } from "../../utils/constants";
import Heroku from "../../features/Heroku";

interface Options {
    framework?: string;
}

class GeneratorReact extends GeneratorApp<Options> {
    public frameworkService: ReactFrameworkService = new ReactFrameworkService(
        this
    );

    constructor(
        args: ConstructorParameters<typeof Generator>[0],
        options: GeneratorOptions<Options>
    ) {
        super(args, options);
        this.option("framework", { type: String });
    }

    /** Your initialization methods (checking current project state, getting configs, etc) */
    override async initializing() {
        await super.initializing();
        this.featureService
            .setGenerator(this, path.join(__dirname, "templates", "Common"))
            .addFeature(new ReactRouterDom())
            .addFeature(new Heroku())
            .addHiddenFeature(new React(true));

        this.frameworkService
            .setGenerator(this)
            .addFramework(new Mantine(this));

        this.promptService
            .setGenerator(this)
            .addPrompt(
                new ReactFrameworks(this.frameworkService),
                PROMPT_ORDER_REACTFRAMEWORKS
            );
    }

    /** Where you prompt users for options (where you'd call `this.prompt()`) */
    override async prompting() {
        await super.prompting();
        await this.frameworkService.prompting();
    }

    /** Saving configurations and configure the project (creating `.editorconfig` files and other metadata files) */
    override async configuring() {
        await super.configuring();
        await this.frameworkService.configuring();
    }

    /** Where you write the generator specific files (routes, controllers, etc) */
    override async writing() {
        await super.writing();
        await this.frameworkService.writing();
    }

    /** Where conflicts are handled (used internally) */
    override async conflicts() {
        await super.conflicts();
        await this.frameworkService.conflicts();
    }

    /** Where installations are run (npm, bower) */
    override async install() {
        await super.install();
        await this.frameworkService.install();
    }

    /** Called last, cleanup, say good bye, etc */
    override async end() {
        await super.end();
        await this.frameworkService.end();
    }
}

export default GeneratorReact;

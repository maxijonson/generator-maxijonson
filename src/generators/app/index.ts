import Generator from "yeoman-generator";
import path from "path";
import FeatureService from "../../services/FeatureService/FeatureService";
import PromptService from "../../services/PromptService/PromptService";
import Gh from "../../features/Gh";
import Git from "../../features/Git";
import Npm from "../../features/Npm";
import Prettier from "../../features/Prettier";
import Tests from "../../features/Tests";
import VSCodeLaunch from "../../features/VSCodeLaunch";
import VSCodeSettings from "../../features/VSCodeSettings";
import GitIgnore from "../../features/GitIgnore";
import License from "../../features/License";
import Nodemon from "../../features/Nodemon";
import GitAttributes from "../../features/GitAttributes";
import Env from "../../features/Env";
import PackageJson from "../../features/PackageJson";
import Readme from "../../features/Readme";
import TSConfig from "../../features/TSConfig";
import DevContainer from "../../features/DevContainer";
import ESLint from "../../features/ESLint";
import TSIndex from "../../features/TSIndex";
import Lodash from "../../features/Lodash";
import AppName from "../../prompts/AppName";
import Features from "../../prompts/Features";
import {
    FEATURE_ORDER_GH,
    FEATURE_ORDER_GIT,
    FEATURE_ORDER_PACKAGEJSON,
    PROMPT_ORDER_APPNAME,
    PROMPT_ORDER_FEATURES,
} from "../../utils/constants";
import I18next from "../../features/I18next";
import GlobalDTs from "../../features/GlobalDTs";

export interface Arguments {
    name?: string;
}

export interface ComposedOptions {
    /** Merges into the existing package.json (writing stage) */
    packageJson?: {
        [key: string]: any;
    };
}

export type GeneratorOptions<
    T extends Record<string, any> = Record<string, never>
> = Arguments & ComposedOptions & T; // In the end, all available under `this.options`

class GeneratorApp<
    T extends Record<string, any> = Record<string, never>
> extends Generator<GeneratorOptions<T>> {
    public featureService = new FeatureService(this);
    public promptService = new PromptService(this);

    constructor(
        args: ConstructorParameters<typeof Generator>[0],
        options: GeneratorOptions<T>
    ) {
        super(args, options);
        this.argument("name", { type: String, required: false });
    }

    /** Your initialization methods (checking current project state, getting configs, etc) */
    async initializing() {
        this.featureService
            .setGenerator(this, path.join(__dirname, "templates"))
            .addHiddenFeature(new TSConfig(true))
            .addHiddenFeature(new TSIndex(true))
            .addHiddenFeature(new PackageJson(true), FEATURE_ORDER_PACKAGEJSON)
            .addFeature(new Git(true), FEATURE_ORDER_GIT)
            .addFeature(new GitIgnore(true))
            .addFeature(new GitAttributes(true))
            .addFeature(new ESLint(true))
            .addFeature(new Readme(true))
            .addFeature(new Gh(), FEATURE_ORDER_GH)
            .addFeature(new DevContainer())
            .addFeature(new Env())
            .addFeature(new Lodash())
            .addFeature(new Prettier())
            .addFeature(new Tests())
            .addFeature(new License())
            .addFeature(new Nodemon())
            .addFeature(new Npm())
            .addFeature(new VSCodeLaunch())
            .addFeature(new VSCodeSettings())
            .addFeature(new I18next())
            .addFeature(new GlobalDTs());

        this.promptService
            .setGenerator(this)
            .addPrompt(new AppName(), PROMPT_ORDER_APPNAME)
            .addPrompt(
                new Features(this.featureService),
                PROMPT_ORDER_FEATURES
            );
    }

    /** Where you prompt users for options (where you'd call `this.prompt()`) */
    async prompting() {
        await this.promptService.prompt();
    }

    /** Saving configurations and configure the project (creating `.editorconfig` files and other metadata files) */
    async configuring() {}

    /** Where you write the generator specific files (routes, controllers, etc) */
    async writing() {
        await this.featureService.applyFeatures();
    }

    /** Where conflicts are handled (used internally) */
    async conflicts() {}

    /** Where installations are run (npm, bower) */
    async install() {}

    /** Called last, cleanup, say good bye, etc */
    async end() {
        this.spawnCommandSync("npx", [
            "prettier",
            "--write",
            ".",
            "--loglevel",
            "silent",
        ]);
    }
}

export default GeneratorApp;

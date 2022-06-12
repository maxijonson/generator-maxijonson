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

export interface Arguments {
    name?: string;
}

export interface ComposedOptions {
    /** Merges into the existing package.json (writing stage) */
    packageJson?: {
        [key: string]: any;
    };
}

export type GeneratorOptions = Arguments & ComposedOptions; // In the end, all available under `this.options`

class GeneratorApp extends Generator<GeneratorOptions> {
    protected featureService = new FeatureService(this);
    protected promptService = new PromptService(this);

    constructor(
        args: ConstructorParameters<typeof Generator>[0],
        options: GeneratorOptions
    ) {
        super(args, options);
        this.argument("name", { type: String, required: false });
    }

    /** Your initialization methods (checking current project state, getting configs, etc) */
    async initializing() {
        this.featureService
            .setGenerator(this, path.join(__dirname, "templates"))
            .addFeature(new Gh())
            .addFeature(new Git())
            .addFeature(new PackageJson())
            .addFeature(new DevContainer())
            .addFeature(new Env())
            .addFeature(new TSConfig())
            .addFeature(new TSIndex())
            .addFeature(new Lodash())
            .addFeature(new ESLint())
            .addFeature(new Prettier())
            .addFeature(new Tests())
            .addFeature(new GitIgnore())
            .addFeature(new GitAttributes())
            .addFeature(new Readme())
            .addFeature(new License())
            .addFeature(new Nodemon())
            .addFeature(new Npm())
            .addFeature(new VSCodeLaunch())
            .addFeature(new VSCodeSettings());

        this.promptService
            .setGenerator(this)
            .addPrompt(new AppName())
            .addPrompt(new Features(this.featureService));
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

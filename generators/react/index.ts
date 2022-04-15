import Generator from "yeoman-generator";
import GeneratorApp, { GeneratorOptions } from "../app";
import Framework from "./frameworks/Framework";
import fs from "fs";

interface Options {
    name?: string;
}

interface Answers {
    framework: number;
}

const FEATURES = {} as const;

class GeneratorReact extends Generator<Options> {
    private generatorApp!: GeneratorApp<typeof FEATURES>;
    private features!: typeof this.generatorApp["features"];
    private framework!: Framework;
    private frameworks: Framework[] = [];
    private answers!: Answers;

    dependencies: string[] = [];
    devDependencies: string[] = [];

    constructor(
        args: ConstructorParameters<typeof Generator>[0],
        options: Options
    ) {
        super(args, options);
        this.argument("name", { type: String, required: false });

        const generatorOptions: GeneratorOptions = {
            name: this.options.name,
        };

        this.generatorApp = this.composeWith(
            require.resolve("../app"),
            generatorOptions,
            true
        ) as GeneratorApp<typeof FEATURES>;
    }

    /** Your initialization methods (checking current project state, getting configs, etc) */
    async initializing() {
        const files = fs
            .readdirSync(this.templatePath("../frameworks"))
            .filter(
                (f) => f.split(".")[0] !== "Framework" && !f.endsWith(".ts")
            );

        for (const file of files) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const Framework = require(`./frameworks/${file}`).default;
            this.frameworks.push(new Framework(this));
        }
    }

    /** Where you prompt users for options (where you'd call `this.prompt()`) */
    async prompting() {
        this.answers = await this.prompt<Answers>([
            {
                type: "list",
                name: "framework",
                message: "Which framework do you want to use?",
                choices: this.frameworks.map((f, i) => ({
                    name: f.getName(),
                    value: i,
                })),
            },
        ]);
        this.framework = this.frameworks[this.answers.framework] as Framework;

        await this.framework.prompting();
    }

    /** Saving configurations and configure the project (creating `.editorconfig` files and other metadata files) */
    async configuring() {
        this.features = this.generatorApp.features;
        await this.framework.configuring();
    }

    _viteInit() {
        this.spawnCommandSync("npm", [
            "create",
            "@vitejs/app",
            "mantine-vite",
            "--template",
            "react-ts",
        ]);
    }

    async _packageInit() {
        const dependencies: string[] = [...this.dependencies];
        const devDependencies: string[] = [...this.devDependencies];

        this.generatorApp.options.dependencies = dependencies;
        this.generatorApp.options.devDependencies = devDependencies;
    }

    /** Where you write the generator specific files (routes, controllers, etc) */
    async writing() {
        this.destinationRoot(this.appname);
        this.features = this.generatorApp.features;

        this._viteInit();
        await this._packageInit();
        await this.framework.writing();
    }

    /** Where conflicts are handled (used internally) */
    async conflicts() {
        await this.framework.conflicts();
    }

    /** Where installations are run (npm, bower) */
    async install() {
        await this.framework.install();
    }

    /** Called last, cleanup, say good bye, etc */
    async end() {
        await this.framework.end();
    }
}

export default GeneratorReact;

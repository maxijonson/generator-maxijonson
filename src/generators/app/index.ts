import Generator from "yeoman-generator";
import validateName from "validate-npm-package-name";
import which from "which";
import chalk from "chalk";
import _ from "lodash";

interface Arguments {
    name?: string;
}

interface Options {
    dependencies?: string[] | string;
    devDependencies?: string[] | string;
}

interface ComposedOptions {
    /** Additionnal features to prompt for. Available in the `features` attribute of this generator after prompting */
    features?: {
        name: string;
        value: string;
        checked?: boolean;
        disabled?: boolean;
    }[];
    /** Merges into the existing package.json (writing stage) */
    packageJson?: {
        [key: string]: any;
    };
    /** Destination paths to skip */
    skippedFiles?: string[];
    /** If the project is React */
    react?: boolean;
}

export type GeneratorOptions = Arguments & Options & ComposedOptions; // In the end, all available under `this.options`

interface Answers<F> {
    name: string;
    features: (keyof typeof FEATURES | keyof F)[];
}

interface System {
    git: boolean;
    gh: boolean;
}

const FEATURES = {
    gh: "gh",
    prettier: "prettier",
    eslint: "eslint",
    devcontainer: "devcontainer",
    tests: "tests",
    settings: "settings",
    launch: "launch",
    npm: "npm",
} as const;

type CopyTpl = Generator<GeneratorOptions>["fs"]["copyTpl"];

const npmifyName = (name: string) =>
    name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();

class GeneratorApp<
    F = Record<string, never>
> extends Generator<GeneratorOptions> {
    answers!: Answers<F>;
    system!: System;
    features!: {
        [key in Answers<F>["features"][0]]: boolean;
    };

    constructor(
        args: ConstructorParameters<typeof Generator>[0],
        options: GeneratorOptions
    ) {
        super(args, options);
        this.argument("name", { type: String, required: false });
        this.option("dependencies", { type: String });
        this.option("devDependencies", { type: String });
    }

    /** Your initialization methods (checking current project state, getting configs, etc) */
    initializing() {
        this.system = {
            git: !!which.sync("git", { nothrow: true }),
            gh: !!which.sync("gh", { nothrow: true }),
        };
    }

    /** Where you prompt users for options (where you'd call `this.prompt()`) */
    async prompting() {
        const composedFeatures = this.options.features ?? [];
        this.answers = await this.prompt<Answers<F>>([
            {
                type: "input",
                name: "name",
                message: "Your project name",
                when: !this.options.name,
                filter: npmifyName,
            },
            {
                type: "checkbox",
                name: "features",
                message: "What features would you like?",
                store: true,
                choices: [
                    {
                        name: this.system.gh
                            ? "Github Repo"
                            : "Github Repo (gh is not installed)",
                        value: FEATURES.gh,
                        checked: false,
                        disabled: !this.system.gh,
                    },
                    {
                        name: "Prettier",
                        value: FEATURES.prettier,
                        checked: true,
                    },
                    {
                        name: "ESLint",
                        value: FEATURES.eslint,
                        checked: true,
                    },
                    {
                        name: "Dev Container",
                        value: FEATURES.devcontainer,
                        checked: false,
                    },
                    {
                        name: "Tests",
                        value: FEATURES.tests,
                        checked: false,
                    },
                    {
                        name: "VSCode Settings",
                        value: FEATURES.settings,
                        checked: true,
                    },
                    {
                        name: "VSCode Launch",
                        value: FEATURES.launch,
                        checked: true,
                    },
                    {
                        name: "NPM Publishing",
                        value: FEATURES.npm,
                        checked: false,
                    },
                    ...composedFeatures,
                ],
            },
        ]);
    }

    _validateName() {
        if (this.options.name) {
            if (this.options.name === ".") {
                this.answers.name = npmifyName(this.appname);
            } else {
                this.answers.name = npmifyName(this.options.name);
            }
        }

        const {
            validForNewPackages: nameValid,
            errors,
            warnings,
        } = validateName(this.answers.name);

        if (!nameValid) {
            let error = "Project name is invalid:\n";
            if (errors?.length) {
                error += `- ${errors.join("\n- ")}`;
            }
            if (warnings?.length) {
                error += `- ${warnings.join("\n- ")}`;
            }
            this.env.error(new Error(error));
        }
    }

    _setAttributes() {
        const composedFeatures = this.options.features ?? [];

        this.appname = this.answers.name;
        this.features = _.keys(FEATURES).reduce((acc, key) => {
            const k = key as keyof typeof FEATURES;
            return {
                ...acc,
                [k]: this.answers.features.includes(k),
            };
        }, {} as typeof this.features);

        composedFeatures.map((f) => {
            const k = f.value as keyof F;
            this.features[k] = this.answers.features.includes(k);
        });
    }

    _gitInit() {
        if (this.features.gh) {
            this.spawnCommandSync("gh", [
                "repo",
                "create",
                this.appname,
                "--clone",
                "--private",
            ]);
            GeneratorApp._setDestinationRoot(this);
            return;
        }
        GeneratorApp._setDestinationRoot(this);

        if (!which.sync("git", { nothrow: true })) {
            this.log(chalk.yellow("Git is not installed"));
            return;
        }

        this.spawnCommandSync("git", ["init"]);
    }

    /** Saving configurations and configure the project (creating `.editorconfig` files and other metadata files) */
    configuring() {
        this._validateName();
        this._setAttributes();
        this._gitInit();
    }

    _repoInit() {
        this.env.cwd = this.destinationPath();

        this._copyTpl(
            this.templatePath("LICENSE"),
            this.destinationPath("LICENSE"),
            { year: new Date().getFullYear() }
        );

        this._copyTpl(
            this.templatePath("README.md"),
            this.destinationPath("README.md"),
            { appname: this.appname }
        );

        this._copyTpl(
            this.templatePath("gitignore"),
            this.destinationPath(".gitignore"),
            {
                settings: this.features.settings,
                launch: this.features.launch,
                tests: this.features.tests,
            }
        );

        this._copyTpl(
            this.templatePath(".gitattributes"),
            this.destinationPath(".gitattributes")
        );

        this._copyTpl(
            this.templatePath("src/index.ts"),
            this.destinationPath("src/index.ts")
        );

        [
            "tsconfig.base.json",
            "tsconfig.json",
            "tsconfig.cjs.json",
            "tsconfig.esm.json",
            "tsconfig.prod.json",
        ].forEach((file) =>
            this._copyTpl(this.templatePath(file), this.destinationPath(file), {
                react: this.options.react,
                tests: this.features.tests,
            })
        );

        this._copyTpl(
            this.templatePath("nodemon.json"),
            this.destinationPath("nodemon.json"),
            { devcontainer: this.features.devcontainer }
        );

        this._copyTpl(
            this.templatePath(".build"),
            this.destinationPath(".build")
        );

        this._copyTpl(this.templatePath(".env"), this.destinationPath(".env"));
    }

    async _packageInit() {
        this._copyTpl(
            this.templatePath("package.json"),
            this.destinationPath("package.json"),
            {
                appname: this.appname,
                tests: this.features.tests,
                npm: this.features.npm,
            }
        );

        if (this.options.packageJson) {
            this.packageJson.merge(this.options.packageJson);
        }

        const dependencies: string[] = ["lodash", "dotenv"];
        const devDependencies: string[] = [
            "typescript",
            "ts-node",
            "npm-run-all",
            "nodemon",
            "@types/lodash",
        ];

        if (this.options.dependencies) {
            const optsDependencies =
                typeof this.options.dependencies === "string"
                    ? this.options.dependencies.split(",").map((d) => d.trim())
                    : this.options.dependencies;
            dependencies.push(...optsDependencies);
        }

        if (this.options.devDependencies) {
            const optsDevDependencies =
                typeof this.options.devDependencies === "string"
                    ? this.options.devDependencies
                          .split(",")
                          .map((d) => d.trim())
                    : this.options.devDependencies;
            devDependencies.push(...optsDevDependencies);
        }

        if (this.features.prettier) {
            devDependencies.push("prettier");
        }

        if (this.features.eslint) {
            devDependencies.push(
                "eslint",
                "@typescript-eslint/eslint-plugin",
                "@typescript-eslint/parser",
                "eslint-config-airbnb",
                "eslint-config-typescript",
                "eslint-plugin-import"
            );

            if (this.features.prettier) {
                devDependencies.push(
                    "eslint-plugin-prettier",
                    "eslint-config-prettier"
                );
            }
        }

        if (this.features.tests) {
            devDependencies.push("jest", "@types/jest", "ts-jest");
        }

        if (this.features.npm) {
            devDependencies.push("np");
        }

        await this.addDependencies(dependencies);
        await this.addDevDependencies(devDependencies);
    }

    _prettierInit() {
        if (!this.features.prettier) return;

        this._copyTpl(
            this.templatePath(".prettierrc"),
            this.destinationPath(".prettierrc")
        );

        this._copyTpl(
            this.templatePath(".prettierignore"),
            this.destinationPath(".prettierignore"),
            { tests: this.features.tests }
        );
    }

    _eslintInit() {
        if (!this.features.eslint) return;

        this._copyTpl(
            this.templatePath(".eslintrc"),
            this.destinationPath(".eslintrc"),
            { prettier: this.features.prettier, react: this.options.react }
        );

        this._copyTpl(
            this.templatePath(".eslintignore"),
            this.destinationPath(".eslintignore"),
            { tests: this.features.tests }
        );
    }

    _devcontainerInit() {
        if (!this.features.devcontainer) return;

        this._copyTpl(
            this.templatePath(".devcontainer"),
            this.destinationPath(".devcontainer"),
            { appname: this.appname }
        );
    }

    _testsInit() {
        if (!this.features.tests) return;

        this._copyTpl(
            this.templatePath("src/index.test.ts"),
            this.destinationPath("src/index.test.ts")
        );

        this._copyTpl(
            this.templatePath("src/config/setupTests.ts"),
            this.destinationPath("src/config/setupTests.ts")
        );

        this._copyTpl(
            this.templatePath("jest.config.ts"),
            this.destinationPath("jest.config.ts"),
            { react: this.options.react }
        );
    }

    _vscodeInit() {
        if (this.features.settings) {
            this._copyTpl(
                this.templatePath(".vscode/settings.json"),
                this.destinationPath(".vscode/settings.json")
            );
        }

        if (this.features.launch) {
            this._copyTpl(
                this.templatePath(".vscode/launch.json"),
                this.destinationPath(".vscode/launch.json")
            );
        }
    }

    _npInit() {
        if (!this.features.npm) return;

        this._copyTpl(
            this.templatePath(".np-config.json"),
            this.destinationPath(".np-config.json"),
            { tests: this.features.tests }
        );
    }

    /** Where you write the generator specific files (routes, controllers, etc) */
    async writing() {
        this._repoInit();
        await this._packageInit();
        this._prettierInit();
        this._eslintInit();
        this._devcontainerInit();
        this._testsInit();
        this._vscodeInit();
        this._npInit();
    }

    /** Where conflicts are handled (used internally) */
    conflicts() {}

    /** Where installations are run (npm, bower) */
    install() {}

    /** Called last, cleanup, say good bye, etc */
    end() {
        this.spawnCommandSync("npx", [
            "prettier",
            "--write",
            ".",
            "--loglevel",
            "silent",
        ]);
    }

    /** Same as the standard copyTpl method, but only if the file does not already exist and is not skipped */
    _copyTpl(
        from: Parameters<CopyTpl>[0],
        to: Parameters<CopyTpl>[1],
        context?: Parameters<CopyTpl>[2],
        templateOptions?: Parameters<CopyTpl>[3],
        copyOptions?: Parameters<CopyTpl>[4]
    ) {
        if (this.fs.exists(to)) return;
        if (this.options.skippedFiles?.includes(to)) return;
        this.fs.copyTpl(from, to, context, templateOptions, copyOptions);
    }

    public static _setDestinationRoot(generator: Generator) {
        if (generator.options.name !== ".") {
            generator.destinationRoot(generator.appname);
        }
    }
}

export default GeneratorApp;

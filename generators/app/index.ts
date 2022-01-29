import Generator from "yeoman-generator";
import validateName from "validate-npm-package-name";
import which from "which";
import chalk from "chalk";
import _ from "lodash";

interface Answers {
    name: string;
    features: (
        | "gh"
        | "prettier"
        | "eslint"
        | "devcontainer"
        | "tests"
        | "settings"
        | "launch"
    )[];
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
} as const;

const npmifyName = (name: string) =>
    name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();

class GeneratorApp extends Generator {
    answers!: Answers;
    system!: System;
    features!: { [key in Answers["features"][0]]: boolean };

    constructor(
        args: ConstructorParameters<typeof Generator>[0],
        options: ConstructorParameters<typeof Generator>[1]
    ) {
        super(args, options);
        this.argument("name", { type: String, required: false });
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
        this.answers = await this.prompt<Answers>([
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
                ],
            },
        ]);
    }

    _validateName() {
        if (this.options.name) {
            this.answers.name = npmifyName(this.options.name);
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
        this.appname = this.answers.name;
        this.features = _.keys(FEATURES).reduce((acc, key) => {
            const k = key as Answers["features"][0];
            return {
                ...acc,
                [k]: this.answers.features.includes(k),
            };
        }, {} as { [key in Answers["features"][0]]: boolean });
    }

    _gitInit() {
        if (this.features.gh) {
            this.spawnCommandSync("gh", [
                "repo",
                "create",
                this.appname,
                "--confirm",
                "--private",
            ]);
            this.destinationRoot(this.appname);
            return;
        }
        this.destinationRoot(this.appname);

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

        this.fs.copyTpl(
            this.templatePath("LICENSE"),
            this.destinationPath("LICENSE"),
            { year: new Date().getFullYear() }
        );

        this.fs.copyTpl(
            this.templatePath("README.md"),
            this.destinationPath("README.md"),
            { appname: this.appname }
        );

        this.fs.copyTpl(
            this.templatePath(".gitignore"),
            this.destinationPath(".gitignore"),
            {
                settings: this.features.settings,
                launch: this.features.launch,
                tests: this.features.tests,
            }
        );

        this.fs.copyTpl(
            this.templatePath(".gitattributes"),
            this.destinationPath(".gitattributes")
        );

        this.fs.copyTpl(
            this.templatePath("src/index.ts"),
            this.destinationPath("src/index.ts")
        );

        [
            "tsconfig.base.json",
            "tsconfig.json",
            "tsconfig.cjs.json",
            "tsconfig.prod.json",
        ].forEach((file) =>
            this.fs.copyTpl(this.templatePath(file), this.destinationPath(file))
        );

        this.fs.copyTpl(
            this.templatePath("nodemon.json"),
            this.destinationPath("nodemon.json")
        );
    }

    _prettierInit() {
        if (!this.features.prettier) return;

        this.fs.copyTpl(
            this.templatePath(".prettierrc"),
            this.destinationPath(".prettierrc")
        );

        this.fs.copyTpl(
            this.templatePath(".prettierignore"),
            this.destinationPath(".prettierignore"),
            { tests: this.features.tests }
        );
    }

    _eslintInit() {
        if (!this.features.eslint) return;

        this.fs.copyTpl(
            this.templatePath(".eslintrc"),
            this.destinationPath(".eslintrc"),
            { prettier: this.features.prettier }
        );

        this.fs.copyTpl(
            this.templatePath(".eslintignore"),
            this.destinationPath(".eslintignore"),
            { tests: this.features.tests }
        );
    }

    _devcontainerInit() {
        if (!this.features.devcontainer) return;

        this.fs.copyTpl(
            this.templatePath(".devcontainer"),
            this.destinationPath(".devcontainer")
        );
    }

    _testsInit() {
        if (!this.features.tests) return;

        this.fs.copyTpl(
            this.templatePath("src/index.test.ts"),
            this.destinationPath("src/index.test.ts")
        );

        this.fs.copyTpl(
            this.templatePath("jest.config.ts"),
            this.destinationPath("jest.config.ts")
        );
    }

    _vscodeInit() {
        if (this.features.settings) {
            this.fs.copyTpl(
                this.templatePath(".vscode/settings.json"),
                this.destinationPath(".vscode/settings.json")
            );
        }

        if (this.features.launch) {
            this.fs.copyTpl(
                this.templatePath(".vscode/launch.json"),
                this.destinationPath(".vscode/launch.json")
            );
        }
    }

    /** Where you write the generator specific files (routes, controllers, etc) */
    writing() {
        this._repoInit();
        this._prettierInit();
        this._eslintInit();
        this._devcontainerInit();
        this._testsInit();
        this._vscodeInit();
    }

    /** Where conflicts are handled (used internally) */
    conflicts() {}

    /** Where installations are run (npm, bower) */
    async install() {
        this.fs.copyTpl(
            this.templatePath("package.json"),
            this.destinationPath("package.json"),
            { appname: this.appname, tests: this.features.tests }
        );

        const dependencies: string[] = ["lodash"];
        const devDependencies: string[] = [
            "typescript",
            "ts-node",
            "npm-run-all",
            "nodemon",
        ];

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

        await this.addDependencies(dependencies);
        await this.addDevDependencies(devDependencies);
    }

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
}

export default GeneratorApp;

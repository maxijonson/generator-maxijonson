import _ from "lodash";
import Framework from "./Framework";

interface Answers {
    packages: (string | string[])[];
}

const FOLDER = "Mantine";

const PACKAGES = {
    core: "@mantine/core",
    hooks: "@mantine/hooks",
    form: "@mantine/form",
    dates: ["@mantine/dates", "dayjs"],
    notifications: "@mantine/notifications",
    prism: "@mantine/prism",
    rte: "@mantine/rte",
    dropzone: "@mantine/dropzone",
    modals: "@mantine/modals",
    spotlight: "@mantine/spotlight",
} as const;

class Mantine extends Framework {
    answers!: Answers;

    getName(): string {
        return "Mantine";
    }

    override async prompting(): Promise<void> {
        this.answers = await this.generator.prompt<Answers>([
            {
                name: "packages",
                type: "checkbox",
                message: "Which Mantine packages do you want to use?",
                choices: [
                    {
                        name: "Core",
                        value: PACKAGES.core,
                        checked: true,
                    },
                    {
                        name: "Hooks",
                        value: PACKAGES.hooks,
                        checked: true,
                    },
                    {
                        name: "Form",
                        value: PACKAGES.form,
                        checked: false,
                    },
                    {
                        name: "Dates",
                        value: PACKAGES.dates,
                        checked: false,
                    },
                    {
                        name: "Notifications",
                        value: PACKAGES.notifications,
                        checked: false,
                    },
                    {
                        name: "Prism",
                        value: PACKAGES.prism,
                        checked: false,
                    },
                    {
                        name: "RTE",
                        value: PACKAGES.rte,
                        checked: false,
                    },
                    {
                        name: "Dropzone",
                        value: PACKAGES.dropzone,
                        checked: false,
                    },
                    {
                        name: "Modals",
                        value: PACKAGES.modals,
                        checked: false,
                    },
                    {
                        name: "Spotlight",
                        value: PACKAGES.spotlight,
                        checked: false,
                    },
                ],
            },
        ]);
    }

    dependenciesInit() {
        this.generator.dependencies.push(..._.flatten(this.answers.packages));
    }

    packageInit() {
        this.dependenciesInit();

        const packageJson = this.generator.generatorApp.options.packageJson!;
        const scripts: { [key: string]: string } = packageJson.scripts ?? {};
        if (!packageJson.scripts) {
            packageJson.scripts = scripts;
        }
    }

    repoInit() {
        this.generator.fs.copyTpl(
            this.generator.templatePath(FOLDER, "src/index.html"),
            this.generator.destinationPath("src/index.html"),
            { appname: this.generator.appname }
        );

        this.generator.fs.copyTpl(
            this.generator.templatePath(FOLDER, "src/index.tsx"),
            this.generator.destinationPath("src/index.tsx"),
            {
                core: this.answers.packages.includes(PACKAGES.core),
                i18next: this.generator.features.i18next,
            }
        );

        this.generator.copyTemplate(
            this.generator.templatePath(FOLDER, "src/components/App/App.tsx"),
            this.generator.destinationPath("src/components/App/App.tsx")
        );
    }

    testsInit() {
        if (!this.generator.features.tests) return;

        this.generator.copyTemplate(
            this.generator.templatePath(
                FOLDER,
                "src/components/App/App.test.tsx"
            ),
            this.generator.destinationPath("src/components/App/App.test.tsx")
        );

        this.generator.copyTemplate(
            this.generator.templatePath(FOLDER, "src/config/setupTests.ts"),
            this.generator.destinationPath("src/config/setupTests.ts")
        );
    }

    viteInit() {
        this.generator.devDependencies.push(
            "vite", // TODO: Make this an option (Vite, Webpack, CRA, etc)
            "@vitejs/plugin-react"
        );

        const packageJson = this.generator.generatorApp.options.packageJson!;
        const scripts: { [key: string]: string } = packageJson.scripts ?? {};
        if (!packageJson.scripts) {
            packageJson.scripts = scripts;
        }

        scripts.start = "vite serve src";
        scripts.preview = "vite preview";
        scripts.build =
            "npm-run-all clean build:esm build:cjs build:types && vite build";

        this.generator.copyTemplate(
            this.generator.templatePath(FOLDER, "vite.config.ts"),
            this.generator.destinationPath("vite.config.ts")
        );
    }

    herokuInit() {
        // https://vitejs.dev/guide/static-deploy.html#heroku
        this.generator.copyTemplate(
            this.generator.templatePath(FOLDER, "static.json"),
            this.generator.destinationPath("static.json")
        );
    }

    override writing(): void | Promise<void> {
        this.packageInit();
        this.repoInit();
        this.viteInit();
        this.herokuInit();
        this.testsInit();
    }
}

export default Mantine;

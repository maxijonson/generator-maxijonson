import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import ReactFramework from "../services/ReactFrameworkService/ReactFramework";
import Prompt from "../services/PromptService/Prompt";
import ReactFrameworkService from "../services/ReactFrameworkService/ReactFrameworkService";

interface Answers {
    framework: ReactFramework;
}

export default class ReactFrameworks extends Prompt<ReactFramework> {
    constructor(
        private reactFrameworkService: ReactFrameworkService,
        message = "Which framework do you want to use?"
    ) {
        super("reactframework", message);
    }

    @bind
    public async prompt(generator: Generator): Promise<ReactFramework> {
        const frameworks = this.reactFrameworkService.getFrameworks();
        let framework: ReactFramework | null = null;
        const optionFramework: string | undefined = generator.options.framework;

        if (optionFramework) {
            framework =
                frameworks.find(
                    (f) =>
                        f.getId().toLowerCase() ===
                            optionFramework.toLowerCase() ||
                        f.getName().toLowerCase() ===
                            optionFramework.toLowerCase()
                ) ?? null;
        }

        const answers = await generator.prompt<Answers>([
            {
                type: "list",
                name: "framework",
                message: this.message,
                choices: frameworks.map((f) => ({
                    name: f.getName(),
                    value: f,
                })),
                when: !framework,
            },
        ]);

        if (!framework) {
            framework = answers.framework;
        }

        await this.reactFrameworkService.setFramework(framework);
        return framework;
    }
}

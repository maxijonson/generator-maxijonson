import Generator from "yeoman-generator";
import validateName from "validate-npm-package-name";
import bind from "../decorators/bind";
import Prompt from "../services/PromptService/Prompt";

interface Answers {
    name: string;
}

export default class AppName extends Prompt<string> {
    constructor(message = "Your project name") {
        super("appname", message);
    }

    @bind
    private npmifyName(name: string): string {
        return name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    }

    @bind
    public async prompt(generator: Generator): Promise<string> {
        const { name } = await generator.prompt<Answers>([
            {
                type: "input",
                name: "name",
                message: this.message,
                when: !generator.options.name,
                filter: this.npmifyName,
            },
        ]);

        if (generator.options.name) {
            generator.appname = this.npmifyName(
                generator.options.name === "."
                    ? generator.appname
                    : generator.options.name
            );
        } else {
            generator.appname = name;
        }

        const {
            validForNewPackages: nameValid,
            errors,
            warnings,
        } = validateName(generator.appname);

        if (!nameValid) {
            let error = "Project name is invalid:\n";
            if (errors?.length) {
                error += `- ${errors.join("\n- ")}`;
            }
            if (warnings?.length) {
                error += `- ${warnings.join("\n- ")}`;
            }
            generator.env.error(new Error(error));
        }

        return generator.appname;
    }
}

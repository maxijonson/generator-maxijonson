import Generator from "yeoman-generator";
import GeneratorApp, { GeneratorOptions } from "../app";

interface Options {}

class GeneratorExpress extends GeneratorApp<Options> {
    constructor(
        args: ConstructorParameters<typeof Generator>[0],
        options: GeneratorOptions<Options>
    ) {
        super(args, options);
    }

    override async initializing() {
        await super.initializing();
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

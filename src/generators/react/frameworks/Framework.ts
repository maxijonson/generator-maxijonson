import GeneratorReact from "..";

abstract class Framework {
    constructor(protected generator: GeneratorReact) {}

    abstract getName(): string;

    prompting(): void | Promise<void> {}
    configuring(): void | Promise<void> {}
    writing(): void | Promise<void> {}
    conflicts(): void | Promise<void> {}
    install(): void | Promise<void> {}
    end(): void | Promise<void> {}
}

export default Framework;

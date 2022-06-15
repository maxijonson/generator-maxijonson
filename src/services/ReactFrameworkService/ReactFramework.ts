import bind from "../../decorators/bind";
import GeneratorReact from "../../generators/react";

export default abstract class ReactFramework {
    constructor(
        protected id: string,
        protected name: string,
        protected generator: GeneratorReact
    ) {}

    @bind
    public getId(): string {
        return this.id;
    }

    @bind
    public getName(): string {
        return this.name;
    }

    abstract initialize(): void | Promise<void>;

    @bind
    prompting(): void | Promise<void> {}

    @bind
    configuring(): void | Promise<void> {}

    @bind
    writing(): void | Promise<void> {}

    @bind
    conflicts(): void | Promise<void> {}

    @bind
    install(): void | Promise<void> {}

    @bind
    end(): void | Promise<void> {}
}

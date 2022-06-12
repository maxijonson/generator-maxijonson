import Generator from "yeoman-generator";
import bind from "../../decorators/bind";

export default abstract class Prompt<T = any> {
    constructor(protected id: string) {}

    @bind
    public getId(): string {
        return this.id;
    }

    public abstract prompt(generator: Generator): Promise<T>;
}

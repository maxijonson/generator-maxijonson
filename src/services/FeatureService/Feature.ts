import Generator from "yeoman-generator";
import bind from "../../decorators/bind";

export type GetFeature = <T extends Feature>(
    featureClass: new (...args: any[]) => T
) => T | null;

export default abstract class Feature {
    constructor(
        protected id: string,
        protected name: string,
        protected enabled = false,
        protected available = true,
        protected hidden = false
    ) {}

    @bind
    public getId(): string {
        return this.id;
    }

    @bind
    public getName(): string {
        return this.name;
    }

    @bind
    public isEnabled(): boolean {
        return this.available && this.enabled;
    }

    @bind
    public setEnabled(enabled: boolean): this {
        this.enabled = enabled;
        return this;
    }

    @bind
    public isHidden(): boolean {
        return this.hidden;
    }

    @bind
    public isAvailable(): boolean {
        return this.available;
    }

    public abstract apply(
        generator: Generator,
        getFeature: GetFeature
    ): void | Promise<void>;
}

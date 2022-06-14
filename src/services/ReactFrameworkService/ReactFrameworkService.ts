import _ from "lodash";
import Generator from "yeoman-generator";
import bind from "../../decorators/bind";
import GeneratorService from "../GeneratorService/GeneratorService";
import Framework from "./ReactFramework";

export default class ReactFrameworkService extends GeneratorService {
    private frameworks: {
        [frameworkId: string]: Framework;
    } = {};
    private framework: string | null = null;

    constructor(generator: Generator) {
        super(generator);
    }

    @bind
    public addFramework(framework: Framework, override = true) {
        if (this.frameworks[framework.getId()] && !override) return this;
        this.frameworks[framework.getId()] = framework;
        return this;
    }

    @bind
    public removeFramework(framework: Framework | string) {
        const frameworkId =
            typeof framework === "string" ? framework : framework.getId();
        delete this.frameworks[frameworkId];
        return this;
    }

    @bind
    public async setFramework(framework: Framework) {
        if (!this.frameworks[framework.getId()]) {
            this.addFramework(framework);
        }
        this.framework = framework.getId();
        await framework.initialize();
        return this;
    }

    @bind
    public getFrameworks(): Framework[] {
        return _.map(this.frameworks, (framework) => framework);
    }

    @bind
    public async prompting(): Promise<void> {
        if (!this.framework) return;
        await this.frameworks[this.framework]?.prompting();
    }

    @bind
    public async configuring(): Promise<void> {
        if (!this.framework) return;
        await this.frameworks[this.framework]?.configuring();
    }

    @bind
    public async writing(): Promise<void> {
        if (!this.framework) return;
        await this.frameworks[this.framework]?.writing();
    }

    @bind
    public async conflicts(): Promise<void> {
        if (!this.framework) return;
        await this.frameworks[this.framework]?.conflicts();
    }

    @bind
    public async install(): Promise<void> {
        if (!this.framework) return;
        await this.frameworks[this.framework]?.install();
    }

    @bind
    public async end(): Promise<void> {
        if (!this.framework) return;
        await this.frameworks[this.framework]?.end();
    }
}

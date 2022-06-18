import Generator from "yeoman-generator";
import bind from "../../decorators/bind";

export default abstract class GeneratorService {
    constructor(protected generator: Generator) {}

    @bind
    setGenerator(generator: Generator, sourceRoot?: string) {
        this.generator = generator;
        if (sourceRoot) {
            this.generator.sourceRoot(sourceRoot);
        }
        return this;
    }

    public abstract extend(generatorService: GeneratorService): this;
}

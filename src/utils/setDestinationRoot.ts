import Generator from "yeoman-generator";

export default (generator: Generator) => {
    if (generator.options.name !== ".") {
        generator.destinationRoot(generator.appname);
    }
};

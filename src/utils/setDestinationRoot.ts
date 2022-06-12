import Generator from "yeoman-generator";

export default (generator: Generator) => {
    console.info("app name", generator.options.name);
    if (generator.options.name !== ".") {
        generator.destinationRoot(generator.appname);
    }
};

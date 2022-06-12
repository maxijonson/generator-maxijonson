import Generator from "yeoman-generator";

export type CopyTpl = Generator["fs"]["copyTpl"];

/** Same as the standard copyTpl method, but only if the file does not already exist and is not skipped */
export default (
    generator: Generator,
    from: Parameters<CopyTpl>[0],
    to: Parameters<CopyTpl>[1],
    context?: Parameters<CopyTpl>[2],
    templateOptions?: Parameters<CopyTpl>[3],
    copyOptions?: Parameters<CopyTpl>[4]
) => {
    if (generator.fs.exists(to)) return;
    generator.fs.copyTpl(from, to, context, templateOptions, copyOptions);
};

import fs from "fs-extra";
import path from "path";

const SRC = path.resolve(__dirname, "../src");
const SRC_GENERATORS = path.join(SRC, "generators");

const OUT = path.resolve(__dirname, "../dist");
const OUT_GENERATORS = path.join(OUT, "generators");

fs.readdirSync(SRC_GENERATORS).forEach((generatorDir) => {
    const isDir = fs
        .lstatSync(path.join(SRC_GENERATORS, generatorDir))
        .isDirectory();
    if (!isDir) return;

    const srcTplDir = path.join(SRC_GENERATORS, generatorDir, "templates");
    const hasTplDir =
        fs.existsSync(srcTplDir) && fs.lstatSync(srcTplDir).isDirectory();
    if (!hasTplDir) return;

    const outTplDir = path.join(OUT_GENERATORS, generatorDir, "templates");
    fs.copySync(srcTplDir, outTplDir);
});

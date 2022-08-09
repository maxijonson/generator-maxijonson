import path from "path";
import { fileURLToPath } from "url";

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const DIR_SRC = path.join(__dirname, "..");
export const DIR_TMP = path.join(DIR_SRC, "tmp");

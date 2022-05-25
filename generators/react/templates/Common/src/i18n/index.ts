import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";

i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .use(
        resourcesToBackend(async (lng, ns, cb) => {
            try {
                const resx = await import(`./locales/${lng}/${ns}.json`);
                cb(null, resx);
            } catch (error: any) {
                cb(error, null);
            }
        })
    )
    .init({
        debug: process.env.NODE_ENV === "development",
        fallbackLng: "en",
        supportedLngs: ["en", "fr"],
        nonExplicitSupportedLngs: false,
        interpolation: {
            escapeValue: false,
        },
    });


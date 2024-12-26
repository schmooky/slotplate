import i18next, { i18n } from "i18next";
import locales from "./locales/multiLocales.json";

const i18nNetwork: i18n = i18next.createInstance();

type Translations = Record<string, string>;
type Locale = Record<string, Translations>;

// Конвертация под формат i18next
function convertLocales(locale: object) {
  const resources: Locale = {};
  Object.entries(locale).forEach((langPack) => {
    resources[langPack[0]] = {
      translation: langPack[1],
    };
  });
  return resources;
}

i18nNetwork.init({
  resources: convertLocales(locales),
});

export default i18nNetwork;

import i18n from 'i18next';
import {
    initReactI18next
} from 'react-i18next';
import detector from 'i18next-browser-languagedetector';


i18n
    .use(detector)
    .use(initReactI18next)
    .init({
        // we init with resources
        resources: {
            ru: {
                translations: {
                    // 'NameProject' : 'Наименование проекта',
                }
            }
        },
        // lng: localStorage.lng,
        debug: true,

        // have a common namespace used around the full app
        ns: ['translations'],
        defaultNS: 'translations',

        keySeparator: false, // we use content as keys

        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
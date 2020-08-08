import { get } from 'lodash'
import { LOCALE } from 'shared/store/keys'
import browser from 'webextension-polyfill'
import workflows from 'workflows'
import en from './locales/en.json5'
import zhCN from './locales/zh-CN.json5'

const supportedLocales = ['en', 'zh-cn']

const i18n = {
  locale: supportedLocales[0],
  messages: { en, 'zh-cn': zhCN },
  async init(store) {
    const localeFromBrowser = browser.i18n.getUILanguage().toLowerCase()
    if (supportedLocales.find(locale => locale.startsWith(localeFromBrowser))) {
      this.locale = localeFromBrowser
    }

    const localeFromStore = workflows.getLocale()
    this.locale = localeFromStore ?? this.locale

    await store.set({ [LOCALE]: this.locale }, true)

    store.subscribe(LOCALE, locale => {
      this.locale = locale.toLowerCase()
    })
  },
  getMessage(path, msg = {}) {
    return get(this.messages[this.locale], path, '')
      .replace(/{([^}]+?)}/, (_, p1) => get(msg, p1, ''))
  },
}

export default i18n
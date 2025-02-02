import alarm from 'alarm'
import i18n from 'i18n'
import * as requests from 'requests'
import store from 'store'
import { getUnix } from 'utils'
import browser from 'webextension-polyfill'
import workflows from 'workflows'

const ALARM_NAME = 'fetch-data-alarm'

const {
  syncChannels,
  syncCurrentLives,
  syncScheduledLives,
  syncMembers,
  setIsPopupFirstRun,
  clearCachedEndedLives,
} = workflows

const handleAlarm = async ({ name }) => {
  if (name === ALARM_NAME) {
    await syncCurrentLives()
      .then(() => syncScheduledLives())
      .catch(err => console.error(err))
  }
}

const initOnce = async () => {
  window.workflows = workflows
  window.store = store
  window.alarm = alarm

  await store.init()
  await alarm.init(store)
  await i18n.init(store)

  await setIsPopupFirstRun(true)

  let lastSuccessRequestTime = 0
  requests.onSuccessRequest.addEventListener(() => {
    const timestamp = getUnix()
    if (timestamp - lastSuccessRequestTime > 60 * 5) {
      clearCachedEndedLives()
    }
    lastSuccessRequestTime = timestamp
  })

  browser.alarms.onAlarm.addListener(handleAlarm)
  browser.alarms.create(ALARM_NAME, { periodInMinutes: 1 })
}

const initRetryable = () => Promise.all([syncCurrentLives(), syncChannels(), syncMembers()])

const init = async () => {
  await initOnce()
  await initRetryable().catch(() => {
    console.log('Retrying...')
    return initRetryable()
  })
}

init().then(() => console.log('[background]Init OK')).catch(err => {
  console.error(err)
  window.bgInitError = err
})

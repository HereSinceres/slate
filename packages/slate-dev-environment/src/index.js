import isBrowser from 'is-in-browser'

/**
 * Browser matching rules.
 *
 * @type {Array}
 */

const BROWSER_RULES = [
  ['edge', /Edge\/([0-9\._]+)/],
  ['chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
  ['firefox', /Firefox\/([0-9\.]+)(?:\s|$)/],
  ['opera', /Opera\/([0-9\.]+)(?:\s|$)/],
  ['opera', /OPR\/([0-9\.]+)(:?\s|$)$/],
  ['ie', /Trident\/7\.0.*rv\:([0-9\.]+)\).*Gecko$/],
  ['ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
  ['ie', /MSIE\s(7\.0)/],
  ['android', /Android\s([0-9\.]+)/],
  ['safari', /Version\/([0-9\._]+).*Safari/],
]

let browser

if (isBrowser) {
  for (const [name, regexp] of BROWSER_RULES) {
    if (regexp.test(window.navigator.userAgent)) {
      browser = name
      break
    }
  }
}

/**
 * Operating system matching rules.
 *
 * @type {Array}
 */

const OS_RULES = [
  ['ios', /os ([\.\_\d]+) like mac os/i], // must be before the macos rule
  ['macos', /mac os x/i],
  ['android', /android/i],
  ['firefoxos', /mozilla\/[a-z\.\_\d]+ \((?:mobile)|(?:tablet)/i],
  ['windows', /windows\s*(?:nt)?\s*([\.\_\d]+)/i],
]

let os

if (isBrowser) {
  for (const [name, regexp] of OS_RULES) {
    if (regexp.test(window.navigator.userAgent)) {
      os = name
      break
    }
  }
}

/**
 * Feature matching rules.
 *
 * @type {Array}
 */

const FEATURE_RULES = [
  [
    'inputeventslevel1',
    window => {
      const event = window.InputEvent ? new window.InputEvent('input') : {}
      const support = 'inputType' in event
      return support
    },
  ],
  [
    'inputeventslevel2',
    window => {
      const element = window.document.createElement('div')
      element.contentEditable = true
      const support = 'onbeforeinput' in element
      return support
    },
  ],
]

const features = []

if (isBrowser) {
  for (const [name, test] of FEATURE_RULES) {
    if (test(window)) {
      features.push(name)
    }
  }
}

/**
 * Array of regular expression matchers and their API version
 *
 * @type {Array}
 */

const ANDROID_API_VERSIONS = [
  [/^9([.]0|)/, 28],
  [/^8[.]1/, 27],
  [/^8([.]0|)/, 26],
  [/^7[.]1/, 25],
  [/^7([.]0|)/, 24],
  [/^6([.]0|)/, 23],
  [/^5[.]1/, 22],
  [/^5([.]0|)/, 21],
  [/^4[.]4/, 20],
]

/**
 * get the Android API version from the userAgent
 *
 * @return {number} version
 */

function getAndroidApiVersion() {
  if (os !== 'android') return null
  const { userAgent } = window.navigator
  const matchData = userAgent.match(/Android\s([0-9\.]+)/)
  if (matchData == null) return null
  const versionString = matchData[1]

  for (const [regex, version] of ANDROID_API_VERSIONS) {
    if (versionString.match(regex)) return version
  }
  return null
}

/**
 * Export.
 *
 * @type {Boolean}
 */

export const IS_CHROME = browser === 'chrome'
export const IS_OPERA = browser === 'opera'
export const IS_FIREFOX = browser === 'firefox'
export const IS_SAFARI = browser === 'safari'
export const IS_IE = browser === 'ie'
export const IS_EDGE = browser === 'edge'

export const IS_ANDROID = os === 'android'
export const IS_IOS = os === 'ios'
export const IS_MAC = os === 'macos'
export const IS_WINDOWS = os === 'windows'

export const ANDROID_API_VERSION = getAndroidApiVersion()

export const HAS_INPUT_EVENTS_LEVEL_1 = features.includes('inputeventslevel1')
export const HAS_INPUT_EVENTS_LEVEL_2 =
  features.includes('inputeventslevel2') ||
  (IS_ANDROID && (ANDROID_API_VERSION === 28 || ANDROID_API_VERSION === null))

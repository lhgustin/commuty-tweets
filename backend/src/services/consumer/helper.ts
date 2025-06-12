import type { PubNubMessage, SearchCriteria, TweetQueryDTO, TweetStat } from '../../../../common/index.ts'

const MILLIS_IN_SECOND = 1000
const SECONDS_IN_MINUTE = 60

export const updAvgMinuteRate = (
    currentTimestamp: number,
    lastTimestamp: number,
    lastRate: number,
    occurence: number = 1
) => {
    // FIXME Fin a better math approximation: 
    // build incremental (like infinite series) avg on last 60 seconds
    const diffSeconds = (currentTimestamp - lastTimestamp) / MILLIS_IN_SECOND
    // If timestamps are the same or diffSeconds is too small, return the last rate
    if (diffSeconds <= 0) {
        return lastRate
    }
    const newRate = occurence / (diffSeconds / SECONDS_IN_MINUTE)
    if (diffSeconds > SECONDS_IN_MINUTE) {
        lastRate = 0
    }
    // Smoothing with previous rate
    return (lastRate * (60 - diffSeconds) + newRate * diffSeconds) / 60
}

// precondition: searchCriteria is valid
export const isMatchingCriteria = (message: PubNubMessage, searchCriteria: SearchCriteria) => {
    const hasText =
        searchCriteria.text === undefined || message.text.toLowerCase().includes(searchCriteria.text.toLowerCase())
    const hasUserName =
        searchCriteria.userScreenName === undefined || message.user.screen_name === searchCriteria.userScreenName
    const hasLanguage = searchCriteria.language === undefined || message.lang === searchCriteria.language
    const hasVerifiedOnly = !searchCriteria.verifiedOnly || message.user.verified 

    // FIXME remove debug
    const explanation = []
    if (hasText && searchCriteria.text) {
        explanation.push(`hasText: ${message.text} == ${searchCriteria.text}`)
    }
    if (hasUserName && searchCriteria.userScreenName) {
        explanation.push(`hasUserName: ${message.user.screen_name} == ${searchCriteria.userScreenName}`)
    }
    if (hasLanguage && searchCriteria.language) {
        explanation.push(`hasLanguage: ${message.lang} == ${searchCriteria.language}`)
    }
    explanation.length > 0 && console.info('> match()', explanation.join('; '))

    return searchCriteria.logicalOperator === 'AND'
        ? (hasText && hasUserName && hasLanguage) && hasVerifiedOnly 
        : (hasText || hasUserName  || hasLanguage) && hasVerifiedOnly
}

export const statSorter = (
    a: Pick<TweetStat, 'lang' | 'oneMinuteRate'>,
    b: Pick<TweetStat, 'lang' | 'oneMinuteRate'>
) => b.oneMinuteRate - a.oneMinuteRate

export const byCreatedAsc = (a: TweetQueryDTO, b: TweetQueryDTO) =>
    Date.parse(a.creationTime) - Date.parse(b.creationTime)

export const byCreatedDesc = (a: TweetQueryDTO, b: TweetQueryDTO) =>
    Date.parse(b.creationTime) - Date.parse(a.creationTime)

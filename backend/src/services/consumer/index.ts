import {
    type PubNubMessage,
    type SearchCriteria,
    type SearchQueryDTOOut,
    type TweetStat,
    type TweetStatDTOOut,
    tweetMessage2query
} from '../../../../common/index.ts'

import {
    updAvgMinuteRate,
    isMatchingCriteria,
    statSorter,
    byCreatedAsc,
    byCreatedDesc,
} from './helper.ts'

const INITIAL_RATE = 1.0

export class ConsumerState {
    private initialTimestamp: number|null = null
    private stats: Record<string, TweetStat> = {}
    // FIXME infer new type with the DEFAULT valuen set
    private searchCriteria: Record<string, SearchCriteria & {verifiedOnly: boolean}> = {}
    private searchResults: Record<string, SearchQueryDTOOut['tweets']> = {}
    static instance: ConsumerState

    private constructor() {}

    static getSingleton() {
        if (!ConsumerState.instance) {
            ConsumerState.instance = new ConsumerState()
        }
        return ConsumerState.instance
    }

    private updateStats = (message: PubNubMessage) => {
        const { lang, timestamp_ms } = message
        const currentTimestamp = Number(timestamp_ms)
        const stat = this.stats[lang]
        let oneMinuteRate = 0
        if (!stat) {
            if(this.initialTimestamp) {
                oneMinuteRate = updAvgMinuteRate(currentTimestamp, this.initialTimestamp, 0)
            } else {
                oneMinuteRate = INITIAL_RATE
                this.initialTimestamp = currentTimestamp
            }
            if(oneMinuteRate === 0) {
                return
            }
            this.stats[lang] = {
                lang,
                oneMinuteRate,
                lastTimestamp: currentTimestamp,
            }
        } else {
            oneMinuteRate = updAvgMinuteRate(currentTimestamp, stat.lastTimestamp, stat.oneMinuteRate)
            if(oneMinuteRate === 0) {
                delete this.stats[lang]
                return
            }
            stat.oneMinuteRate = oneMinuteRate
            stat.lastTimestamp = currentTimestamp
        }
        // Update all other stats with the delta
        // and remove the one without activity in the last 60 seconds
        Object.entries(this.stats).forEach(([statLang, stat]) => {
            if (statLang !== lang) {
                stat.oneMinuteRate = updAvgMinuteRate(currentTimestamp, stat.lastTimestamp, stat.oneMinuteRate, 0)
                if (stat.oneMinuteRate === 0) {
                    delete this.stats[statLang]
                } else {
                    stat.lastTimestamp = currentTimestamp
                }
            }
        })
    }

    private updateSearchCriteria = (message: PubNubMessage) => {
        Object.entries(this.searchCriteria).forEach(([uuid, criteria]) => {
            if (isMatchingCriteria(message, criteria)) {
                const tweetQuery = tweetMessage2query(message)
                if (uuid in this.searchResults) {
                    this.searchResults[uuid].push(tweetQuery)
                } else {
                    this.searchResults[uuid] = [tweetQuery]
                }
                // FIXME remove debug
                console.info('isMatchingCriteria() : ', uuid, this.searchResults[uuid].length)
            } 
        })
    }

    consumeMessage(message: PubNubMessage) {
        this.updateStats(message)
        this.updateSearchCriteria(message)
    }

    getStatistics = (): TweetStatDTOOut =>
        Object.values(this.stats)
            .map((s) => ({
                lang: s.lang,
                oneMinuteRate: Number(s.oneMinuteRate.toFixed(2)),
            }))
            .sort(statSorter)

    addSearchCriteria = (uuid: string, criteria: SearchCriteria) => {
        if (uuid in this.searchCriteria) {
            throw new Error(`Search criteria with uuid ${uuid} already exists`)
        }
        this.searchCriteria[uuid] = {
            ...criteria,
            verifiedOnly: criteria.verifiedOnly ?? false,
        }
    }

    getSearchResults = (uuid: string, limit: number = 10, direction: string = 'DESC'): SearchQueryDTOOut | null => {
        if(!(uuid in this.searchCriteria)) {
            return null;
        }
        const tweets = (this.searchResults?.[uuid] ?? []);
        const sortedTweets = direction === 'ASC' ? tweets.sort(byCreatedAsc) : tweets.sort(byCreatedDesc)

        return {
            searchCriteria: uuid,
            tweets: sortedTweets.slice(0, limit),
            totalCount: sortedTweets.length,
        }
    }

    deleteSearchCriteria = (uuid: string) => {
        if (!(uuid in this.searchCriteria)) {
           return false
        }
        delete this.searchCriteria[uuid]
        delete this.searchResults[uuid]
        return true
    }

    getAllSearchCriteria = () => {
        return Object.entries(this.searchCriteria).map(([uuid, criteria]) => ({
            ...criteria,
            uuid
        }))
    }
}

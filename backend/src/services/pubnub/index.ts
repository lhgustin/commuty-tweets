import PubNub from 'pubnub'
import { PubNubMessageSchema, type PubNubMessage } from '../../../../common/index.ts'
import { ConsumerState } from '../consumer/index.ts'

// https://www.pubnub.com/demos/real-time-data-streaming/?show=demo
export const pubnubTwitter = new PubNub({
    uuid: 'MyIdentifier',
    subscribeKey: 'sub-c-d00e0d32-66ac-4628-aa65-a42a1f0c493b',
})

const listener: PubNub.Listener = {
    message: (payload: PubNub.SubscriptionObject.Message) => {
        const message = payload.message as PubNubMessage
        const result = PubNubMessageSchema.safeParse(message)
        if (!result.success) {
            console.error('PubNub message validation failed:', result.error)
            // unsubscribe();
            // FIX the schema
        } else {
            ConsumerState.getSingleton().consumeMessage(message)
        }
    },
}

pubnubTwitter.subscribe({
    channels: ['pubnub-twitter'],
})
const unsubscribe = () =>
    pubnubTwitter.unsubscribe({
        channels: ['pubnub-twitter'],
    })

export const startFeed = () => {
    pubnubTwitter.addListener(listener)
    return () => pubnubTwitter.removeListener(listener)
}

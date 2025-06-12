import { z } from "zod";
import { PubNubMessageSchema } from "./PubNubMessage.ts";

export const PubNubEventSchema = z.object({
  channel: z.string(), // pubnub-twitter
  actualChannel: z.string().nullable(), // pubnub-twitter
  subscribedChannel: z.string(), // pubnub-twitter
  timetoken: z.string(), // 17178529513110000
  publisher: z.string(), // pubnub-twitter
  message: PubNubMessageSchema,
});

export type PubNubEvent = z.infer<typeof PubNubEventSchema>;

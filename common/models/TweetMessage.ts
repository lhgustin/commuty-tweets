/**
 * Source: Twitter
    Text: Fazia tanto tempo que não tinha crise de ansiedade e de uma semana pra cá n tô tendo mais controle
    Posted from: Twitter for iPhone
    Tweeted from location: Brasil
    User name: beatrizdsrb
    User profile location: null
    User follower count: 580
    Timestamp: Sun Jun 08 2025 14:25:51 GMT+0200 (heure d'été d'Europe centrale)
 */

import { z } from "zod";
import type { PubNubMessage } from "./PubNubMessage.ts";
import { PubNubMessageSchema } from "./PubNubMessage.ts";

// Original TypeScript type definition from assignement
/*
export type TweetQueryDTO = {
  authorNickname: string; // message.user.screen_name
  authorName: string; // message.user.name
  creationTime: string; // message.created_at
  country: string | null; // message.place.country
  language: string; // message.lang
  verified: boolean; // message.user.verified
  followersCount: number; // message.user.followers_count
};
*/

export const TweetQueryDTOSchema = z.object({
  authorNickname: PubNubMessageSchema.shape.user.shape.screen_name,
  authorName: PubNubMessageSchema.shape.user.shape.name,
  creationTime: PubNubMessageSchema.shape.created_at,
  country: PubNubMessageSchema.shape.place.unwrap().shape.country,
  language: PubNubMessageSchema.shape.lang,
  verified: PubNubMessageSchema.shape.user.shape.verified,
  followersCount: PubNubMessageSchema.shape.user.shape.followers_count,
});

export type TweetQueryDTO = z.infer<typeof TweetQueryDTOSchema>;

// Original TypeScript type definition from demo
/*
export type TweetMessageUI = TweetQueryDTO & {
  text: string; // message.text
  fromDevice: string; // message.source
  userLocation: string | null; // message.user.location
  timestamp: number; // message.timestamp_ms
};
*/
export const TweetMessageUISchema = TweetQueryDTOSchema.extend({
  text: PubNubMessageSchema.shape.text,
  fromDevice: PubNubMessageSchema.shape.source,
  userLocation: PubNubMessageSchema.shape.user.shape.location,
  timestamp: PubNubMessageSchema.shape.timestamp_ms, // string
});
export type TweetMessageUI = z.infer<typeof TweetMessageUISchema>;

export const tweetMessage2query = (msgDto: PubNubMessage): TweetQueryDTO => ({
  authorNickname: msgDto.user.screen_name,
  authorName: msgDto.user.name,
  creationTime: msgDto.created_at,
  country: msgDto.place?.country ?? null,
  language: msgDto.lang,
  verified: msgDto.user.verified ?? false,
  followersCount: msgDto.user.followers_count ?? 0,
});

export const tweetMessage2ui = (msgDto: PubNubMessage): TweetMessageUI => ({
  ...tweetMessage2query(msgDto),
  text: msgDto.text,
  fromDevice: msgDto.source,
  userLocation: msgDto.user.location ?? null,
  timestamp: msgDto.timestamp_ms,
});

import { z } from "zod";

const UserSchema = z.object({
  id: z.number(),
  id_str: z.string(),
  name: z.string(),
  screen_name: z.string(),
  location: z.string().nullable(),
  url: z.string().nullable(),
  description: z.string().nullable(),
  translator_type: z.string(),
  protected: z.boolean(),
  verified: z.boolean(),
  verified_type: z.string().optional(),
  followers_count: z.number(),
  friends_count: z.number(),
  listed_count: z.number(),
  favourites_count: z.number(),
  statuses_count: z.number(),
  created_at: z.string(),
  utc_offset: z.string().nullable(),
  time_zone: z.string().nullable(),
  geo_enabled: z.boolean(),
  lang: z.string().nullable(),
  contributors_enabled: z.boolean(),
  is_translator: z.boolean(),
  profile_background_color: z.string(),
  profile_background_image_url: z.string(),
  profile_background_image_url_https: z.string(),
  profile_background_tile: z.boolean(),
  profile_link_color: z.string(),
  profile_sidebar_border_color: z.string(),
  profile_sidebar_fill_color: z.string(),
  profile_text_color: z.string(),
  profile_use_background_image: z.boolean(),
  profile_image_url: z.string(),
  profile_image_url_https: z.string(),
  profile_banner_url: z.string().optional(),
  default_profile: z.boolean(),
  default_profile_image: z.boolean(),
  following: z.boolean().nullable(),
  follow_request_sent: z.boolean().nullable(),
  notifications: z.boolean().nullable(),
  withheld_in_countries: z.array(z.string()),
});

const GeoCoordinatesSchema = z.object({
  type: z.string(),
  coordinates: z.tuple([z.number(), z.number()]),
});

const PlaceSchema = z.object({
  id: z.string(),
  url: z.string(),
  place_type: z.string(),
  name: z.string(),
  full_name: z.string(),
  country_code: z.string(),
  country: z.string().nullable(),
  bounding_box: z.object({
    type: z.string(),
    coordinates: z.array(z.array(z.array(z.number()))),
  }),
  attributes: z.record(z.unknown()),
});

const ContributorSchema = z.object({
  id: z.number(),
  id_str: z.string(),
  screen_name: z.string(),
});

const EntitiesSchema = z.object({
  hashtags: z.array(
    z.object({
      text: z.string(),
      indices: z.tuple([z.number(), z.number()]),
    }),
  ),
  urls: z.array(
    z.object({
      url: z.string(),
      expanded_url: z.string(),
      display_url: z.string(),
      indices: z.tuple([z.number(), z.number()]),
    }),
  ),
  user_mentions: z.array(
    z.object({
      screen_name: z.string(),
      name: z.string(),
      id: z.number(),
      id_str: z.string(),
      indices: z.tuple([z.number(), z.number()]),
    }),
  ),
  symbols: z.array(
    z.object({
      text: z.string(),
      indices: z.tuple([z.number(), z.number()]),
    }),
  ),
});

export const PubNubMessageSchema = z.object({
  created_at: z.string(),
  id: z.number(),
  id_str: z.string(),
  text: z.string(),
  display_text_range: z.tuple([z.number(), z.number()]).optional(),
  source: z.string(),
  truncated: z.boolean(),
  in_reply_to_status_id: z.number().nullable(),
  in_reply_to_status_id_str: z.string().nullable(),
  in_reply_to_user_id: z.number().nullable(),
  in_reply_to_user_id_str: z.string().nullable(),
  in_reply_to_screen_name: z.string().nullable(),
  user: UserSchema,
  geo: GeoCoordinatesSchema.nullable(),
  coordinates: GeoCoordinatesSchema.nullable(),
  place: PlaceSchema.nullable(),
  contributors: z.array(ContributorSchema).nullable(),
  is_quote_status: z.boolean(),
  quote_count: z.number(),
  reply_count: z.number(),
  retweet_count: z.number(),
  favorite_count: z.number(),
  entities: EntitiesSchema,
  favorited: z.boolean(),
  retweeted: z.boolean(),
  filter_level: z.string(),
  lang: z.string(),
  timestamp_ms: z.string(),
});

export type PubNubMessage = z.infer<typeof PubNubMessageSchema>;

// Original TypeScript type definition from Demo
/*
export type PubNubMessage = {
  created_at: string;
  id: number;
  id_str: string;
  text: string;
  display_text_range?: [number, number];
  source: string;
  truncated: boolean;
  in_reply_to_status_id?: number;
  in_reply_to_status_id_str?: string;
  in_reply_to_user_id?: number;
  in_reply_to_user_id_str?: string;
  in_reply_to_screen_name?: string;
  user: {
    id: number;
    id_str: string;
    name: string;
    screen_name: string;
    location: string | null;
    url: string | null;
    description: string | null;
    translator_type: string;
    protected: boolean;
    verified: boolean;
    verified_type?: string;
    followers_count: number;
    friends_count: number;
    listed_count: number;
    favourites_count: number;
    statuses_count: number;
    created_at: string;
    utc_offset: string | null;
    time_zone: string | null;
    geo_enabled: boolean;
    lang: string | null;
    contributors_enabled: boolean;
    is_translator: boolean;
    profile_background_color: string;
    profile_background_image_url: string;
    profile_background_image_url_https: string;
    profile_background_tile: boolean;
    profile_link_color: string;
    profile_sidebar_border_color: string;
    profile_sidebar_fill_color: string;
    profile_text_color: string;
    profile_use_background_image: boolean;
    profile_image_url: string;
    profile_image_url_https: string;
    profile_banner_url?: string;
    default_profile: boolean;
    default_profile_image: boolean;
    following: boolean | null;
    follow_request_sent: boolean | null;
    notifications: boolean | null;
    withheld_in_countries: string[];
  };
  geo: null | {
    type: string;
    coordinates: [number, number];
  };
  coordinates: null | {
    type: string;
    coordinates: [number, number];
  };
  place: null | {
    id: string;
    url: string;
    place_type: string;
    name: string;
    full_name: string;
    country_code: string;
    country: string;
    bounding_box: {
      type: string;
      coordinates: number[][][];
    };
    attributes: Record<string, unknown>;
  };
  contributors: null | Array<{
    id: number;
    id_str: string;
    screen_name: string;
  }>;
  is_quote_status: boolean;
  quote_count: number;
  reply_count: number;
  retweet_count: number;
  favorite_count: number;
  entities: {
    hashtags: Array<{
      text: string;
      indices: [number, number];
    }>;
    urls: Array<{
      url: string;
      expanded_url: string;
      display_url: string;
      indices: [number, number];
    }>;
    user_mentions: Array<{
      screen_name: string;
      name: string;
      id: number;
      id_str: string;
      indices: [number, number];
    }>;
    symbols: Array<{
      text: string;
      indices: [number, number];
    }>;
  };
  favorited: boolean;
  retweeted: boolean;
  filter_level: string;
  lang: string;
  timestamp_ms: string;
};
*/

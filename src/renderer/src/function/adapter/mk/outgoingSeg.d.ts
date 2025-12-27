import { OutgoingSegment } from '@saltify/milky-types'
import { z } from 'zod'

type Seg = z.input<typeof OutgoingSegment>

// 具体的接收消息段类型
export type TextSeg = Extract<Seg, { type: 'text' }>;
export type MentionSeg = Extract<Seg, { type: 'mention' }>;
export type MentionAllSeg = Extract<Seg, { type: 'mention_all' }>;
export type FaceSeg = Extract<Seg, { type: 'face' }>;
export type ReplySeg = Extract<Seg, { type: 'reply' }>;
export type ImageSeg = Extract<Seg, { type: 'image' }>;
export type RecordSeg = Extract<Seg, { type: 'record' }>;
export type VideoSeg = Extract<Seg, { type: 'video' }>;
export type ForwardSeg = Extract<Seg, { type: 'forward' }>;
export type MarketFaceSeg = Extract<Seg, { type: 'market_face' }>;
export type LightAppSeg = Extract<Seg, { type: 'light_app' }>;
export type XmlSeg = Extract<Seg, { type: 'xml' }>;

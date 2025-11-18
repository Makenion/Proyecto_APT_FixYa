import { z } from "zod"
import {
  requestImageTypeSchema,
  requestStatusTypeSchema
}            from "@/models/sales/response"

export const registerReviewSchema = z.object( {
  rating           : z.int(),
  title            : z.string(),
  description      : z.string(),
  worker_id        : z.string(),
  request_worker_id: z.string()
} )

export type RegisterReviewPayload = z.infer<typeof registerReviewSchema>

export const requestImagePayloadSchema = z.object( {
  url : z.string(),
  type: requestImageTypeSchema
} )

export type RequestImagePayload = z.infer<typeof requestImagePayloadSchema>

export const requestNotePayloadSchema = z.object( {
  url : z.string(),
  text: z.string()
} )

export type RequestNotePayload = z.infer<typeof requestNotePayloadSchema>

export const registerRequestSchema = z.object( {
  is_public    : z.boolean(),
  title        : z.string(),
  description  : z.string(),
  speciality_id: z.string(),
  value        : z.number(),
  ends_at      : z.iso.datetime(),
  status       : requestStatusTypeSchema,
  location     : z.string(),
  location_text: z.string(),
  images       : z.array( requestImagePayloadSchema ),
  notes        : z.array( requestNotePayloadSchema )
} )

export type RegisterRequestPayload = z.infer<typeof registerRequestSchema>

export const updateRequestSchema = z.object( {
  is_public  : z.boolean().nullish(),
  title      : z.string().nullish(),
  description: z.string().nullish(),
  value      : z.number().nullish(),
  ends_at    : z.iso.datetime().nullish(),
  status     : requestStatusTypeSchema.nullish(),
  images     : z.array( requestImagePayloadSchema ).nullish(),
  notes      : z.array( requestNotePayloadSchema ).nullish()
} )

export type UpdateRequestPayload = z.infer<typeof updateRequestSchema>

export const registerRequestWorkerSchema = z.object( {
  date_start   : z.iso.datetime(),
  date_finish  : z.iso.datetime(),
  status_worker: requestStatusTypeSchema,
  request_id   : z.string()
} )

export type RegisterRequestWorkerPayload = z.infer<typeof registerRequestWorkerSchema>

export const updateRequestWorkerSchema = z.object( {
  date_start    : z.iso.datetime().nullish(),
  date_finish   : z.iso.datetime().nullish(),
  date_accepted : z.iso.datetime().nullish(),
  date_completed: z.iso.datetime().nullish(),
  status_worker : requestStatusTypeSchema.nullish(),
  status_client : requestStatusTypeSchema.nullish()
} )

export type UpdateRequestWorkerPayload = z.infer<typeof updateRequestWorkerSchema>
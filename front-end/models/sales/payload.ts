import {
  requestImageTypeSchema,
  RequestStatusTypeEnum,
  requestStatusTypeSchema
} from "@/models/sales/response"
import { z } from "zod"

export const registerReviewSchema = z.object( {
  rating           : z.int(),
  title            : z.string(),
  description      : z.string(),
  worker_id        : z.string(),
  request_worker_id: z.string()
} )

export type RegisterReviewPayload = z.infer<typeof registerReviewSchema>

export const requestImagePayloadSchema = z.object( {
  name: z.string()
  .refine((val) => 
      val.toLowerCase().endsWith('.jpg') ||
      val.toLowerCase().endsWith('.jpeg') ||
      val.toLowerCase().endsWith('.png') ||
      val.toLowerCase().endsWith('.gif') ||
      val.toLowerCase().endsWith('.webp'), {
      message: "El archivo debe ser una imagen (jpg, jpeg, png, gif, webp)"
    }),
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
  value        : z.number().default(0),
  ends_at      : z.iso.datetime(),
  status       : requestStatusTypeSchema.default(RequestStatusTypeEnum.Pending),
  location     : z.string().default(""),
  location_text: z.string(),
  images       : z.array( requestImagePayloadSchema ),
  notes        : z.array( requestNotePayloadSchema ).default([])
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

export const updateRequestWorkerSchema = z.object( {
  date_start    : z.iso.datetime().nullish(),
  date_finish   : z.iso.datetime().nullish(),
  date_accepted : z.iso.datetime().nullish(),
  date_completed: z.iso.datetime().nullish(),
  status_worker : requestStatusTypeSchema.nullish(),
  status_client : requestStatusTypeSchema.nullish()
} )

export type UpdateRequestWorkerPayload = z.infer<typeof updateRequestWorkerSchema>

export const updateValorRequest = z.object( {
  value_proposed         : z.coerce.number(),
  request_id      : z.coerce.number().default(0),
} )

export type UpdateValorRequest = z.infer<typeof updateValorRequest>

export const registerRequestWorkerPayload = z.object( {
  request_id: z.coerce.number().default(0),
  worker_id: z.coerce.number().default(0)
} )

export type RegisterRequestWorkerPayload = z.infer<typeof registerRequestWorkerPayload>
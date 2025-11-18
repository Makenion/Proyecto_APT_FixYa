import { z }                                    from "zod"
import { specialitySchema, workerDetailSchema } from "@/models/worker/response"
import { userSchema }                           from "@/models/user/response"

export enum RequestStatusTypeEnum {
  Progress  = "en curso",
  Pending   = "pendiente",
  Completed = "completo",
  Canceled  = "cancelado",
}

export const requestStatusTypeSchema = z.enum( RequestStatusTypeEnum )

export enum RequestImageTypeEnum {
  Client = "cliente",
  Worker = "trabajador",
}

export const requestImageTypeSchema = z.enum( RequestImageTypeEnum )

export const requestImageSchema = z.object( {
  id  : z.string(),
  url : z.string(),
  type: requestImageTypeSchema
} )

export type RequestImage = z.infer<typeof requestImageSchema>

export const requestNoteSchema = z.object( {
  id  : z.string(),
  url : z.string(),
  text: z.string()
} )

export type RequestNote = z.infer<typeof requestNoteSchema>

export const requestSchema = z.object( {
  id           : z.string(),
  is_public    : z.boolean(),
  title        : z.string(),
  description  : z.string(),
  speciality   : specialitySchema,
  value        : z.int(),
  created_at   : z.iso.datetime(),
  ends_at      : z.iso.datetime(),
  status       : requestStatusTypeSchema,
  location     : z.string(),
  location_text: z.string(),
  images       : z.array( requestImageSchema ),
  notes        : z.array( requestNoteSchema ),
  user         : userSchema
} )

export type Request = z.infer<typeof requestSchema>

export const requestWorkerSchema = z.object( {
  id            : z.string(),
  extra         : z.number().nullish(),
  date_start    : z.iso.datetime(),
  date_finish   : z.iso.datetime(),
  date_accepted : z.iso.datetime().nullish(),
  date_completed: z.iso.datetime().nullish(),
  status        : requestStatusTypeSchema,
  status_client : requestStatusTypeSchema,
  status_worker : requestStatusTypeSchema,
  request       : requestSchema,
  worker_detail : workerDetailSchema
} )

export type RequestWorker = z.infer<typeof requestWorkerSchema>

export const reviewSchema = z.object( {
  id            : z.string(),
  rating        : z.string(),
  title         : z.string(),
  description   : z.string(),
  created_at    : z.iso.datetime(),
  request_worker: requestWorkerSchema
} )

export type Review = z.infer<typeof reviewSchema>

export const paymentSchema = z.object( {
  id            : z.string(),
  status        : z.string(),
  method        : z.string(),
  total         : z.number(),
  extra         : z.number().nullish(),
  title         : z.string(),
  created_at    : z.iso.datetime(),
  request_worker: requestWorkerSchema
} )

export type Payment = z.infer<typeof paymentSchema>
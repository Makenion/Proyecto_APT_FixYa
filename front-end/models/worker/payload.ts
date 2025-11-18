import { z }                     from "zod"
import { certificateTypeSchema } from "@/models/worker/response"

export const certificatePayloadSchema = z.object( {
  name            : z.string(),
  url             : z.string(),
  certificate_type: certificateTypeSchema
} )

export type CertificatePayload = z.infer<typeof certificatePayloadSchema>


export const registerWorkerSchema = z.object( {
  specialities: z.array( z.string() ),
  certificates: z.array( certificatePayloadSchema )
} )

export type RegisterWorkerPayload = z.infer<typeof registerWorkerSchema>

export const updateWorkerDetailSchema = z.object( {
  description      : z.string().nullish(),
  availability_text: z.string().nullish(),
  specialities     : z.array( z.string() ).nullish(),
  certificates     : z.array( certificatePayloadSchema ).nullish()
} )

export type UpdateWorkerDetailPayload = z.infer<typeof updateWorkerDetailSchema>
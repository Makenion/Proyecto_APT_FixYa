import { z }          from "zod"
import { userSchema } from "@/models/user/response"

export enum CertificateTypeEnum {
  Identity = "identidad",
  Company  = "compañia",
  Other    = "otro",
}

export const certificateTypeSchema = z.enum( CertificateTypeEnum )

export const certificateSchema = z.object( {
  id              : z.string(),
  certificate_type: certificateTypeSchema,
  name            : z.string(),
  url             : z.string()
} )

export type Certificate = z.infer<typeof certificateSchema>

export const specialitySchema = z.object( {
  id         : z.string(),
  name       : z.string(),
  description: z.string()
} )

export type Speciality = z.infer<typeof specialitySchema>

export const workerPortfolioSchema = z.object( {
  id               : z.string(),
  url              : z.string(),
  request_worker_id: z.string()
} )

export type WorkerPortfolio = z.infer<typeof workerPortfolioSchema>

export const workerDetailSchema = z.object( {
  id               : z.string(),
  balance          : z.number(),
  works_count      : z.int(),
  review_count     : z.int(),
  review_avg       : z.number(),
  description      : z.string(),
  availability_text: z.string(),
  user             : userSchema,
  certificates     : z.array( certificateSchema ),
  portfolio        : z.array( workerPortfolioSchema ),
  specialities     : z.array( specialitySchema )
} )

export type WorkerDetail = z.infer<typeof workerDetailSchema>
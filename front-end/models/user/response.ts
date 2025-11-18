import { z }                      from "zod"
import { calleSchema }            from "@/models/location/response"

export enum UserTypeEnum {
  Admin  = "admin",
  Client = "cliente",
  Worker = "trabajador",
}

export const userTypeSchema = z.enum( UserTypeEnum )

export const userMetadataSchema = z.object( {
  id   : z.string(),
  type : z.string(),
  value: z.string()
} )

export type UserMetadata = z.infer<typeof userMetadataSchema>

export const userSchema = z.object( {
  id           : z.string(),
  is_active    : z.boolean(),
  full_name       : z.string(),
  email        : z.email(),
  created_at   : z.iso.datetime(),
  user_type    : userTypeSchema,
  calle        : calleSchema,
  metadatas    : z.array( userMetadataSchema ),
  bank_identity: z.string(),
  bank_number  : z.string().nullish(),
  date_birth   : z.iso.datetime().nullish(),
  phone        : z.string().nullish()
} )

export type User = z.infer<typeof userSchema>
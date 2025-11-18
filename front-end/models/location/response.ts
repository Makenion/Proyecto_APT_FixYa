import {z} from "zod"

export const regionSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export type Region = z.infer<typeof regionSchema>

export const comunaSchema = z.object({
  id: z.string(),
  name: z.string(),
  region: regionSchema
})

export type Comuna = z.infer<typeof comunaSchema>

export const calleSchema = z.object({
  id: z.string(),
  name: z.string(),
  comuna : comunaSchema
})

export type Calle = z.infer<typeof calleSchema>
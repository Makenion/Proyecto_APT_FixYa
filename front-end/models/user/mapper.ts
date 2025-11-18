import { User } from "@/models/user/response"

export const userFromJson = (json: any): User => {
  return {
    id           : json.id,
    is_active    : json.is_active,
    full_name    : json.full_name,
    email        : json.email,
    created_at   : json.created_at,
    user_type    : json.user_type.name,
    calle        : json.calle,
    metadatas    : json.metadatas,
    bank_identity: json.bank_identity,
    bank_number  : json.bank_number,
    date_birth   : json.date_birth,
    phone        : json.phone
  }
}
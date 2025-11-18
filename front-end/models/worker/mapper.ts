import { WorkerDetail } from "@/models/worker/response"
import { userFromJson } from "@/models/user/mapper"

export const workerFromJson = ( json: any ): WorkerDetail => {
  return {
    id               : json.id,
    balance          : json.balance,
    works_count      : json.works_count,
    review_count     : json.review_count,
    review_avg       : json.review_avg,
    description      : json.description,
    availability_text: json.availability_text,
    user             : userFromJson( json.user ),
    certificates     : json.certificates,
    portfolio        : json.portfolio,
    specialities     : json.specialities
  }
}
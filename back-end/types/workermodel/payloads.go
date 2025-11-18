package workermodel

type CertificatePayload struct {
	Name            string              `json:"name"`
	Url             string              `json:"url"`
	CertificateType CertificateTypeEnum `json:"certificate_type"`
}

type RegisterWorkerPayload struct {
	Specialities []string             `json:"specialities"`
	Certificates []CertificatePayload `json:"certificates"`
}

type UpdateWorkerDetailPayload struct {
	Description      *string              `json:"description"`
	AvailabilityText *string              `json:"availability_text"`
	Specialities     []string             `json:"specialities"`
	Certificates     []CertificatePayload `json:"certificates"`
}

type UpdateWorkerDetail struct {
	Description      *string `json:"description"`
	AvailabilityText *string `json:"availability_text"`
}

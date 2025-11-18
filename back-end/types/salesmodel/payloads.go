package salesmodel

import "time"

type RegisterReviewPayload struct {
	Rating          int8   `json:"rating" validate:"required"`
	Title           string `json:"title" validate:"required"`
	Description     string `json:"description" validate:"required"`
	WorkerID        uint   `json:"worker_id" validate:"required"`
	RequestWorkerID uint   `json:"request_worker_id" validate:"required"`
}

type RegisterRequestPayload struct {
	IsPublic     *bool                 `json:"is_public" validate:"required"`
	Title        string                `json:"title" validate:"required"`
	Description  string                `json:"description" validate:"required"`
	SpecialityID uint                  `json:"speciality_id" validate:"required"`
	Value        uint32                `json:"value" validate:"required"`
	EndsAt       time.Time             `json:"ends_at" validate:"required"`
	Status       RequestStatusTypeEnum `json:"status" validate:"required"`
	Location     string                `json:"location" validate:"required"`
	LocationText string                `json:"location_text" validate:"required"`
	Images       []RequestImagePayload `json:"images" validate:"required"`
	Notes        []RequestNotePayload  `json:"notes" validate:"required"`
}

type RequestImagePayload struct {
	Url  string               `json:"url" validate:"required"`
	Type RequestImageTypeEnum `json:"type" validate:"required"`
}

type RequestNotePayload struct {
	Url  string `json:"url" validate:"required"`
	Text string `json:"text" validate:"required"`
}

type UpdateRequestPayload struct {
	IsPublic    *bool                 `json:"is_public" validate:"omitempty"`
	Title       string                `json:"title" validate:"omitempty"`
	Description string                `json:"description" validate:"omitempty"`
	Value       uint32                `json:"value" validate:"omitempty"`
	EndsAt      time.Time             `json:"ends_at" validate:"omitempty"`
	Status      RequestStatusTypeEnum `json:"status" validate:"omitempty"`
	Images      []RequestImage        `json:"images" validate:"omitempty"`
	Notes       []RequestNote         `json:"notes" validate:"omitempty"`
}

type UpdateRequest struct {
	IsPublic    *bool                 `json:"is_public" validate:"omitempty"`
	Title       string                `json:"title" validate:"omitempty"`
	Description string                `json:"description" validate:"omitempty"`
	Value       uint32                `json:"value" validate:"omitempty"`
	EndsAt      time.Time             `json:"ends_at" validate:"omitempty"`
	Status      RequestStatusTypeEnum `json:"status" validate:"omitempty"`
}

type RegisterRequestWorkerPayload struct {
	DateStart    time.Time             `json:"date_start" validate:"required"`
	DateFinish   time.Time             `json:"date_finish" validate:"required"`
	StatusWorker RequestStatusTypeEnum `json:"status_worker" validate:"required"`
	RequestID    uint                  `json:"request_id" validate:"required"`
}

type UpdateRequestWorkerPayload struct {
	DateStart     time.Time             `json:"date_start" validate:"omitempty"`
	DateFinish    time.Time             `json:"date_finish" validate:"omitempty"`
	DateAccepted  *time.Time            `json:"date_accepted" validate:"omitempty"`
	DateCompleted *time.Time            `json:"date_completed" validate:"omitempty"`
	StatusClient  RequestStatusTypeEnum `json:"status_client" validate:"omitempty"`
	StatusWorker  RequestStatusTypeEnum `json:"status_worker" validate:"omitempty"`
}

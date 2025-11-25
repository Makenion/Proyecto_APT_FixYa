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
	Value        uint32                `json:"value" validate:"omitempty"`
	EndsAt       time.Time             `json:"ends_at" validate:"required"`
	Status       RequestStatusTypeEnum `json:"status" validate:"required"`
	Location     string                `json:"location" validate:"omitempty"`
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
	RequestID uint `json:"request_id" validate:"required"`
	WorkerID  uint `json:"worker_id" validate:"required"`
}

type UpdateRequestWorkerPayload struct {
	DateStart     time.Time             `json:"date_start" validate:"omitempty"`
	DateFinish    time.Time             `json:"date_finish" validate:"omitempty"`
	DateAccepted  *time.Time            `json:"date_accepted" validate:"omitempty"`
	DateCompleted *time.Time            `json:"date_completed" validate:"omitempty"`
	StatusClient  RequestStatusTypeEnum `json:"status_client" validate:"omitempty"`
	StatusWorker  RequestStatusTypeEnum `json:"status_worker" validate:"omitempty"`
}

type PythonAnalysisResponse struct {
	Results []PythonImageResult `json:"results"`
	Summary PythonSummary       `json:"summary"`
	Status  string              `json:"status"`
}

type PythonImageResult struct {
	URL             string           `json:"url"`
	Status          string           `json:"status"`
	Complexity      PythonComplexity `json:"complexity"`
	HoursPrediction PythonHours      `json:"hours_prediction"`
	Summary         string           `json:"summary"`
	Error           string           `json:"error,omitempty"`
}

type PythonComplexity struct {
	Class         int       `json:"class"`
	Level         string    `json:"level"`
	Confidence    float64   `json:"confidence"`
	Probabilities []float64 `json:"probabilities"`
}

type PythonHours struct {
	EstimatedHours float64 `json:"estimated_hours"`
	Confidence     string  `json:"confidence"`
}

type PythonSummary struct {
	TotalImages           int                 `json:"total_images"`
	SuccessfulPredictions int                 `json:"successful_predictions"`
	FailedPredictions     int                 `json:"failed_predictions"`
	AverageComplexity     PythonAvgComplexity `json:"average_complexity"`
	AverageHours          float64             `json:"average_hours"`
	TotalEstimatedHours   float64             `json:"total_estimated_hours"`
}

type PythonAvgComplexity struct {
	Class int     `json:"class"`
	Level string  `json:"level"`
	Score float64 `json:"score"`
}

type CreateValorPropuestoPayload struct {
	RequestID     uint   `json:"request_id"`
	ValorProposed uint32 `json:"value_proposed"`
}

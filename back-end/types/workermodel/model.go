package workermodel

import (
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/usermodel"
)

type CertificateTypeEnum string

const (
	CertificateTypeIdentity CertificateTypeEnum = "identidad"
	CertificateTypeCompany  CertificateTypeEnum = "compañia"
	CertificateTypeOther    CertificateTypeEnum = "otro"
)

type Certificate struct {
	ID   uint   `gorm:"primaryKey" json:"id"`
	Name string `gorm:"size:100;not null" json:"name"`
	Url  string `gorm:"size:100;not null" json:"url"`

	CertificateType CertificateTypeEnum `gorm:"type:varchar(20)" json:"certificate_type"`

	WorkerDetailID uint         `json:"worker_detail_id"`                               // Clave foránea
	WorkerDetail   WorkerDetail `gorm:"foreignKey:WorkerDetailID" json:"worker_detail"` // Referencia
}

type Speciality struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Name        string `gorm:"size:100;not null;uniqueIndex" json:"name"`
	Description string `gorm:"size:100;not null" json:"descripcion"`
}

type WorkerDetail struct {
	ID               uint    `gorm:"primaryKey" json:"id"`
	Balance          float64 `gorm:"not null" json:"balance"`
	WorksCount       uint    `gorm:"not null" json:"works_count"`
	ReviewCount      uint    `gorm:"not null" json:"review_count"`
	ReviewAvg        int8    `gorm:"not null" json:"review_avg"`
	Description      *string `gorm:"size:500;null" json:"description"`
	AvailabilityText *string `gorm:"size:500;null" json:"availability_text"`

	UserID       uint              `gorm:"uniqueIndex;not null" json:"user_id"`
	User         usermodel.User    `gorm:"constraint:OnDelete:CASCADE" json:"user"`
	Certificates []Certificate     `gorm:"foreignKey:WorkerDetailID" json:"certificates"`
	Portfolio    []WorkerPortFolio `gorm:"foreignKey:WorkerDetailID" json:"portfolio"`
	Specialities []Speciality      `gorm:"many2many:worker_specialities;" json:"specialities"`
}

type WorkerSpeciality struct {
	ID uint `gorm:"primaryKey" json:"id"`

	WorkerDetailID uint         `json:"worker_detail_id"`                               // Clave foránea
	WorkerDetail   WorkerDetail `gorm:"foreignKey:WorkerDetailID" json:"worker_detail"` // Referencia

	SpecialityID uint       `json:"speciality_id"`                             // Clave foránea
	Speciality   Speciality `gorm:"foreignKey:SpecialityID" json:"speciality"` // Referencia
}

type WorkerPortFolio struct {
	ID              uint         `gorm:"primaryKey" json:"id"`
	Url             string       `gorm:"size:100;not null" json:"url"`
	WorkerDetailID  uint         `json:"worker_detail_id"`                               // Clave foránea
	WorkerDetail    WorkerDetail `gorm:"foreignKey:WorkerDetailID" json:"worker_detail"` // Referencia
	RequestWorkerID uint         `gorm:"uniqueIndex;not null" json:"request_worker_id"`
}

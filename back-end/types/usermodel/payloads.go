package usermodel

import "time"

type RegisterUserPayload struct {
	FullName     string       `json:"full_name" validate:"required"`
	Email        string       `json:"email" validate:"required,email"`
	Password     string       `json:"password" validate:"required"`
	UserType     UserTypeEnum `json:"user_type" validate:"required"`
	Calle        string       `json:"calle" validate:"required"`
	Phone        string       `json:"phone" validate:"required"`
	Comuna       uint         `json:"comuna,string" validate:"required"`
	Region       uint         `json:"region,string" validate:"required"`
	BankIdentity string       `json:"bank_identity" validate:"required"`
	DateBirth    *time.Time   `json:"date_birth"`
}

type LoginUserPayload struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=3,max=130"`
}

type UpdateUserPayload struct {
	Email         string     `json:"email" validate:"omitempty,email"`
	Password      string     `json:"password" validate:"omitempty"`
	Calle         string     `json:"calle" validate:"omitempty"`
	Comuna        uint       `json:"comuna" validate:"omitempty"`
	HouseType     string     `json:"house_type" validate:"omitempty"`
	ServicesTypes []string   `json:"services_types" validate:"omitempty"`
	BankIdentity  *string    `json:"bank_identity" validate:"omitempty"`
	BankNumber    *string    `json:"bank_number" validate:"omitempty"`
	DateBirth     *time.Time `json:"date_birth" validate:"omitempty"`
	Phone         *string    `json:"phone" validate:"omitempty"`
}

type UpdateUserService struct {
	Email        string
	Password     []byte
	CalleID      uint
	Metadatas    []UserMetadata
	BankIdentity *string
	BankNumber   *string
	DateBirth    *time.Time
	Phone        *string
}

type UpdateUser struct {
	Email        string
	Password     []byte
	CalleID      uint
	BankIdentity *string
	BankNumber   *string
	DateBirth    *time.Time
	Phone        *string
}

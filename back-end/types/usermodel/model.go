package usermodel

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/locationmodel"
	"github.com/dgrijalva/jwt-go/v4"
)

type UserTypeEnum uint

const (
	_ = iota
	UserTypeAdmin
	UserTypeClient
	UserTypeWorker
)

type User struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	UserTypeID uint      `json:"user_type_id"`                           // Clave foránea
	UserType   UserType  `gorm:"foreignKey:UserTypeID" json:"user_type"` // Referencia
	IsActive   bool      `gorm:"not null" json:"is_active"`
	FullName   string    `gorm:"size:100;not null" json:"full_name"`
	Email      string    `gorm:"size:100;uniqueIndex;not null" json:"email"`
	Password   []byte    `gorm:"not null" json:"-"`
	CreatedAt  time.Time `gorm:"autoCreateTime" json:"created_at"`

	CalleID uint                 `json:"calle_id"`                        // Clave foránea
	Calle   *locationmodel.Calle `gorm:"foreignKey:CalleID" json:"calle"` // Referencia

	Metadatas []UserMetadata `gorm:"foreignKey:UserID" json:"metadatas"`

	BankIdentity string     `gorm:"size:100;not null" json:"bank_identity"`
	BankNumber   *string    `gorm:"size:100;null" json:"bank_number"`
	DateBirth    *time.Time `gorm:"size:100;null" json:"date_birth"`
	Phone        string     `gorm:"size:100;not null" json:"phone"`
}

type UserMetadata struct {
	ID     uint   `gorm:"primaryKey" json:"id"`
	Type   string `gorm:"size:100;not null" json:"type"`
	Value  string `gorm:"size:100;not null" json:"value"`
	UserID uint   `gorm:"not null" json:"user_id"`
	User   User   `gorm:"constraint:OnDelete:CASCADE" json:"user"`
}

type UserType struct {
	ID   uint   `gorm:"primaryKey" json:"id"`
	Name string `gorm:"type:varchar(20)" json:"name"`
}

type UserToken struct {
	jwt.StandardClaims
	Email string `json:"email" validate:"required,email"`
	Type  string `json:"type" validate:"required"`
}

func (u *UserTypeEnum) UnmarshalJSON(data []byte) error {
	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return fmt.Errorf("user_type debe ser un string: %w", err)
	}
	switch s {
	case "admin":
		*u = UserTypeAdmin
	case "cliente":
		*u = UserTypeClient
	case "trabajador":
		*u = UserTypeWorker
	default:
		return fmt.Errorf("valor de user_type desconocido: %q", s)
	}
	return nil
}

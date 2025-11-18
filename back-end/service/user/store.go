package user

import (
	"context"
	"fmt"

	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/usermodel"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/utils/customserros"
	"gorm.io/gorm"
)

type Store struct {
	db *gorm.DB
}

func NewStore(db *gorm.DB) *Store {
	return &Store{db: db}
}

func (s *Store) CreateUser(ctx context.Context, user usermodel.User) (*usermodel.User, error) {

	result := s.db.WithContext(ctx).Model(&usermodel.User{}).Create(&user)

	if result.Error != nil {

		return nil, result.Error
	}

	if result.RowsAffected == 0 {

		return nil, fmt.Errorf("failed to create user")
	}

	newUser := &usermodel.User{}
	newResult := s.db.WithContext(ctx).Model(&usermodel.User{}).Where("email = ?", user.Email).Preload("UserType").Preload("Calle.Comuna.Region").First(&newUser)

	if newResult.Error != nil {
		return nil, newResult.Error
	}

	return newUser, nil
}

func (s *Store) GetUserByFilters(ctx context.Context, filters map[string]interface{}) (*usermodel.User, error) {
	var user usermodel.User
	query := s.db.WithContext(ctx).Model(&usermodel.User{})

	if filters["id"] != nil {
		query.Where("ID = ?", filters["id"])
	}

	if filters["email"] != nil {
		query.Where("Email = ?", filters["email"])
	}

	if filters["user_type"] != nil {
		query.Where("UserType = ?", filters["user_type"])
	}

	result := query.
		Preload("UserType").
		Preload("Calle.Comuna.Region").
		Preload("Metadatas").First(&user)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, customserros.ErrUserDontExists
		}
		return nil, result.Error
	}

	return &user, nil
}

// UpdateUserByEmail implements usermodel.UserStore.
func (s *Store) UpdateUserByEmail(ctx context.Context, email string, payload *usermodel.UpdateUserService) (*usermodel.User, error) {
	var user usermodel.User
	findResult := s.db.WithContext(ctx).Where("email = ?", email).First(&user)
	if findResult.Error != nil {
		return nil, findResult.Error
	}
	updatePayload := usermodel.UpdateUser{
		Email:        payload.Email,
		Password:     payload.Password,
		CalleID:      payload.CalleID,
		DateBirth:    payload.DateBirth,
		BankIdentity: payload.BankIdentity,
		Phone:        payload.Phone,
		BankNumber:   payload.BankNumber,
	}
	result := s.db.WithContext(ctx).Model(&user).Updates(updatePayload)
	if result.Error != nil {
		return nil, result.Error
	}
	if len(payload.Metadatas) > 0 {
		metadataResult := s.db.WithContext(ctx).Model(&user).Association("Metadatas").Replace(payload.Metadatas)
		if metadataResult != nil {
			return nil, metadataResult
		}
	}
	s.db.WithContext(ctx).Preload("Metadatas").First(&user, user.ID)
	return &user, nil
}

package usermodel

import (
	"context"
)

type UserService interface {
	RegisterUser(ctx context.Context, user *RegisterUserPayload) (string, *User, error)
	GetUserByFilters(ctx context.Context, filters map[string]interface{}) (*User, error)
	Login(ctx context.Context, payload LoginUserPayload) (string, *User, error)
	GetUserByJWT(ctx context.Context, cookie string) (*User, error)
	VerifyJWT(ctx context.Context, tokenString string) (*UserToken, error)
	UpdateUserByEmail(ctx context.Context, email string, payload *UpdateUserPayload) (*User, error)
}

type UserStore interface {
	CreateUser(ctx context.Context, user User) (*User, error)
	GetUserByFilters(ctx context.Context, filters map[string]interface{}) (*User, error)
	UpdateUserByEmail(ctx context.Context, email string, payload *UpdateUserService) (*User, error)
}

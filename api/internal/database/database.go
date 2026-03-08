package database

import (
	"strings"

	"github.com/glebarez/sqlite"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Open(databaseURL string) (*gorm.DB, error) {
	if strings.HasPrefix(databaseURL, "postgres://") || strings.HasPrefix(databaseURL, "postgresql://") {
		return gorm.Open(postgres.Open(databaseURL), &gorm.Config{})
	}
	return gorm.Open(sqlite.Open(databaseURL), &gorm.Config{})
}

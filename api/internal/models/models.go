package models

import (
	"time"

	"gorm.io/gorm"
)

type Message struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	Content       string         `json:"content"`
	Category      string         `json:"category"`
	ArtifactsJSON string         `gorm:"column:artifacts_json" json:"artifacts_json"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}

type Expense struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Amount      float64   `json:"amount"`
	Description string    `json:"description"`
	Account     string    `json:"account"`
	Subcategory string    `json:"subcategory"`
	Date        time.Time `json:"date"`
	MessageID   uint      `json:"message_id"`
	CreatedAt   time.Time `json:"created_at"`
}

type Earning struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Amount      float64   `json:"amount"`
	Description string    `json:"description"`
	Account     string    `json:"account"`
	Subcategory string    `json:"subcategory"`
	Date        time.Time `json:"date"`
	MessageID   uint      `json:"message_id"`
	CreatedAt   time.Time `json:"created_at"`
}

// FinancialCategory is a subcategory for expenses (e.g. alimentação, transporte).
type FinancialCategory struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"uniqueIndex" json:"name"`
	CreatedAt time.Time `json:"created_at"`
}

// Account is a bank account name used for expenses and earnings.
type Account struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"uniqueIndex" json:"name"`
	CreatedAt time.Time `json:"created_at"`
}

type Medicine struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `json:"name"`
	Quantity  int       `json:"quantity"`
	TakenAt   time.Time `json:"taken_at"`
	MessageID uint      `json:"message_id"`
	CreatedAt time.Time `json:"created_at"`
}

type Appointment struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Description string    `json:"description"`
	ScheduledAt time.Time `json:"scheduled_at"`
	MessageID   uint      `json:"message_id"`
	CreatedAt   time.Time `json:"created_at"`
}

type Idea struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Content   string    `json:"content"`
	MessageID uint      `json:"message_id"`
	CreatedAt time.Time `json:"created_at"`
}

// Medication is the known medications list used to improve classification.
type Medication struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"uniqueIndex" json:"name"`
	CreatedAt time.Time `json:"created_at"`
}

type Reminder struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Content   string    `json:"content"`
	DueAt     time.Time `json:"due_at"`
	MessageID uint      `json:"message_id"`
	CreatedAt time.Time `json:"created_at"`
}

package models

type Profile struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Title    string `json:"title"`
	Bio      string `json:"bio"`
	Email    string `json:"email"`
	LinkedIn string `json:"linkedin"`
	GitHub   string `json:"github"`
	Medium   string `json:"medium"`
	Avatar   string `json:"avatar"`
}

type Skill struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Category string `json:"category"`
	Level    int    `json:"level"`
	Icon     string `json:"icon"`
}

type Experience struct {
	ID          int    `json:"id"`
	Company     string `json:"company"`
	Role        string `json:"role"`
	Duration    string `json:"duration"`
	Description string `json:"description"`
	SortOrder   int    `json:"sort_order"`
}

type Project struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	TechStack   string `json:"tech_stack"`
	Link        string `json:"link"`
	Image       string `json:"image"`
}

type MediumPost struct {
	Title       string `json:"title"`
	Link        string `json:"link"`
	Description string `json:"description"`
	PubDate     string `json:"pub_date"`
	Thumbnail   string `json:"thumbnail"`
}

type Contact struct {
	ID      int    `json:"id"`
	Name    string `json:"name"`
	Email   string `json:"email"`
	Subject string `json:"subject"`
	Message string `json:"message"`
}

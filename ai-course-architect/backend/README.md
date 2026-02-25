# AI Course Architect - Backend

Node.js/Express backend for the AI Course Architect application.

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `OPENAI_API_KEY` | OpenAI API key (or OpenRouter key if using proxy) | Yes |
| `OPENAI_BASE_URL` | Optional base URL for OpenAI/Router endpoint (e.g. https://openrouter.ai/api/v1) | No |
| `YOUTUBE_API_KEY` | YouTube Data API key | Yes |
| `JWT_SECRET` | Secret key for signing auth tokens | Yes |
| `JWT_EXPIRES_IN` | Token expiry (e.g. "1h") | No (default: "1h") |
| `CORS_ORIGIN` | Allowed CORS origins | No |

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload

## Architecture

```
src/
├── config/         # Configuration
│   ├── database.js # MongoDB connection
│   └── env.js      # Environment variables
├── controllers/    # Request handlers
├── middleware/     # Express middleware
│   ├── errorHandler.js
│   ├── rateLimiter.js
│   └── requestValidator.js
├── models/         # Mongoose models
│   └── Course.js
├── routes/         # API routes
├── services/       # Business logic
│   ├── openaiService.js
│   ├── youtubeService.js
│   └── courseService.js
├── utils/          # Utilities
└── server.js       # Entry point
```

## API Documentation

### Authentication

#### POST /api/auth/signup

Create a new user account.

**Request body**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response** (201)
```json
{
  "success": true,
  "data": {
    "user": { "_id": "...", "name": "John Doe", "email": "john@example.com" },
    "token": "<jwt>"
  }
}
```

#### POST /api/auth/login

Authenticate existing user.

**Request body**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response** (200)
```json
{
  "success": true,
  "data": {
    "user": { "_id": "...", "name": "John Doe", "email": "john@example.com" },
    "token": "<jwt>"
  }
}
```

All subsequent `/api/courses` endpoints require the `Authorization: Bearer <token>` header.


### POST /api/courses/generate

Generate a new course from a topic.

**Request:**
```json
{
  "topic": "Machine Learning"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "courseId": "...",
    "title": "Introduction to Machine Learning",
    "description": "...",
    "modulesCount": 5,
    "microTopicsCount": 15
  }
}
```

### GET /api/courses/:id

Get course with generation status.

**Response:**
```json
{
  "success": true,
  "data": {
    "course": { ... },
    "generationStatus": {
      "isComplete": false,
      "generatedCount": 5,
      "totalCount": 15,
      "percentage": 33
    }
  }
}
```

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

Common error codes:
- `VALIDATION_ERROR` - Invalid input data
- `NOT_FOUND` - Resource not found
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `AI_SERVICE_ERROR` - OpenAI API error (temporary outage or bad response)
- `AI_AUTH_ERROR` - Authentication failure with OpenAI/Router (invalid API key)
- `VIDEO_SERVICE_ERROR` - YouTube API error

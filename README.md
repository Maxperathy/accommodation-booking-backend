# AccomBook API - Backend Documentation

A comprehensive RESTful API for an accommodation booking platform built with Node.js, Express, TypeScript, and MongoDB. This API enables users to register, authenticate, create and manage accommodation listings, and handle bookings with advanced features like image uploads, date conflict detection, and secure authentication.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Database Models](#database-models)
- [Middleware](#middleware)
- [Security Features](#security-features)
- [Development](#development)
- [Production Deployment](#production-deployment)
- [Error Handling](#error-handling)
- [Logging](#logging)

## 🎯 Overview

AccomBook API is a robust backend service for managing accommodation bookings. It provides secure user authentication, place management with image uploads, and booking functionality with conflict detection. The API is built with TypeScript for type safety, MongoDB for data persistence, and includes comprehensive validation, rate limiting, and security features.

## ✨ Features

### Authentication & Authorization

- User registration with email validation
- Secure login with JWT tokens
- Access and refresh token mechanism
- Token-based authentication middleware
- HttpOnly cookies for refresh tokens
- Secure password hashing with bcrypt

### Place Management

- Create accommodation listings with multiple photos
- Update existing places
- Get all places with pagination
- Get places by specific user
- Get place by ID
- Image upload to Cloudinary
- Support for multiple image formats (JPEG, PNG, WebP)

### Booking System

- Create bookings with date validation
- Check for overlapping bookings
- Prevent users from booking their own places
- Validate guest capacity
- Get user bookings with pagination
- Get booking by ID

### Security & Performance

- Rate limiting (60 requests per minute)
- CORS configuration with whitelist
- Helmet.js for security headers
- Request compression
- Input validation with Zod
- Secure password storage
- MongoDB connection with strict API versioning

### Developer Experience

- TypeScript for type safety
- Winston logger for structured logging
- Environment-based configuration
- Graceful server shutdown
- Comprehensive error handling
- Path aliases for cleaner imports

## 🛠 Tech Stack

### Core

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Programming language
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

### Authentication & Security

- **jsonwebtoken** - JWT token generation and verification
- **bcrypt** - Password hashing
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **cors** - Cross-origin resource sharing

### File Upload & Storage

- **multer** - Multipart/form-data handling
- **cloudinary** - Cloud image storage and optimization

### Validation & Utilities

- **zod** - Schema validation
- **winston** - Logging
- **compression** - Response compression
- **cookie-parser** - Cookie parsing
- **dotenv** - Environment variable management

### Development

- **nodemon** - Development server with auto-reload
- **ts-node** - TypeScript execution
- **tsconfig-paths** - Path mapping support

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local instance or MongoDB Atlas account)
- **Cloudinary** account (for image storage)

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd AccomBook/api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## 🔐 Environment Variables

Create a `.env` file in the `api` directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/accomBook
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/accomBook

# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-access-token-key
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# CORS Configuration
WHITELIST_ORIGINS=https://your-frontend-domain.com

# Logging
LOG_LEVEL=info
```

### Environment Variable Descriptions

- **PORT**: Server port number (default: 3000)
- **NODE_ENV**: Environment mode (`development`, `production`, `test`)
- **MONGO_URI**: MongoDB connection string
- **JWT_ACCESS_SECRET**: Secret key for access tokens
- **JWT_REFRESH_SECRET**: Secret key for refresh tokens
- **ACCESS_TOKEN_EXPIRY**: Access token expiration time (e.g., `15m`, `1h`)
- **REFRESH_TOKEN_EXPIRY**: Refresh token expiration time (e.g., `7d`, `30d`)
- **CLOUDINARY_CLOUD_NAME**: Cloudinary cloud name
- **CLOUDINARY_API_KEY**: Cloudinary API key
- **CLOUDINARY_API_SECRET**: Cloudinary API secret
- **WHITELIST_ORIGINS**: Comma-separated list of allowed origins for CORS
- **LOG_LEVEL**: Logging level (`error`, `warn`, `info`, `debug`)

## 📁 Project Structure

```
api/
├── src/
│   ├── @types/              # TypeScript type definitions
│   │   └── express/
│   │       └── index.d.ts   # Extended Express Request type
│   ├── config/              # Configuration files
│   │   └── index.ts         # Environment configuration
│   ├── controllers/         # Route controllers
│   │   └── v1/
│   │       ├── auth/        # Authentication controllers
│   │       │   ├── login.ts
│   │       │   ├── logout.ts
│   │       │   ├── refresh-token.ts
│   │       │   └── register.ts
│   │       ├── booking/     # Booking controllers
│   │       │   ├── create_booking.ts
│   │       │   ├── get_booking_by_id.ts
│   │       │   └── get_user_bookings.ts
│   │       ├── place/       # Place controllers
│   │       │   ├── create_place.ts
│   │       │   ├── get_all_places.ts
│   │       │   ├── get_place_by_id.ts
│   │       │   ├── get_places_by_users.ts
│   │       │   └── update_place.ts
│   │       └── user/        # User controllers
│   │           └── get_user.ts
│   ├── lib/                 # Utility libraries
│   │   ├── cloudinary.ts    # Cloudinary configuration
│   │   ├── express_rate_limit.ts  # Rate limiting
│   │   ├── jwt.ts           # JWT utilities
│   │   ├── mongoose.ts      # Database connection
│   │   └── winston.ts       # Logging configuration
│   ├── middleware/          # Express middleware
│   │   ├── authenticate.ts  # JWT authentication
│   │   ├── uploadImages.ts  # Image upload handling
│   │   └── validation.ts    # Request validation
│   ├── models/              # Mongoose models
│   │   ├── book.ts          # Booking model
│   │   ├── place.ts         # Place model
│   │   ├── token.ts         # Refresh token model
│   │   └── user.ts          # User model
│   ├── routes/              # API routes
│   │   └── v1/
│   │       ├── auth.ts      # Authentication routes
│   │       ├── book.ts      # Booking routes
│   │       ├── index.ts     # Route aggregator
│   │       ├── place.ts     # Place routes
│   │       └── user.ts      # User routes
│   ├── schemas/             # Zod validation schemas
│   │   ├── bookingSchema.ts
│   │   ├── placeSchema.ts
│   │   └── userSchema.ts
│   └── server.ts            # Application entry point
├── node_modules/            # Dependencies
├── dist/                    # Compiled JavaScript (generated)
├── .env                     # Environment variables (create this)
├── nodemon.json             # Nodemon configuration
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

## 🔌 API Endpoints

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication Endpoints

#### Register User

- **POST** `/auth/register`
- **Description**: Register a new user
- **Authentication**: Not required
- **Request Body**:
  ```json
  {
    "fullname": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response** (201):
  ```json
  {
    "user": {
      "fullname": "John Doe",
      "email": "john@example.com"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Cookies**: Sets `refreshToken` as HttpOnly cookie

#### Login

- **POST** `/auth/login`
- **Description**: Authenticate user and get tokens
- **Authentication**: Not required
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response** (201):
  ```json
  {
    "user": {
      "fullname": "John Doe",
      "email": "john@example.com"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Cookies**: Sets `refreshToken` as HttpOnly cookie

#### Refresh Token

- **POST** `/auth/refresh-token`
- **Description**: Get a new access token using refresh token
- **Authentication**: Not required (uses refresh token from cookie)
- **Request Cookies**: `refreshToken`
- **Response** (200):
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### Logout

- **POST** `/auth/logout`
- **Description**: Logout user and invalidate refresh token
- **Authentication**: Required
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response** (200):
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

### User Endpoints

#### Get Current User

- **GET** `/user/profile`
- **Description**: Get authenticated user's profile
- **Authentication**: Required
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response** (200):
  ```json
  {
    "user": {
      "_id": "user_id",
      "fullname": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

### Place Endpoints

#### Create Place

- **POST** `/place/create-place`
- **Description**: Create a new accommodation listing
- **Authentication**: Required
- **Headers**: `Authorization: Bearer <accessToken>`
- **Content-Type**: `multipart/form-data`
- **Request Body** (form-data):
  - `title`: string (required, 3-50 characters)
  - `address`: string (required, 5-200 characters)
  - `description`: string (required, 10-100 characters)
  - `photos`: file[] (required, max 10 files, 5MB each, JPEG/PNG/WebP)
  - `perks`: string (JSON array, max 15 items, optional)
  - `extraInfo`: string (max 50 characters, optional)
  - `checkIn`: number (0-23, required)
  - `checkOut`: number (0-23, required)
  - `maxGuests`: number (1-50, required)
  - `price`: number (positive, max 1000000, required)
- **Response** (201):
  ```json
  {
    "success": true,
    "message": "Place created successfully",
    "data": {
      "_id": "place_id",
      "owner": "user_id",
      "title": "Cozy Apartment",
      "address": "123 Main St",
      "photos": ["https://cloudinary.com/image1.jpg"],
      "description": "A cozy apartment",
      "perks": ["wifi", "parking"],
      "checkIn": 14,
      "checkOut": 11,
      "maxGuests": 4,
      "price": 100,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

#### Get All Places

- **GET** `/place/all`
- **Description**: Get all places with pagination
- **Authentication**: Not required
- **Query Parameters**:
  - `limit`: number (1-50, default: 10)
  - `offset`: number (default: 0)
- **Response** (200):
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "place_id",
        "title": "Cozy Apartment",
        "address": "123 Main St",
        "photos": ["https://cloudinary.com/image1.jpg"],
        "price": 100,
        ...
      }
    ],
    "pagination": {
      "total": 100,
      "limit": 10,
      "offset": 0
    }
  }
  ```

#### Get Place by ID

- **GET** `/place/:placeId`
- **Description**: Get a specific place by ID
- **Authentication**: Not required
- **URL Parameters**:
  - `placeId`: string (MongoDB ObjectId)
- **Response** (200):
  ```json
  {
    "success": true,
    "data": {
      "_id": "place_id",
      "title": "Cozy Apartment",
      "address": "123 Main St",
      "photos": ["https://cloudinary.com/image1.jpg"],
      "description": "A cozy apartment",
      "perks": ["wifi", "parking"],
      "checkIn": 14,
      "checkOut": 11,
      "maxGuests": 4,
      "price": 100,
      "owner": {
        "_id": "user_id",
        "fullname": "John Doe",
        "email": "john@example.com"
      }
    }
  }
  ```

#### Get User Places

- **GET** `/place/places`
- **Description**: Get places created by authenticated user
- **Authentication**: Required
- **Headers**: `Authorization: Bearer <accessToken>`
- **Query Parameters**:
  - `limit`: number (1-50, default: 10)
  - `offset`: number (default: 0)
- **Response** (200):
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "place_id",
        "title": "Cozy Apartment",
        "address": "123 Main St",
        "photos": ["https://cloudinary.com/image1.jpg"],
        "price": 100,
        ...
      }
    ],
    "pagination": {
      "total": 10,
      "limit": 10,
      "offset": 0
    }
  }
  ```

#### Update Place

- **PUT** `/place/:placeId`
- **Description**: Update an existing place
- **Authentication**: Required
- **Headers**: `Authorization: Bearer <accessToken>`
- **Content-Type**: `multipart/form-data`
- **URL Parameters**:
  - `placeId`: string (MongoDB ObjectId)
- **Request Body** (form-data, all fields optional):
  - `title`: string (optional)
  - `address`: string (optional)
  - `description`: string (optional)
  - `photos`: file[] (optional, max 10 files)
  - `perks`: string (JSON array, optional)
  - `extraInfo`: string (optional)
  - `checkIn`: number (optional)
  - `checkOut`: number (optional)
  - `maxGuests`: number (optional)
  - `price`: number (optional)
- **Response** (200):
  ```json
  {
    "success": true,
    "message": "Place updated successfully",
    "data": {
      "_id": "place_id",
      "title": "Updated Title",
      ...
    }
  }
  ```

### Booking Endpoints

#### Create Booking

- **POST** `/book/bookings`
- **Description**: Create a new booking
- **Authentication**: Required
- **Headers**: `Authorization: Bearer <accessToken>`
- **Request Body**:
  ```json
  {
    "place": "place_id",
    "checkIn": "2024-02-01",
    "checkOut": "2024-02-05",
    "name": "John Doe",
    "phone": "+1234567890",
    "price": 400,
    "guests": 2
  }
  ```
- **Response** (201):
  ```json
  {
    "success": true,
    "message": "Booking created successfuly",
    "data": {
      "_id": "booking_id",
      "place": {
        "_id": "place_id",
        "title": "Cozy Apartment",
        ...
      },
      "user": {
        "_id": "user_id",
        "fullname": "John Doe",
        ...
      },
      "checkIn": "2024-02-01T00:00:00.000Z",
      "checkOut": "2024-02-05T00:00:00.000Z",
      "name": "John Doe",
      "phone": "+1234567890",
      "price": 400,
      "guests": 2,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```
- **Validation Rules**:
  - Place must exist
  - User cannot book their own place
  - Check-in date cannot be in the past
  - Check-out date must be after check-in date
  - No overlapping bookings for the same place
  - Number of guests cannot exceed place capacity
  - User cannot have duplicate bookings for the same dates

#### Get User Bookings

- **GET** `/book/bookings`
- **Description**: Get all bookings for authenticated user
- **Authentication**: Required
- **Headers**: `Authorization: Bearer <accessToken>`
- **Query Parameters**:
  - `limit`: number (1-50, default: 10)
  - `offset`: number (default: 0)
- **Response** (200):
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "booking_id",
        "place": {
          "_id": "place_id",
          "title": "Cozy Apartment",
          "photos": ["https://cloudinary.com/image1.jpg"],
          ...
        },
        "checkIn": "2024-02-01T00:00:00.000Z",
        "checkOut": "2024-02-05T00:00:00.000Z",
        "name": "John Doe",
        "phone": "+1234567890",
        "price": 400,
        "guests": 2
      }
    ],
    "pagination": {
      "total": 5,
      "limit": 10,
      "offset": 0
    }
  }
  ```

#### Get Booking by ID

- **GET** `/book/bookings/:bookingId`
- **Description**: Get a specific booking by ID
- **Authentication**: Required
- **Headers**: `Authorization: Bearer <accessToken>`
- **URL Parameters**:
  - `bookingId`: string (MongoDB ObjectId)
- **Response** (200):
  ```json
  {
    "success": true,
    "data": {
      "_id": "booking_id",
      "place": {
        "_id": "place_id",
        "title": "Cozy Apartment",
        ...
      },
      "user": {
        "_id": "user_id",
        "fullname": "John Doe",
        ...
      },
      "checkIn": "2024-02-01T00:00:00.000Z",
      "checkOut": "2024-02-05T00:00:00.000Z",
      "name": "John Doe",
      "phone": "+1234567890",
      "price": 400,
      "guests": 2
    }
  }
  ```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication with a dual-token system:

### Token Types

1. **Access Token**: Short-lived token (default: 15 minutes) used for API requests
2. **Refresh Token**: Long-lived token (default: 7 days) stored in HttpOnly cookie, used to obtain new access tokens

### Authentication Flow

1. User registers or logs in → receives access token and refresh token cookie
2. Access token is included in the `Authorization` header for protected routes
3. When access token expires → use refresh token to get a new access token
4. On logout → refresh token is invalidated

### Using Authentication

Include the access token in the Authorization header:

```
Authorization: Bearer <accessToken>
```

### Token Generation

- Access tokens are generated using `JWT_ACCESS_SECRET`
- Refresh tokens are generated using `JWT_REFRESH_SECRET`
- Both tokens contain the user's ID in the payload

## 💾 Database Models

### User Model

```typescript
{
  fullname: string; // Required, max 100 characters
  email: string; // Required, unique, max 50 characters
  password: string; // Required, hashed with bcrypt
}
```

### Place Model

```typescript
{
  owner: ObjectId;       // Reference to User, required
  title: string;         // Required, 3-50 characters
  address: string;       // Required, 5-200 characters
  photos: string[];      // Required, array of Cloudinary URLs
  description: string;   // Required, 10-100 characters
  perks: string[];       // Optional, max 15 items
  extraInfo: string;     // Optional, max 50 characters
  checkIn: number;       // Required, 0-23 (hour)
  checkOut: number;      // Required, 0-23 (hour)
  maxGuests: number;     // Required, 1-50
  price: number;         // Required, positive, max 1000000
  createdAt: Date;       // Auto-generated
  updatedAt: Date;       // Auto-generated
}
```

### Booking Model

```typescript
{
  place: ObjectId; // Reference to Place, required
  user: ObjectId; // Reference to User, required
  checkIn: Date; // Required
  checkOut: Date; // Required
  name: string; // Required, 2-100 characters
  phone: string; // Required, 10-20 characters
  price: number; // Required, positive
  guests: number; // Required, positive, max 50
  createdAt: Date; // Auto-generated
  updatedAt: Date; // Auto-generated
}
```

### Token Model

```typescript
{
  token: string; // Required, refresh token string
  userId: ObjectId; // Reference to User, required
}
```

### Indexes

- **Booking Model**:
  - Compound index on `place`, `checkIn`, `checkOut` for faster overlap queries
  - Index on `user` and `checkIn` for faster user booking queries

## 🛡 Middleware

### Authentication Middleware

- **Location**: `src/middleware/authenticate.ts`
- **Purpose**: Validates JWT access tokens
- **Usage**: Applied to protected routes
- **Behavior**: Extracts token from `Authorization` header, verifies it, and attaches `userId` to request object

### Validation Middleware

- **Location**: `src/middleware/validation.ts`
- **Purpose**: Validates request body, params, and query using Zod schemas
- **Usage**: Applied before controllers
- **Behavior**: Validates input and returns 400 error if validation fails

### Image Upload Middleware

- **Location**: `src/middleware/uploadImages.ts`
- **Purpose**: Handles multipart/form-data file uploads
- **Components**:
  - `uploadMultiplePhotos`: Multer middleware for parsing files
  - `processPhotosUpload`: Uploads files to Cloudinary
  - `handleMulterError`: Error handler for upload errors
- **Limits**:
  - Maximum 10 files per request
  - Maximum 5MB per file
  - Allowed formats: JPEG, PNG, WebP

### Rate Limiting

- **Location**: `src/lib/express_rate_limit.ts`
- **Limit**: 60 requests per minute per IP
- **Purpose**: Prevent abuse and DDoS attacks

## 🔐 Security Features

### Password Security

- Passwords are hashed using bcrypt with salt rounds of 10
- Passwords are not returned in API responses
- Password field is excluded from queries by default

### Token Security

- Access tokens are short-lived (15 minutes)
- Refresh tokens are stored in HttpOnly cookies
- Refresh tokens are validated before use
- Tokens are invalidated on logout

### API Security

- **Helmet.js**: Sets security headers
- **CORS**: Configurable origin whitelist
- **Rate Limiting**: Prevents abuse
- **Input Validation**: Zod schemas validate all inputs
- **MongoDB Injection Protection**: Mongoose prevents injection attacks

### File Upload Security

- File type validation (only images)
- File size limits (5MB per file)
- File count limits (10 files max)
- Secure storage on Cloudinary

## 🧪 Development

### Running the Development Server

```bash
npm run dev
```

The server will automatically reload on file changes using nodemon.

### TypeScript Compilation

```bash
# Compile TypeScript to JavaScript
npx tsc

# Output will be in the dist/ directory
```

### Project Scripts

```json
{
  "dev": "nodemon" // Start development server with auto-reload
}
```

### Code Structure Guidelines

- Controllers handle request/response logic
- Models define database schemas
- Schemas define validation rules
- Middleware handles cross-cutting concerns
- Lib contains utility functions

## 🚀 Production Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Use strong, randomly generated secrets for JWT tokens
3. Configure MongoDB Atlas or production MongoDB instance
4. Set up Cloudinary account
5. Configure CORS whitelist with production domains
6. Set up proper logging (file transport for Winston)

### Build for Production

```bash
# Compile TypeScript
npx tsc

# Start production server
node dist/server.js
```

### Recommended Production Practices

- Use environment variables for all configuration
- Enable MongoDB connection pooling
- Set up monitoring and alerting
- Use a process manager (PM2, systemd)
- Set up reverse proxy (Nginx)
- Enable HTTPS
- Regular database backups
- Monitor rate limiting and adjust as needed

## ⚠️ Error Handling

The API uses consistent error response format:

### Error Response Format

```json
{
  "code": "ErrorCode",
  "message": "Human-readable error message",
  "error": {} // Additional error details (development only)
}
```

### Common Error Codes

- **AuthenticationError**: Authentication failed or token invalid
- **NotFound**: Resource not found
- **ServerError**: Internal server error
- **ValidationError**: Input validation failed (handled by Zod)

### HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **404**: Not Found
- **409**: Conflict (overlapping bookings, duplicate entries)
- **500**: Internal Server Error
- **429**: Too Many Requests (rate limit exceeded)

## 📊 Logging

The API uses Winston for structured logging:

### Log Levels

- **error**: Error messages
- **warn**: Warning messages
- **info**: Informational messages
- **debug**: Debug messages

### Log Configuration

- **Development**: Console output with colors
- **Production**: JSON format (can be configured for file transport)
- **Test**: Silent (no logging)

### Logged Events

- Database connections
- User registrations and logins
- Token generation
- Booking creation
- Place creation and updates
- Errors and exceptions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

[Your License Here]

## 👥 Authors

[Your Name/Team]

**Note**: This API is designed for an accommodation booking platform. Ensure you have proper security measures in place before deploying to production. Always use HTTPS in production and keep your secrets secure.

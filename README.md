# MMCH Backend API Documentation

## Swagger Documentation

This backend API includes comprehensive Swagger documentation for all endpoints.

### Accessing the Documentation

1. Start the server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:5000/api-docs
   ```

### Available Endpoints

The API documentation is organized into the following categories:

#### Authentication
- `POST /register` - Register a new user
- `POST /login` - Login user

#### Users
- `GET /all-users` - Get all users (requires authentication)

#### Teachers
- `POST /teacher/create-teacher` - Create a new teacher (requires authentication)

#### System Activity
- `GET /system-activity-logs` - Get all system activity logs (requires authentication)

### Authentication

Most endpoints require JWT authentication. To authenticate:

1. First, login using the `/login` endpoint
2. Copy the `token` from the response
3. In the Swagger UI, click the "Authorize" button
4. Enter your token in the format: `Bearer YOUR_TOKEN_HERE`
5. Click "Authorize"

### API Response Format

All API responses follow this standard format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  },
  "token": "jwt_token_here" // Only for login/register
}
```

### Error Responses

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

### Development

To add new endpoints with Swagger documentation:

1. Add JSDoc comments above your route definitions
2. Follow the OpenAPI 3.0 specification
3. Include request/response schemas
4. Add proper error responses
5. Use appropriate tags for organization

Example:
```javascript
/**
 * @swagger
 * /your-endpoint:
 *   get:
 *     summary: Your endpoint description
 *     tags: [Your Tag]
 *     responses:
 *       200:
 *         description: Success response
 */
```

### Environment Variables

Make sure to set up your `.env` file with the following variables:
- `PORT` - Server port (default: 5000)
- `MONGO_URL` - MongoDB connection string
- Other required environment variables for your application 
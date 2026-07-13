# AgriSarthi Backend API

Backend API for AgriSarthi AI - Agricultural assistant for farmers in Uttarakhand.

## Features

- User authentication (register/login)
- Crop information management
- AI-powered chat assistant using Groq API
- RESTful API with proper error handling
- MongoDB Atlas database for persistent storage
- Mongoose ODM for data modeling

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the backend directory:
```
PORT=5000
NODE_ENV=development
GROQ_API_KEY=your_groq_api_key_here
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
```

3. Set up MongoDB Atlas:
- Go to https://mongodb.com/cloud/atlas
- Sign up for a free account
- Create a new cluster (M0 free tier)
- In Database Access, create a database user with username and password
- In Network Access, whitelist your IP address (or use 0.0.0.0/0 for all IPs)
- Click "Connect" → "Connect your application"
- Copy the connection string and add it to your `.env` file (replace `<username>` and `<password>`)

4. Get your free Groq API key:
- Go to https://console.groq.com/
- Sign up for a free account
- Navigate to API Keys
- Create a new API key
- Copy the key and add it to your `.env` file

5. Start the server:
```bash
npm run dev
```

The server will start on http://localhost:5000

## API Endpoints

### Health Check
- `GET /api/health` - Check if API is running

### User Endpoints
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/:id` - Get user by ID

### Crop Endpoints
- `GET /api/crops` - Get all crops
- `GET /api/crops/:id` - Get crop by ID
- `GET /api/crops/search?q=query&season=season` - Search crops
- `POST /api/crops` - Add new crop (admin)

### Chat Endpoints
- `GET /api/chat/messages?userId=1` - Get chat messages for user
- `POST /api/chat/messages` - Send a chat message (AI response via Groq)
- `DELETE /api/chat/messages/:id` - Delete a chat message

## Database Schema

The application uses MongoDB Atlas with the following collections:

### User Collection
- `_id`: ObjectId (auto-generated)
- `name`: String (required)
- `phone`: String (required, unique)
- `password`: String (required)
- `createdAt`: Date (auto-generated)

### Crop Collection
- `_id`: ObjectId (auto-generated)
- `name`: String (required)
- `nameHindi`: String
- `emoji`: String (default: '🌾')
- `season`: String (required, enum: ['Rabi', 'Kharif', 'Both'])
- `description`: String
- `diseases`: Array of Strings
- `createdAt`: Date (auto-generated)

### ChatMessage Collection
- `_id`: ObjectId (auto-generated)
- `userId`: ObjectId (ref: User, required)
- `role`: String (required, enum: ['user', 'assistant'])
- `text`: String (required)
- `timestamp`: Date (auto-generated)

For detailed schema documentation, see [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)

## Testing

Use the provided Postman collection: `AgriSarthi-API-Collection.postman_collection.json`

Import it into Postman or Thunder Client to test all endpoints.

## Default User

For testing, a default user is available:
- Phone: 9876543210
- Password: password123

## AI Model

The chat assistant uses Groq's Llama3-70b model for generating agricultural advice. The system prompt is configured to:
- Provide practical farming advice
- Respond in Hindi or English based on user input
- Focus on sustainable practices
- Be farmer-friendly and concise

## Development

```bash
# Run with auto-reload
npm run dev

# Run without auto-reload
npm start
```

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas (Database)
- Mongoose (ODM)
- Groq SDK (AI)
- CORS
- dotenv

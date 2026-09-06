### 1. Single Prompt Processing

The application accepts a single user input and processes it through the complete AI pipeline.

Example request:

```json
{
  "userInput": "What is React?"
}
```

The backend:

1. Receives the user input.
2. Fetches the prompt template from MongoDB.
3. Replaces `{{userInput}}` with the user's question.
4. Sends the final prompt to Ollama.
5. Receives the AI-generated response.
6. Saves the request and response in MongoDB.
7. Returns the response to the client.

---

### 2. Batch Prompt Processing

The application accepts multiple questions in a single request.

Example request:

```json
{
  "userInputs": [
    "What is React?",
    "What is Node.js?",
    "What is MongoDB?"
  ]
}
```

Each input is processed independently using asynchronous execution.

The implementation uses:

```javascript
Promise.all()
```

This allows multiple inputs to be processed concurrently while preserving the order of the returned responses.

---

### 3. MongoDB Prompt Templates

Prompt templates are stored in the MongoDB collection:

```text
prompts
```

Example document:

```json
{
  "_id": "Education_Prompt",
  "template": "You are an expert in education. Answer the following question clearly and briefly. Keep the answer under 100 words and use simple language.\n\nQuestion: {{userInput}}"
}
```

The placeholder `{{userInput}}` is dynamically replaced with the user's actual question.

This keeps the prompt configuration separate from the application logic.

---

## 4. Request and Response History

Every processed request is stored in the MongoDB collection:

```text
history
```

Each history record contains:

```text
userInput
promptId
finalPrompt
response
createdAt
updatedAt
```

The history is stored in MongoDB as required by the case study.

---

## 5. Local AI Processing

The application uses Ollama with the Gemma 3 1B model to generate real AI responses locally.

The backend communicates with Ollama through:

```text
http://localhost:11434/api/chat
```

This allows the application to generate AI responses without using a paid OpenAI API.

---

# 🛠️ Tech Stack

### Frontend

- React.js
- JavaScript
- Vite
- HTML
- CSS

### Backend

- Node.js
- Express.js
- JavaScript
- REST API

### Database

- MongoDB
- MongoDB Atlas
- Mongoose

### AI

- Ollama
- Gemma 3 1B

---

# 📁 Project Structure

```text
PromptFlow-AI/
│
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   └── chatController.js
│   │
│   ├── models/
│   │   ├── Prompt.js
│   │   └── History.js
│   │
│   ├── routes/
│   │   └── chatRoutes.js
│   │
│   ├── services/
│   │   └── aiService.js
│   │
│   ├── seed/
│   │   └── promptSeed.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

---

# 🧩 Backend Architecture

```text
Client
  ↓
Routes
  ↓
Controllers
  ↓
Services
  ↓
MongoDB / Ollama
```

### Routes

Defines the API endpoints.

### Controllers

Handles request validation, prompt processing, AI calls, database operations, and responses.

### Services

Handles communication with Ollama.

### Models

Defines MongoDB schemas.

### Config

Handles the MongoDB connection.

### Seed

Creates or updates the prompt template in MongoDB.

---

# 🔄 Application Flow

## Single Prompt

```text
React Frontend
      ↓
POST /api/chat
      ↓
Express Route
      ↓
Chat Controller
      ↓
Fetch prompt from MongoDB
      ↓
Replace {{userInput}}
      ↓
AI Service
      ↓
Ollama
      ↓
Gemma 3 1B
      ↓
AI Response
      ↓
Save request and response to MongoDB
      ↓
Return response to frontend
```

## Batch Prompt

```text
React Frontend
      ↓
POST /api/chat/batch
      ↓
Chat Controller
      ↓
Process multiple inputs
      ↓
Promise.all()
      ↓
Ollama
      ↓
Save results to MongoDB
      ↓
Return responses in original order
```

---

# 🔌 API Documentation

## Single Prompt API

### Endpoint

```text
POST /api/chat
```

### Request

```json
{
  "userInput": "What is React?"
}
```

### Response

```json
{
  "response": "React is a JavaScript library used to build user interfaces..."
}
```

---

## Batch Prompt API

### Endpoint

```text
POST /api/chat/batch
```

### Request

```json
{
  "userInputs": [
    "What is React?",
    "What is Node.js?",
    "What is MongoDB?"
  ]
}
```

### Response

```json
{
  "responses": [
    "React is a JavaScript library...",
    "Node.js is a JavaScript runtime...",
    "MongoDB is a NoSQL database..."
  ]
}
```

The batch API uses `Promise.all()` to process inputs asynchronously while maintaining the original response order.

---

# 🗄️ Database Structure

## `prompts` Collection

```json
{
  "_id": "Education_Prompt",
  "template": "You are an expert in education. Answer the following question clearly and briefly. Keep the answer under 100 words and use simple language.\n\nQuestion: {{userInput}}"
}
```

## `history` Collection

```json
{
  "userInput": "What is React?",
  "promptId": "Education_Prompt",
  "finalPrompt": "You are an expert in education...",
  "response": "React is a JavaScript library used to build user interfaces...",
  "createdAt": "<timestamp>",
  "updatedAt": "<timestamp>"
}
```

---

# 🤖 AI Integration

AI processing is implemented in:

```text
server/services/aiService.js
```

The service sends the final prompt to Ollama and receives the generated response from Gemma 3 1B.

The AI provider is separated from the controller so it can be replaced with another provider in the future.

---

# 💡 Why Ollama?

Ollama was used instead of the paid OpenAI API.

Benefits:

- Free for local development
- No OpenAI API key required
- Real AI-generated responses
- Runs locally
- Easy to replace with another AI provider

---

# ⚙️ Installation

## Prerequisites

- Node.js
- npm
- MongoDB Atlas
- Ollama
- Git

## Clone Repository

```bash
git clone <your-github-repository-url>
cd PromptFlow-AI
```

## Install Frontend

```bash
cd client
npm install
```

## Install Backend

```bash
cd server
npm install
```

---

# 🔐 Environment Variables

Create:

```text
server/.env
```

Add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Do not commit `.env` to GitHub.

---

# 🤖 Ollama Setup

Check Ollama:

```bash
ollama --version
```

Run the model:

```bash
ollama run gemma3:1b
```

---

# 🌱 Seed Prompt

From the `server` folder:

```bash
npm run seed
```

This creates or updates the `Education_Prompt` in the `prompts` collection.

---

# ▶️ Run the Application

## Backend

Inside `server`:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

## Frontend

Inside `client`:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# 🧪 Testing

## Single Prompt

Enter a question:

```text
What is React?
```

Click **Send Prompt**.

The request is sent to:

```text
POST /api/chat
```

---

## Batch Prompt

Enter multiple questions:

```text
What is React?
What is Node.js?
What is MongoDB?
```

Click **Process Batch**.

The request is sent to:

```text
POST /api/chat/batch
```

Each question is processed independently and the responses are returned in the same order.

---

# 🔐 Security

The following files should not be committed:

```text
.env
node_modules/
dist/
```

Recommended `.gitignore`:

```gitignore
node_modules/
.env
dist/
```

Never expose database credentials or API keys.

---

# 📌 Case Study Requirements Covered

| Requirement | Implementation |
|---|---|
| Single POST endpoint | `POST /api/chat` |
| User input | `userInput` |
| Prompt in MongoDB | `prompts` collection |
| Dynamic replacement | `{{userInput}}` |
| AI processing | Ollama + Gemma 3 1B |
| Save request/response | `history` collection |
| Return response | JSON response |
| Multiple inputs | `POST /api/chat/batch` |
| Asynchronous processing | `Promise.all()` |
| Preserve response order | `Promise.all()` |
| Frontend | React + Vite |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |

---

# 🎯 Design Decisions

### MongoDB Prompt Templates

Prompt templates are stored in MongoDB instead of being hard-coded into the controller.

### Separate AI Service

Ollama communication is isolated inside:

```text
server/services/aiService.js
```

### Asynchronous Batch Processing

`Promise.all()` allows multiple inputs to be processed concurrently while preserving response order.

### Persistent History

Every processed request and AI response is stored in MongoDB.

---

# 🚧 Future Improvements

- Authentication
- Rate limiting
- Automated tests
- Response streaming
- Batch concurrency limits
- Multiple prompt templates
- Production deployment
- API documentation with Swagger

---

# 👨‍💻 Author

**Sumit Mali**

Full Stack Developer | MERN Stack

---

# 📄 License

This project was created as a technical case-study application.

Backend AI integration
----------------------

1. Copy `backend/.env.example` to `backend/.env` and set `GEMINI_API_KEY` (Google API key with access to Generative Language API) and `MONGO_URL` if you use MongoDB.
2. From the `backend` folder run `npm install` then `npm start` to start the server on port 3222.
3. The frontend (open `frontend/index.html`) will call the backend at `http://localhost:3222` by default. The absence flow will POST to `/api/absence` and the backend will call the Gemini API to generate excuse emails and return them in JSON under the `text` property.

Notes:
- This project expects `GEMINI_API_KEY` in the environment. If you don't have the API key, the endpoint will return a 500 error with a helpful message.
- The prompt is built from the absence reason, day, student id, and the affected classes list; the backend returns the model's raw response in `raw` for debugging.



# Firebase Authentication + MongoDB Backend
## What is included
- Express server using ES modules
- Firebase Admin token verification
- MongoDB (mongoose) user model with upsert on login
- Auth middleware to protect routes
- Example routes: /api/auth/login and /api/auth/profile

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Add `serviceAccountKey.json` from Firebase Console to the project root.
   - **Do not commit** this file (it's in .gitignore).
3. Create a `.env` file in project root with:
   ```
   MONGO_URI=mongodb://localhost:27017/testdb
   PORT=5000
   ```
4. Start server:
   ```bash
   npm run dev
   ```
5. Frontend: send Firebase ID token to POST /api/auth/login or use `Authorization: Bearer <token>` header for protected routes.

## Notes
- This project expects you to download the Firebase service account JSON and place it as `serviceAccountKey.json`.
- Change MONGO_URI to your Atlas URI if using MongoDB Atlas.

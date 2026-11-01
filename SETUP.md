# Phantom Chat — Firebase + PeerJS starter

This is a deployable starter for a WhatsApp-inspired chat interface. It includes generated user numbers, Firebase anonymous sign-in, Firestore-backed user-to-user chat history and live updates, a PeerJS data connection hook, and a Meta AI-style assistant endpoint backed by a Llama API-compatible service.

## Important behavior and limitations
- Firestore is the authoritative live chat and history store. Messages persist across reloads/devices while users retain the same Firebase anonymous-auth identity on their device.
- Generated 8-digit numbers are deterministic for the Firebase UID, not a phone number or proof of identity. Users need to share the number directly.
- Meta AI assistant history in this starter is stored in the browser's localStorage, not synced between devices. For server-synced AI history, create a Firestore AI conversation collection and enforce owner-only rules.
- PeerJS is initialized and has a connection action. Firestore is used as the reliable text-message path and persistence path. PeerJS is not required for Firestore chat to work.
- This starter does not include real phone-number SMS verification, end-to-end encryption, group chats, media upload, push notifications, moderation, or production abuse prevention.
- Never place AI provider secrets in the client. The server endpoint is a proxy. The provider URL/model may require adjustment to the API account you use.

## 1. Firebase setup
1. Create a Firebase project and register a Web app.
2. Copy the Firebase web config values into `index.html` under `firebaseConfig`.
3. In Firebase Console → Authentication → Sign-in method, enable **Anonymous**.
4. Create a **Cloud Firestore** database.
5. Publish the contents of `firestore.rules`.
6. For number search to work, Firestore must permit signed-in reads of user profiles as configured in the rules. These profiles contain only public chat-directory fields; do not store private user data there.

## 2. AI provider setup
Use an approved Meta Llama API-compatible provider and obtain an API key. Copy `.env.example` to `.env`, then set `META_AI_API_KEY`, and adjust `META_AI_URL` / `META_AI_MODEL` to the provider's current API docs. This is a server-side credential.

## 3. Run
Requires Node.js 20+.
```bash
npm install
cp .env.example .env
# Edit .env and index.html Firebase config
npm start
```
Open `http://localhost:3000`.

## 4. Deploy
Deploy the static/client app and `server.js` to a host that supports a persistent Node/Express service or adapt the endpoint to your serverless provider. Set environment variables on the host. Firebase rules must be deployed independently.

## Security checklist before real users
- Replace anonymous-only identity with verified sign-in and account recovery.
- Make number allocation collision-safe (server/transaction) and prevent profile enumeration.
- Tighten Firestore rules to validate exact fields, membership changes, message lengths and immutable participant lists.
- Add rate limits, spam/reporting, age-appropriate safety, server-side AI quota controls, and data deletion/export.
- Implement real end-to-end encryption if you need private messaging; Firebase TLS and database rules alone are not E2E encryption.

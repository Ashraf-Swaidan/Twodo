import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// Path to the Firebase service account secret file
const serviceAccountPath = '/etc/secrets/FirebaseServiceAccountKey.json';

// Read the Firebase service account key from the file
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // Ensure this is set in Render environment
});

// Export Firebase bucket for file operations
const bucket = admin.storage().bucket();
export { bucket };

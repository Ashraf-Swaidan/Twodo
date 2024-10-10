import admin from 'firebase-admin';
import fs from 'fs';

// Path to the Firebase secret file from Render's secret management
const serviceAccountPath = process.env.RENDER_SECRET_FILE_FirebaseServiceAccountKey;
console.log('Service Account Path:', process.env.RENDER_SECRET_FILE_FirebaseServiceAccountKey);

// Read the Firebase service account key from the file
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // Ensure you set this in Render environment
});

// Export Firebase bucket for file operations
const bucket = admin.storage().bucket();
export { bucket };

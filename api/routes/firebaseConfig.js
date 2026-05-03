import admin from 'firebase-admin';
import fs from 'fs';

// Local/dev: set FIREBASE_SERVICE_ACCOUNT_PATH or GOOGLE_APPLICATION_CREDENTIALS to your JSON key.
// Render/production: defaults to /etc/secrets/FirebaseServiceAccountKey.json
const serviceAccountPath =
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  '/etc/secrets/FirebaseServiceAccountKey.json';

if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(
    `Firebase service account file not found at "${serviceAccountPath}". ` +
      'Download a key from Firebase Console → Project settings → Service accounts, then set FIREBASE_SERVICE_ACCOUNT_PATH to that file.'
  );
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (!process.env.FIREBASE_STORAGE_BUCKET) {
  throw new Error('Set FIREBASE_STORAGE_BUCKET in .env (Storage bucket name, e.g. your-project.appspot.com).');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

// Export Firebase bucket for file operations
const bucket = admin.storage().bucket();
export { bucket };

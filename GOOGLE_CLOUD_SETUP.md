# Google Cloud Services Setup Guide

This project now includes 4 Google Cloud services integrated via Firebase:

## 1. Firebase Authentication
- User login/signup functionality
- Password reset
- User profile management

## 2. Cloud Firestore (Database)
- NoSQL database for storing app data
- Real-time data synchronization
- Collections: detections, alerts, cameras, users

## 3. Cloud Storage
- File upload and management
- Image, video, and document storage
- Automatic file organization by type

## 4. Cloud Functions
- Serverless backend functions
- Data processing, notifications, reports
- External API integrations

---

## Setup Instructions

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select existing project
3. Enable Google Analytics (optional)
4. Complete project setup

### Step 2: Enable Services

#### Authentication
1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Enable "Email/Password" provider
3. Add any additional providers (Google, Facebook, etc.) as needed

#### Firestore Database
1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode" (for development)
3. Select a location close to your users

#### Storage
1. Go to "Storage" → "Get started"
2. Choose "Start in test mode" (for development)
3. Select a location

#### Functions
1. Go to "Functions" → "Get started"
2. Install Firebase CLI if not already installed:
   ```bash
   npm install -g firebase-tools
   ```
3. Login to Firebase:
   ```bash
   firebase login
   ```

### Step 3: Get Configuration

1. In Firebase Console, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" → "Web" if no web app exists
4. Copy the configuration object

### Step 4: Update Configuration

Replace the placeholder values in `src/lib/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

### Step 5: Set Up Security Rules

#### Firestore Rules
In Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read/write detections
    match /detections/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write alerts
    match /alerts/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write cameras
    match /cameras/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### Storage Rules
In Firebase Console → Storage → Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload files
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## Usage Examples

### Authentication
```javascript
import { AuthService } from '../services';

// Sign up
const { user, error } = await AuthService.signUp('user@example.com', 'password', 'John Doe');

// Sign in
const { user, error } = await AuthService.signIn('user@example.com', 'password');

// Sign out
const { error } = await AuthService.signOut();
```

### Firestore Database
```javascript
import { FirestoreService } from '../services';

// Add detection
const { id, error } = await FirestoreService.addDetection({
  cameraId: 'camera1',
  objectType: 'person',
  confidence: 0.95,
  timestamp: new Date()
});

// Get detections
const { data, error } = await FirestoreService.getDetections(10);
```

### Storage
```javascript
import { StorageService } from '../services';

// Upload image
const file = event.target.files[0];
const { url, error } = await StorageService.uploadImage(file, 'detections');

// Upload camera thumbnail
const { url, error } = await StorageService.uploadCameraThumbnail(file, 'camera1');
```

### Cloud Functions
```javascript
import { FunctionsService } from '../services';

// Send notification
const { data, error } = await FunctionsService.sendNotification({
  title: 'New Detection',
  body: 'Person detected at Camera 1',
  userId: 'user123',
  type: 'detection'
});

// Process detection
const { data, error } = await FunctionsService.processDetection({
  imageUrl: 'https://example.com/image.jpg',
  cameraId: 'camera1',
  objectType: 'person'
});
```

---

## Development Setup

### Local Development
For local development with Cloud Functions:

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Initialize Firebase in your project:
   ```bash
   firebase init functions
   ```

3. Start emulators:
   ```bash
   firebase emulators:start
   ```

4. In your React app, connect to emulators:
   ```javascript
   import { FunctionsService } from '../services';
   FunctionsService.connectToEmulator();
   ```

---

## Deployment

### Deploy Cloud Functions
```bash
firebase deploy --only functions
```

### Deploy Security Rules
```bash
firebase deploy --only firestore:rules
firebase deploy --only storage
```

---

## Security Notes

1. **Never commit API keys** to version control
2. Use environment variables for sensitive configuration
3. Set up proper security rules for production
4. Enable authentication before deploying to production
5. Regularly review and update security rules

---

## Troubleshooting

### Common Issues

1. **"Firebase App named '[DEFAULT]' already exists"**
   - Ensure you're only initializing Firebase once
   - Check for duplicate imports

2. **"Permission denied" errors**
   - Verify security rules are properly configured
   - Check if user is authenticated

3. **"Function not found" errors**
   - Ensure Cloud Functions are deployed
   - Check function names match exactly

4. **Storage upload failures**
   - Verify storage rules allow uploads
   - Check file size limits

For more help, refer to the [Firebase Documentation](https://firebase.google.com/docs). 
# QuickService - Service Booking Mobile App

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Setup Environment Variables:**
   - Copy `.env.example` to `.env`.
   - Fill in your Firebase configuration keys.

3. **Configure Expo:**
   - Ensure your `app.json` `extra` section matches your `.env` or use `expo-constants`.

4. **Run the App:**
   ```bash
   npx expo start
   ```

## 📱 Building for Production

### Android (APK/AAB)
```bash
npx eas build --platform android --profile preview
```

### iOS
```bash
npx eas build --platform ios
```

## 🔒 Security
- Firestore rules are located in `firestore.rules`.
- Deploy them using Firebase CLI:
  ```bash
  firebase deploy --only firestore:rules
  ```

## 🛠️ Tech Stack
- React Native (Expo)
- Redux Toolkit
- Firebase (Auth, Firestore, Storage)
- Formik + Yup

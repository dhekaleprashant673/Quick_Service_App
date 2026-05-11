import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  getMultiFactorResolver
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const authService = {
  // Signup
  signup: async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile
      await updateProfile(user, { displayName: name });

      // Save user to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email,
        role: 'customer', // Default role
        createdAt: new Date().toISOString(),
      });

      return user;
    } catch (error) {
      throw error;
    }
  },

  // Login
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, mfaRequired: false };
    } catch (error) {
      if (error.code === 'auth/multi-factor-auth-required') {
        return { 
          mfaRequired: true, 
          resolver: getMultiFactorResolver(auth, error) 
        };
      }
      throw error;
    }
  },

  // MFA Enrollment
  enrollMFA: async (phoneNumber, recaptchaVerifier) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      const session = await multiFactor(user).getSession();
      const phoneInfoOptions = {
        phoneNumber,
        session
      };

      const phoneAuthProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneAuthProvider.verifyPhoneNumber(
        phoneInfoOptions,
        recaptchaVerifier
      );

      return verificationId;
    } catch (error) {
      throw error;
    }
  },

  // Confirm MFA Enrollment
  confirmMFAEnrollment: async (verificationId, verificationCode, label = 'Mobile Phone') => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
      
      await multiFactor(user).enroll(multiFactorAssertion, label);
      
      // Update Firestore
      await setDoc(doc(db, 'users', user.uid), { mfaEnabled: true }, { merge: true });
      
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Verify MFA Sign-in
  verifyMFASignIn: async (resolver, verificationId, verificationCode) => {
    try {
      const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
      const userCredential = await resolver.resolveSignIn(multiFactorAssertion);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  // Disable MFA
  disableMFA: async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      const enrolledFactors = multiFactor(user).enrolledFactors;
      if (enrolledFactors.length > 0) {
        await multiFactor(user).unenroll(enrolledFactors[0]);
        await setDoc(doc(db, 'users', user.uid), { mfaEnabled: false }, { merge: true });
      }
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  },

  // Update Profile Photo
  updateProfilePhoto: async (photoURL) => {
    try {
      if (auth.currentUser) {
        // Update Firebase Auth profile
        await updateProfile(auth.currentUser, { photoURL });
        
        // Update Firestore user document
        await setDoc(doc(db, 'users', auth.currentUser.uid), {
          photoURL
        }, { merge: true });
        
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  },

  // Update Profile Data (Name, Email, Password)
  updateProfileData: async ({ name, email, password }) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      if (name) {
        await updateProfile(user, { displayName: name });
        await setDoc(doc(db, 'users', user.uid), { name }, { merge: true });
      }

      if (email && email !== user.email) {
        await updateEmail(user, email);
        await setDoc(doc(db, 'users', user.uid), { email }, { merge: true });
      }

      if (password) {
        await updatePassword(user, password);
      }

      return true;
    } catch (error) {
      throw error;
    }
  },

  // Get User Data
  getUserData: async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      throw error;
    }
  },

  // Forgot Password
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  }
};

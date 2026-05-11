import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../config/firebase';
import { setUser, setLoading } from '../store/slices/authSlice';
import { authService } from '../services/authService';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      dispatch(setLoading(true));
      if (firebaseUser) {
        // Fetch additional user data from Firestore
        const userData = await authService.getUserData(firebaseUser.uid);
        
        // Extract only serializable fields to avoid Redux errors
        const serializableUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          emailVerified: firebaseUser.emailVerified,
          photoURL: firebaseUser.photoURL,
          ...userData // Firestore data is already serializable
        };
        
        dispatch(setUser(serializableUser));
      } else {
        dispatch(setUser(null));
      }
      dispatch(setLoading(false));
    });

    return unsubscribe;
  }, [dispatch]);

  return { user, loading, isAuthenticated };
};

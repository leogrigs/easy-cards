import { User } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestore } from "./clientApp";

/**
 * Fetches a user document by UID or creates it if it doesn't exist.
 *
 * @param user - Firebase Auth user object.
 * @returns The user document data.
 */
export async function getUserData(user: User) {
  const userRef = doc(firestore, "users", user.uid);
  const userSnapshot = await getDoc(userRef);

  if (userSnapshot.exists()) {
    return userSnapshot.data();
  } else {
    const newUser = {
      uid: user.uid,
      modules: [],
      createdAt: serverTimestamp(),
    };

    await setDoc(userRef, newUser);
    return newUser;
  }
}

import { Module } from "@/interfaces/module.interface";
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
      id: user.uid,
      modules: [],
      createdAt: serverTimestamp(),
    };

    await setDoc(userRef, newUser);
    return newUser;
  }
}

/**
 * Creates a new module in the Firestore modules collection.
 *
 * @param module - The module object to create.
 * @returns The created module data.
 */
export async function createModule(module: Module, userId: string) {
  const moduleRef = doc(firestore, "modules", module.id);

  const newModule = {
    ...module,
    createdAt: serverTimestamp(),
  };

  await setDoc(moduleRef, newModule);
  await updateUserModules(userId, module.id);

  return newModule;
}

export async function updateUserModules(userId: string, moduleId: string) {
  const userRef = doc(firestore, "users", userId);
  const userSnapshot = await getDoc(userRef);

  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();
    const modules = userData.modules || [];

    modules.push(moduleId);

    await setDoc(userRef, { modules }, { merge: true });
  }
}

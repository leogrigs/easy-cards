import { Module } from "@/interfaces/module.interface";
import { User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
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
export async function createModule(module: Module) {
  const moduleRef = doc(firestore, "modules", module.id);

  const newModule = {
    ...module,
    createdAt: serverTimestamp(),
  };

  await setDoc(moduleRef, newModule);

  return newModule;
}

/**
 * Updates the user's modules array with a new module.
 *
 * @param userId The user id to update the modules for.
 * @param moduleId The module id to add to the user's modules.
 * @param moduleName The module name to add to the user's modules.
 * @returns A promise that resolves when the update is complete.
 */
export async function updateUserModules(
  userId: string,
  moduleId: string,
  moduleName: string
) {
  const userRef = doc(firestore, "users", userId);
  const userSnapshot = await getDoc(userRef);

  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();
    const modules = userData.modules || [];

    const newModule = {
      id: moduleId,
      name: moduleName,
    };

    modules.push(newModule);

    await setDoc(userRef, { modules }, { merge: true });
  }
}

/**
 * Fetches all public modules from Firestore.
 * @returns An array of public modules.
 */
export async function getPublicModules(): Promise<Module[]> {
  const modulesRef = collection(firestore, "modules");
  const publicModulesQuery = query(modulesRef, where("public", "==", true));
  const querySnapshot = await getDocs(publicModulesQuery);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Module[];
}

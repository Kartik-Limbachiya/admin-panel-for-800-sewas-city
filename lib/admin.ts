import { doc, setDoc, deleteDoc, collection, getDocs, query, where } from "firebase/firestore"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "./firebase"

export interface AdminUser {
  uid: string
  email: string
  role: "admin" | "super-admin"
  createdAt: string
  createdBy: string
  displayName?: string
}

export async function createAdminUser(
  email: string,
  password: string,
  role: "admin" | "super-admin",
  createdBy: string,
): Promise<{ success: boolean; error?: string; uid?: string }> {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Add user role to Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role,
      createdAt: new Date().toISOString(),
      createdBy,
      displayName: email.split("@")[0],
    })

    return { success: true, uid: user.uid }
  } catch (error: any) {
    console.error("Error creating admin user:", error)
    return { success: false, error: error.message }
  }
}

export async function getAllAdmins(): Promise<AdminUser[]> {
  try {
    const adminsQuery = query(collection(db, "users"), where("role", "in", ["admin", "super-admin"]))

    const querySnapshot = await getDocs(adminsQuery)
    const admins: AdminUser[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      admins.push({
        uid: doc.id,
        email: data.email,
        role: data.role,
        createdAt: data.createdAt,
        createdBy: data.createdBy,
        displayName: data.displayName,
      })
    })

    return admins.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error("Error fetching admins:", error)
    throw new Error("Failed to fetch admin users")
  }
}

export async function updateAdminRole(uid: string, newRole: "admin" | "super-admin"): Promise<void> {
  try {
    await setDoc(
      doc(db, "users", uid),
      {
        role: newRole,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    )
  } catch (error) {
    console.error("Error updating admin role:", error)
    throw new Error("Failed to update admin role")
  }
}

export async function removeAdmin(uid: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "users", uid))
  } catch (error) {
    console.error("Error removing admin:", error)
    throw new Error("Failed to remove admin")
  }
}

export async function checkSuperAdminPermission(currentUserUid: string): Promise<boolean> {
  try {
    const userDoc = await getDocs(query(collection(db, "users"), where("__name__", "==", currentUserUid)))

    if (!userDoc.empty) {
      const userData = userDoc.docs[0].data()
      return userData.role === "super-admin"
    }

    return false
  } catch (error) {
    console.error("Error checking super admin permission:", error)
    return false
  }
}

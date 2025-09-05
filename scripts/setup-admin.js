import { initializeApp } from "firebase/app"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { getFirestore, doc, setDoc } from "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxOKe44xBylnwuQhULbGZIxah6MkDnWrM",
  authDomain: "sewas-city-e0c35.firebaseapp.com",
  projectId: "sewas-city-e0c35",
  storageBucket: "sewas-city-e0c35.firebasestorage.app",
  messagingSenderId: "18048398924",
  appId: "1:18048398924:web:af79e4f4593a8f511e26e9",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

async function createAdminUser() {
  try {
    // Create admin user credentials
    const adminEmail = "admin@sewascity.com"
    const adminPassword = "Admin123!"

    console.log("Creating admin user...")

    // Create the user account
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword)
    const user = userCredential.user

    console.log("User created with UID:", user.uid)

    // Add admin role to Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: adminEmail,
      role: "admin",
      createdAt: new Date().toISOString(),
      name: "System Administrator",
    })

    console.log("✅ Admin user created successfully!")
    console.log("📧 Email:", adminEmail)
    console.log("🔑 Password:", adminPassword)
    console.log("👤 Role: admin")
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message)

    if (error.code === "auth/email-already-in-use") {
      console.log("📝 User already exists. Admin user is ready to use!")
      console.log("📧 Email:", "admin@sewascity.com")
      console.log("🔑 Password:", "Admin123!")
    }
  }
}

// Run the setup
createAdminUser()

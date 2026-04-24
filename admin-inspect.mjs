import { isFirebaseAdminConfigured, getFirebaseAdminDb } from "./server/firebaseAdmin.mjs"

console.log("configured", isFirebaseAdminConfigured)
const db = getFirebaseAdminDb()
const snap = await db.collection("users").limit(5).get()
console.log("count", snap.size)
snap.forEach((d) => {
  console.log(d.id, JSON.stringify(d.data()).slice(0, 800))
})

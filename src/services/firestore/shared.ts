import { Timestamp } from "firebase/firestore"

export const toMillis = (value?: Timestamp | number | null) => {
  if (value instanceof Timestamp) {
    return value.toMillis()
  }
  if (typeof value === "number") {
    return value
  }
  return undefined
}

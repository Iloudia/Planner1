import { onSnapshot, setDoc } from "firebase/firestore"
import type { FirebaseUserDocument } from "../../models/firebase"
import { userDocRef } from "./userPaths"

const nowIso = () => new Date().toISOString()

export type HomeTodoItem = {
  id: string
  text: string
  done: boolean
}

export type HomeTodosSnapshot = {
  todos: HomeTodoItem[]
  hasStoredTodos: boolean
}

const normalizeHomeTodos = (value: unknown): HomeTodoItem[] => {
  if (!Array.isArray(value)) {
    return []
  }

  const seen = new Set<string>()
  const normalized: HomeTodoItem[] = []

  value.forEach((entry) => {
    if (!entry || typeof entry !== "object") {
      return
    }

    const todo = entry as Partial<HomeTodoItem>
    const id = typeof todo.id === "string" ? todo.id.trim() : ""
    const text = typeof todo.text === "string" ? todo.text.trim() : ""
    if (!id || !text || seen.has(id)) {
      return
    }

    seen.add(id)
    normalized.push({
      id,
      text,
      done: Boolean(todo.done),
    })
  })

  return normalized
}

export const subscribeToHomeTodos = (
  userId: string,
  onTodos: (snapshot: HomeTodosSnapshot) => void,
  onError?: (error: Error) => void,
) =>
  onSnapshot(
    userDocRef(userId),
    (snapshot) => {
      const data = snapshot.data() as FirebaseUserDocument | undefined
      onTodos({
        todos: normalizeHomeTodos(data?.homeTodos),
        hasStoredTodos: Object.prototype.hasOwnProperty.call(data ?? {}, "homeTodos"),
      })
    },
    (error) => {
      onError?.(error)
    },
  )

export const saveHomeTodos = async (userId: string, todos: HomeTodoItem[]) => {
  await setDoc(
    userDocRef(userId),
    {
      homeTodos: normalizeHomeTodos(todos),
      updatedAt: nowIso(),
    },
    { merge: true },
  )
}

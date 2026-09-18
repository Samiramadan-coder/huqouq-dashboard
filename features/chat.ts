import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";
import { signInAnonymously, type User } from "firebase/auth";
import type { ChatMessage, SendTextMessageParams } from "@/types/chat";

let firebaseAuthPromise: Promise<User> | null = null;

// Ensures the user is authenticated with Firebase, signing in anonymously if necessary.
export async function ensureFirebaseAuth(): Promise<User> {
  if (auth.currentUser) {
    return auth.currentUser;
  }

  if (firebaseAuthPromise) {
    return firebaseAuthPromise;
  }

  firebaseAuthPromise = signInAnonymously(auth)
    .then((result) => {
      return result.user;
    })
    .catch((error) => {
      firebaseAuthPromise = null;
      throw error;
    });

  return firebaseAuthPromise;
}

// Subscribes to chat messages for a specific case, providing real-time updates.
export function subscribeToMessages(
  caseId: string,
  currentUserId: string,
  onMessages: (messages: ChatMessage[]) => void,
  onError?: (error: Error) => void,
) {
  let unsubscribeFirestore: (() => void) | null = null;

  let cancelled = false;

  const startListener = async () => {
    try {
      await ensureFirebaseAuth();
      if (cancelled) {
        return;
      }

      const messagesRef = collection(db, "chats", String(caseId), "messages");
      const messagesQuery = query(messagesRef, orderBy("createdAt", "asc"));

      unsubscribeFirestore = onSnapshot(
        messagesQuery,

        (snapshot) => {
          const messages: ChatMessage[] = snapshot.docs.map((document) => {
            const data = document.data();

            return {
              id: document.id,
              senderId: String(data.senderId ?? ""),
              type: data.type ?? "text",
              text: data.text ?? null,
              fileName: data.fileName ?? null,
              fileType: data.fileType ?? null,
              fileUrl: data.fileUrl ?? null,
              fileSizeBytes: data.fileSizeBytes ?? null,
              replyTo: data.replyTo ?? null,
              createdAt: data.createdAt?.toDate?.() ?? null,
              sentByUser: String(data.senderId) === String(currentUserId),
            };
          });

          onMessages(messages);
        },

        (error) => {
          console.error(`Messages listener error for case ${caseId}:`, error);

          onError?.(error);
        },
      );
    } catch (error) {
      console.error("Firebase authentication error:", error);

      onError?.(
        error instanceof Error
          ? error
          : new Error("Firebase authentication failed"),
      );
    }
  };

  startListener();

  return () => {
    cancelled = true;

    if (unsubscribeFirestore) {
      unsubscribeFirestore();
    }
  };
}

// Sends a text message in a specific chat case.
export async function sendTextMessage({
  caseId,
  userId,
  text,
  caseTitle = null,
  replyTo = null,
}: SendTextMessageParams) {
  const cleanText = text.trim();

  if (!cleanText) {
    return;
  }

  await ensureFirebaseAuth();

  const chatRef = doc(db, "chats", String(caseId));
  const messagesRef = collection(chatRef, "messages");

  await addDoc(messagesRef, {
    senderId: String(userId),
    type: "text",
    text: cleanText,
    fileName: null,
    fileType: null,
    fileUrl: null,
    replyTo,
    createdAt: serverTimestamp(),
  });

  await setDoc(
    chatRef,
    {
      caseId: String(caseId),
      caseTitle: caseTitle ?? null,
      lastMessage: cleanText,
      lastMessageAt: serverTimestamp(),
      lastMessageSenderId: String(userId),
    },
    {
      merge: true,
    },
  );
}

export async function markChatAsRead(caseId: string, userId: string) {
  await ensureFirebaseAuth();

  const chatRef = doc(db, "chats", String(caseId));

  await setDoc(
    chatRef,
    {
      lastRead: {
        [String(userId)]: serverTimestamp(),
      },
    },
    {
      merge: true,
    },
  );
}

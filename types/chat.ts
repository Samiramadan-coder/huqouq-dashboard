export type ChatMessageType = "text" | "file" | "system";

export type ChatReply = {
  id: string;
  text?: string | null;
  fileName?: string | null;
};

export type ChatMessage = {
  id: string;
  senderId: string;
  type: ChatMessageType;
  text: string | null;
  fileName: string | null;
  fileType: string | null;
  fileUrl: string | null;
  fileSizeBytes: number | null;
  replyTo: ChatReply | null;
  createdAt: Date | null;
  sentByUser: boolean;
};

export type SendTextMessageParams = {
  caseId: string;
  userId: string;
  text: string;
  caseTitle?: string | null;
  replyTo?: ChatReply | null;
};

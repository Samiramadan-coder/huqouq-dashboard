"use client";

import {
  Download,
  Expand,
  File as FileIcon,
  FileArchive,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Pause,
  Play,
  X,
  Eye,
} from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import Image from "next/image";
import { ChatMessage } from "@/types/chat";
import { cn, formatChatDate } from "@/lib/utils";
import { subscribeToMessages } from "@/features/chat";
import { CaseMonitoring } from "@/types/case-monitoring";
import { useDirection } from "@/components/ui/direction";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Spinner } from "../ui/spinner";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function ChatContent({
  caseItem,
}: {
  caseItem: CaseMonitoring;
}) {
  const t = useTranslations("CaseMonitoring");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Subscribe to chat messages for the given case and client.
  useEffect(() => {
    if (!caseItem?.id || !caseItem?.client?.id) return;

    const unsubscribe = subscribeToMessages(
      String(caseItem.id),
      String(caseItem.client.id),
      (messages) => {
        setMessages(messages);
        setLoading(false);
      },
      (error) => {
        console.error("Messages error:", error);
      },
    );

    return unsubscribe;
  }, [caseItem.client.id, caseItem.id]);

  // Scroll to the bottom of the chat when new messages are received.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "auto",
    });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex justify-center items-center text-[13px] text-gray-400">
        {t("Chat.noMessages")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 relative">
      <div className="sticky z-50 top-12 -mx-4 px-4 py-3 bg-amber-50/60 border-b border-amber-100 flex items-center gap-2">
        <Eye className="text-amber-700 size-4" />
        <p className="text-[12px] text-amber-700 font-medium">
          {t("Chat.readOnly")}
        </p>
      </div>

      {messages.map((message) => {
        if (message.type === "system") {
          return (
            <div key={message.id} className="flex justify-center">
              <div className="rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 text-[11px] text-accent">
                {message.text}
              </div>
            </div>
          );
        }

        const isText = message.type === "text";

        const isImage =
          message.type === "file" &&
          Boolean(message.fileType?.startsWith("image/"));

        const isAudio =
          message.type === "file" &&
          Boolean(message.fileType?.startsWith("audio/"));

        const isDocument = message.type === "file" && !isImage && !isAudio;

        return (
          <div key={message.id} className="flex items-start gap-2">
            {!message.sentByUser && (
              <Avatar>
                <AvatarImage
                  src={caseItem.hired_lawyer.photo_url || ""}
                  alt="User avatar"
                />
                <AvatarFallback>
                  {caseItem.hired_lawyer.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            )}

            <div className="flex flex-col flex-1">
              {message.sentByUser ? (
                <div className="text-[10px] text-gray-400 mb-1 text-left flex justify-end">
                  {caseItem.client.name}
                </div>
              ) : (
                <div className="text-[10px] text-gray-400 mb-1 text-left flex justify-start">
                  {caseItem.hired_lawyer.name}
                </div>
              )}

              <div
                className={
                  message.sentByUser ? "flex justify-end" : "flex justify-start"
                }
              >
                <div
                  className={cn(
                    "max-w-[70%]",
                    isText &&
                      cn(
                        "rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                        message.sentByUser
                          ? "rounded-tr-sm bg-primary text-white"
                          : "rounded-tl-sm border border-blue-100 bg-blue-50 text-blue-900",
                      ),
                  )}
                >
                  {isText && message.text && (
                    <p className="whitespace-pre-wrap wrap-break-word">
                      {message.text}
                    </p>
                  )}

                  {isImage && message.fileUrl && (
                    <ImageAttachment
                      url={message.fileUrl}
                      name={message.fileName}
                      caption={message.text}
                      sentByUser={message.sentByUser}
                    />
                  )}

                  {isAudio && message.fileUrl && (
                    <div className="space-y-1.5">
                      <AudioAttachment
                        url={message.fileUrl}
                        messageId={message.id}
                        sentByUser={message.sentByUser}
                      />

                      {message.text && (
                        <Caption sentByUser={message.sentByUser}>
                          {message.text}
                        </Caption>
                      )}
                    </div>
                  )}

                  {isDocument && message.fileUrl && (
                    <div className="space-y-1.5">
                      <FileAttachment
                        url={message.fileUrl}
                        name={message.fileName}
                        fileType={message.fileType}
                        sizeBytes={message.fileSizeBytes}
                        sentByUser={message.sentByUser}
                      />

                      {message.text && (
                        <Caption sentByUser={message.sentByUser}>
                          {message.text}
                        </Caption>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {message.sentByUser ? (
                <div className="text-[10px] text-gray-400 mt-1 text-left flex justify-end">
                  {formatChatDate(message.createdAt)}
                </div>
              ) : (
                <div className="text-[10px] text-gray-400 mt-1 text-left flex justify-start">
                  {formatChatDate(message.createdAt)}
                </div>
              )}
            </div>

            {message.sentByUser && (
              <Avatar>
                <AvatarImage
                  src={caseItem.client.photo_url || ""}
                  alt="User avatar"
                />
                <AvatarFallback>
                  {caseItem.client.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

// Small text bubble shown below a media attachment when the message also has a caption.
function Caption({
  sentByUser,
  children,
}: {
  sentByUser: boolean;
  children: ReactNode;
}) {
  return (
    <p
      className={cn(
        "max-w-64 rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap wrap-break-word",
        sentByUser
          ? "rounded-tr-sm bg-primary text-white"
          : "rounded-tl-sm border border-blue-100 bg-blue-50 text-blue-900",
      )}
    >
      {children}
    </p>
  );
}

// Image attachment rendered as a thumbnail card that opens a full-size lightbox on click.
function ImageAttachment({
  url,
  name,
  caption,
  sentByUser,
}: {
  url: string;
  name: string | null;
  caption: string | null;
  sentByUser: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="w-64 max-w-full overflow-hidden rounded-xl">
        <div className="group relative bg-black/5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="block w-full cursor-zoom-in"
          >
            <Image
              src={url}
              alt={name || "Image attachment"}
              width={256}
              height={224}
              className="h-56 w-full object-cover"
            />
          </button>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-150 group-hover:bg-black/25 group-hover:opacity-100">
            <span className="grid size-9 place-content-center rounded-full bg-black/50 text-white">
              <Expand className="size-4" />
            </span>
          </div>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-2 inset-e-2 z-10 grid size-7 place-content-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm transition-opacity duration-150 hover:bg-black/70 group-hover:opacity-100"
          >
            <Download className="size-3.5" />
            <span className="sr-only">Download image</span>
          </a>
        </div>

        {caption && (
          <p
            className={cn(
              "px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap wrap-break-word",
              sentByUser
                ? "bg-primary text-white"
                : "border border-t-0 border-blue-100 bg-blue-50 text-blue-900",
            )}
          >
            {caption}
          </p>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-[min(92vw,42rem)]! border-none bg-transparent p-0 shadow-none ring-0 sm:max-w-[min(92vw,42rem)]!"
        >
          <DialogTitle className="sr-only">
            {name || "Image attachment"}
          </DialogTitle>

          <Image
            src={url}
            alt={name || "Image attachment"}
            width={1200}
            height={900}
            className="max-h-[80vh] w-auto max-w-full rounded-lg object-contain"
          />

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-2 inset-s-2 grid size-8 place-content-center rounded-full bg-black/50 text-white hover:bg-black/70"
          >
            <Download className="size-4" />
            <span className="sr-only">Download image</span>
          </a>

          <DialogClose className="absolute top-2 inset-e-2 grid size-8 place-content-center rounded-full bg-black/50 text-white hover:bg-black/70">
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Voice/audio attachment rendered as a compact player with a waveform-style seek bar.
function AudioAttachment({
  url,
  messageId,
  sentByUser,
}: {
  url: string;
  messageId: string;
  sentByUser: boolean;
}) {
  const dir = useDirection();
  const audioRef = useRef<HTMLAudioElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const bars = useMemo(() => getWaveformBars(messageId), [messageId]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) audio.play();
    else audio.pause();
  };

  const seekToClientX = (clientX: number) => {
    const audio = audioRef.current;
    const track = trackRef.current;
    if (!audio || !track || !audio.duration) return;

    const rect = track.getBoundingClientRect();
    let fraction = (clientX - rect.left) / rect.width;
    if (dir === "rtl") fraction = 1 - fraction;
    fraction = Math.min(1, Math.max(0, fraction));

    audio.currentTime = fraction * audio.duration;
    setProgress(fraction);
  };

  return (
    <div
      className={cn(
        "flex w-64 max-w-full items-center gap-2.5 rounded-2xl px-3 py-2.5",
        sentByUser
          ? "bg-primary text-white"
          : "border border-blue-100 bg-blue-50 text-blue-900",
      )}
    >
      <button
        type="button"
        onClick={togglePlay}
        className={cn(
          "grid size-9 shrink-0 place-content-center rounded-full transition-colors",
          sentByUser
            ? "bg-white/15 hover:bg-white/25"
            : "bg-blue-600 text-white hover:bg-blue-700",
        )}
      >
        {isPlaying ? (
          <Pause className="size-3.5 fill-current" />
        ) : (
          <Play className="size-3.5 fill-current ms-0.5" />
        )}
        <span className="sr-only">
          {isPlaying ? "Pause" : "Play"} voice message
        </span>
      </button>

      <div className="min-w-0 flex-1">
        <div
          ref={trackRef}
          onClick={(event) => seekToClientX(event.clientX)}
          className="flex h-6 cursor-pointer items-center justify-between"
        >
          {bars.map((height, index) => (
            <span
              key={index}
              style={{ height: `${Math.round(height * 100)}%` }}
              className={cn(
                "w-0.75 shrink-0 rounded-full transition-colors",
                index / bars.length < progress ? "bg-current" : "bg-current/30",
              )}
            />
          ))}
        </div>

        <span className="mt-0.5 block text-[10px] tabular-nums opacity-70">
          {formatAudioTime(currentTime > 0 ? currentTime : duration)}
        </span>
      </div>

      <audio ref={audioRef} src={url} preload="metadata" className="hidden" />
    </div>
  );
}

// Generic (non-image, non-audio) file attachment rendered as a compact file card.
function FileAttachment({
  url,
  name,
  fileType,
  sizeBytes,
  sentByUser,
}: {
  url: string;
  name: string | null;
  fileType: string | null;
  sizeBytes: number | null;
  sentByUser: boolean;
}) {
  const { Icon, className } = getFileIconStyle(fileType, name);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex w-64 max-w-full items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors",
        sentByUser
          ? "bg-primary text-white hover:bg-primary/90"
          : "border border-blue-100 bg-blue-50 text-blue-900 hover:bg-blue-100/70",
      )}
    >
      <span
        className={cn(
          "grid size-10 shrink-0 place-content-center rounded-lg",
          sentByUser ? "bg-white/15" : className,
        )}
      >
        <Icon className="size-5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium">
          {name || "File"}
        </span>

        {sizeBytes ? (
          <span
            className={cn(
              "block text-[11px]",
              sentByUser ? "text-white/70" : "text-blue-900/60",
            )}
          >
            {formatFileSize(sizeBytes)}
          </span>
        ) : null}
      </span>

      <Download className="size-4 shrink-0 opacity-60" />
    </a>
  );
}

// Deterministically generates faux-waveform bar heights (0-1) from a message id.
function getWaveformBars(seed: string, count = 24) {
  let hash = 0;

  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  return Array.from({ length: count }, () => {
    hash = (hash * 1103515245 + 12345) >>> 0;
    return 0.3 + (((hash >>> 8) % 100) / 100) * 0.7;
  });
}

// Formats a seconds value as "m:ss" for audio player timestamps.
function formatAudioTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

// Formats a byte count into a human-readable file size (e.g. "1.4 MB").
function formatFileSize(bytes: number) {
  if (bytes <= 0) return "";

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / 1024 ** exponent;

  return `${exponent === 0 ? value : value.toFixed(1)} ${units[exponent]}`;
}

// Picks an icon and accent color for a file based on its MIME type or extension.
function getFileIconStyle(fileType: string | null, fileName: string | null) {
  const extension = fileName?.split(".").pop()?.toLowerCase() ?? "";

  if (fileType?.includes("pdf") || extension === "pdf") {
    return { Icon: FileText, className: "bg-red-50 text-red-600" };
  }

  if (
    fileType?.includes("spreadsheet") ||
    fileType?.includes("excel") ||
    ["xls", "xlsx", "csv"].includes(extension)
  ) {
    return {
      Icon: FileSpreadsheet,
      className: "bg-emerald-50 text-emerald-600",
    };
  }

  if (
    fileType?.includes("zip") ||
    fileType?.includes("compressed") ||
    fileType?.includes("archive") ||
    ["zip", "rar", "7z"].includes(extension)
  ) {
    return { Icon: FileArchive, className: "bg-amber-50 text-amber-600" };
  }

  if (
    fileType?.startsWith("video/") ||
    ["mp4", "mov", "avi", "mkv"].includes(extension)
  ) {
    return { Icon: FileVideo, className: "bg-purple-50 text-purple-600" };
  }

  if (fileType?.includes("word") || ["doc", "docx"].includes(extension)) {
    return { Icon: FileText, className: "bg-blue-50 text-blue-600" };
  }

  return { Icon: FileIcon, className: "bg-gray-100 text-gray-500" };
}

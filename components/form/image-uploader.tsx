"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Controller,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Image as ImageIcon, X } from "lucide-react";

import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

type ImageValue = string | File;

type NormalFormImageUploaderProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  required?: boolean;
  className?: string;
  buttonLabel: string;
  errors?: FieldErrors<T>;
};

type ImagePreviewProps = {
  image: ImageValue;
  imageUrl: string;
  index: number;
  isDragged: boolean;
  onDragStart: () => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: () => void;
  onDragEnd: () => void;
  onRemove: () => void;
};

function ImagePreview({
  image,
  imageUrl,
  index,
  isDragged,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onRemove,
}: ImagePreviewProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={cn(
        "relative overflow-hidden rounded-lg border border-border",
        isDragged && "opacity-60",
      )}
    >
      {typeof image === "string" ? (
        <Image
          src={imageUrl}
          alt={`Product Image ${index + 1}`}
          width={300}
          height={300}
          className="h-24 w-full object-cover"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={`Product Image ${index + 1}`}
          className="h-24 w-full object-cover"
        />
      )}

      <Button
        type="button"
        aria-label="Remove image"
        onClick={(event) => {
          event.stopPropagation();
          onRemove();
        }}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
        onDragStart={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        className="absolute inset-e-2 top-2 flex size-6 items-center justify-center rounded-full bg-background/90 text-destructive shadow-sm transition hover:text-destructive-foreground"
      >
        <X className="size-3.5" />
      </Button>
    </div>
  );
}

export default function NormalFormImageUploader<T extends FieldValues>({
  name,
  control,
  label = "Product Photos",
  required,
  className,
  buttonLabel,
  errors,
}: NormalFormImageUploaderProps<T>) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewUrlsRef = useRef<Map<File, string>>(new Map());

  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(
    null,
  );

  const getImageUrl = (image: ImageValue) => {
    if (typeof image === "string") {
      return image;
    }

    const existingUrl = previewUrlsRef.current.get(image);

    if (existingUrl) {
      return existingUrl;
    }

    const newUrl = URL.createObjectURL(image);

    previewUrlsRef.current.set(image, newUrl);

    return newUrl;
  };

  const removePreviewUrl = (image: ImageValue) => {
    if (typeof image === "string") {
      return;
    }

    const imageUrl = previewUrlsRef.current.get(image);

    if (!imageUrl) {
      return;
    }

    URL.revokeObjectURL(imageUrl);
    previewUrlsRef.current.delete(image);
  };

  useEffect(() => {
    const previewUrls = previewUrlsRef.current;

    return () => {
      previewUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });

      previewUrls.clear();
    };
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedImages = Array.isArray(field.value)
          ? (field.value as ImageValue[])
          : [];

        const handleImageDrop = (targetIndex: number) => {
          if (draggedImageIndex === null || draggedImageIndex === targetIndex) {
            return;
          }

          const reorderedImages = [...selectedImages];

          const [movedImage] = reorderedImages.splice(draggedImageIndex, 1);

          if (!movedImage) {
            setDraggedImageIndex(null);
            return;
          }

          reorderedImages.splice(targetIndex, 0, movedImage);

          field.onChange(reorderedImages);
          setDraggedImageIndex(null);
        };

        const handleRemoveImage = (imageIndex: number) => {
          const imageToRemove = selectedImages[imageIndex];

          if (imageToRemove) {
            removePreviewUrl(imageToRemove);
          }

          const updatedImages = selectedImages.filter(
            (_, index) => index !== imageIndex,
          );

          field.onChange(updatedImages);
          setDraggedImageIndex(null);
        };

        const handleFilesChange = (
          event: React.ChangeEvent<HTMLInputElement>,
        ) => {
          const files = Array.from(event.target.files ?? []);

          if (files.length === 0) {
            return;
          }

          field.onChange([...selectedImages, ...files]);

          event.target.value = "";
        };

        // Collect all relevant errors
        const allErrors: Array<{ message?: string } | undefined> = [];

        // Add the main field error
        if (fieldState.error) {
          allErrors.push(fieldState.error);
        }

        // Add nested array item errors if they exist
        if (errors && name in errors) {
          const fieldError = errors[name];
          if (Array.isArray(fieldError)) {
            fieldError.forEach((itemError) => {
              if (
                itemError &&
                typeof itemError === "object" &&
                "message" in itemError
              ) {
                allErrors.push(itemError as { message?: string });
              }
            });
          }
        }

        return (
          <Field className={className} data-invalid={fieldState.invalid}>
            <FieldLabel
              htmlFor={`${name}-file-input`}
              className={cn(
                "text-sm font-semibold",
                required &&
                  "after:ms-1 after:text-destructive after:content-['*']",
              )}
            >
              {label}
            </FieldLabel>

            <FieldContent>
              <div className="space-y-2">
                <div className="rounded-lg border border-dashed border-border bg-primary/10 p-4">
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {selectedImages.map((image, index) => (
                      <ImagePreview
                        key={
                          typeof image === "string"
                            ? `${image}-${index}`
                            : `${image.name}-${image.size}-${image.lastModified}-${index}`
                        }
                        image={image}
                        imageUrl={getImageUrl(image)}
                        index={index}
                        isDragged={draggedImageIndex === index}
                        onDragStart={() => setDraggedImageIndex(index)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={() => handleImageDrop(index)}
                        onDragEnd={() => setDraggedImageIndex(null)}
                        onRemove={() => handleRemoveImage(index)}
                      />
                    ))}

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-3 text-muted-foreground transition hover:border-primary hover:text-primary"
                    >
                      <ImageIcon className="size-5" />

                      <span className="text-xs">{buttonLabel}</span>
                    </button>

                    <input
                      ref={fileInputRef}
                      id={`${name}-file-input`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      multiple
                      onChange={handleFilesChange}
                    />
                  </div>
                </div>

                <FieldError errors={allErrors} />
              </div>
            </FieldContent>
          </Field>
        );
      }}
    />
  );
}

"use client";

import React, { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Trash2, Church, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { editOrganizationImage } from "../../services/profile.services";
import { deleteOrgImageAction } from "../../action/profile.action";
import { getErrorMessage } from "@/src/shared/lib/axios/axios.instance";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "@/src/shared/ui/Spinner";

interface OrgImageProps {
  imagePath: string | null;
  orgName: string;
}

const OrgImage: React.FC<OrgImageProps> = ({ imagePath, orgName }) => {
  const t = useTranslations("pages.profile");
  const fileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const queryClient = useQueryClient();

  const uploadFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error(t("image.invalidType"));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("image.tooLarge"));
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
      const response = await editOrganizationImage(file);
      toast.success(response?.message || response || t("image.uploadSuccess"));
      queryClient.invalidateQueries({ queryKey: ["organization", "profile"] });
    } catch (error) {
      toast.error(getErrorMessage(error));
      setPreview(null);
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  // Drag & Drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }, []);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteOrgImageAction();
      if (result.success) {
        toast.success(result.message);
        setPreview(null);
        queryClient.invalidateQueries({ queryKey: ["organization", "profile"] });
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const displayImage = preview || imagePath;

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 pt-6">
        <h3 className="text-lg font-semibold">{t("image.title")}</h3>

        {/* Drop Zone */}
        <div
          onClick={() => fileRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`
            relative w-full max-w-[280px] aspect-square rounded-2xl border-2 border-dashed
            flex flex-col items-center justify-center gap-3 cursor-pointer
            transition-all duration-200 overflow-hidden
            ${isDragging
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50"
            }
            ${isUploading ? "pointer-events-none opacity-70" : ""}
          `}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Spinner />
              <p className="text-sm text-muted-foreground">
                {t("image.uploading")}
              </p>
            </div>
        ) : displayImage ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
                  <Spinner />
                </div>
              )}
              <img
                src={displayImage}
                alt={orgName}
                className="w-full h-full object-cover"
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
              {/* Overlay on hover */}
              {!imageLoading && (
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <Camera className="w-8 h-8 text-white" />
                  <p className="text-sm text-white font-medium">
                    {t("image.change")}
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Upload className="w-7 h-7 text-muted-foreground" />
              </div>
              <div className="text-center px-4">
                <p className="text-sm font-medium text-foreground">
                  {isDragging ? t("image.dropHere") : t("image.dragDrop")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("image.formats")}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Delete button */}
        {displayImage && (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            disabled={isDeleting}
            className="text-destructive hover:text-destructive"
          >
            {isDeleting ? <Spinner /> : <Trash2 size={16} />}
            {t("image.delete")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default OrgImage;
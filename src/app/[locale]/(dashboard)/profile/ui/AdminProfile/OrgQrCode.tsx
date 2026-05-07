"use client";

import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Share2, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

interface OrgQrCodeProps {
  organizationId: string;
  organizationName: string;
}

const OrgQrCode: React.FC<OrgQrCodeProps> = ({
  organizationId,
  organizationName,
}) => {
  const t = useTranslations("pages.profile");
   const qrRef = useRef<HTMLDivElement>(null);
  // The QR contains ONLY the organization ID
  const qrValue = organizationId;

  // The link is separate for copy/share
  const registerUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/register-user?org=${organizationId}`
      : `/register-user?org=${organizationId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(registerUrl);
      toast.success(t("qr.copied"));
    } catch {
      toast.error(t("qr.copyError"));
    }
  };

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const link = document.createElement("a");
      link.download = `${organizationName}-QR.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: organizationName,
          text: t("qr.shareText"),
          url: registerUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 pt-6">
        <h3 className="text-lg font-semibold">{t("qr.title")}</h3>
        <p className="text-sm text-muted-foreground text-center">
          {t("qr.description")}
        </p>

        <div
          ref={qrRef}
          className="bg-white p-4 rounded-xl border shadow-sm"
        >
          <QRCodeSVG
            value={qrValue}
            size={200}
            level="H"
            includeMargin
          />
        </div>

        <p className="text-xs text-muted-foreground text-center break-all max-w-[280px]">
          ID: {organizationId}
        </p>

        <div className="flex gap-2 flex-wrap justify-center">
          <Button variant="outline" size="sm" onClick={handleCopyLink}>
            <Copy size={16} />
            {t("qr.copy")}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download size={16} />
            {t("qr.download")}
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 size={16} />
            {t("qr.share")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrgQrCode;
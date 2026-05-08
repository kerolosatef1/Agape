"use client";

import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";

interface QrScannerProps {
  onScan: (result: string) => void;
  buttonLabel: string;
}

const QrScanner: React.FC<QrScannerProps> = ({ onScan, buttonLabel }) => {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = "qr-reader";

  const startScanner = async () => {
    setIsScanning(true);

    // Wait for DOM to render
    await new Promise((r) => setTimeout(r, 100));

    const html5QrCode = new Html5Qrcode(containerId);
    scannerRef.current = html5QrCode;

    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          // Extract org ID from URL or use raw text
          let orgId = decodedText;

          // If it's a URL like /register/user?org=xxx
          try {
            const url = new URL(decodedText);
            const orgParam = url.searchParams.get("org");
            if (orgParam) orgId = orgParam;
          } catch {
            // Not a URL, use as-is (raw org ID)
          }

          onScan(orgId);
          stopScanner();
        },
        () => {
          // Scan error — ignore (still scanning)
        },
      );
    } catch (err) {
      console.error("Camera error:", err);
      setIsScanning(false);
      
      const errorMsg = String(err);
      if (errorMsg.includes("NotAllowed") || errorMsg.includes("Permission")) {
        onScan("CAMERA_DENIED");
      }
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {!isScanning ? (
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          onClick={startScanner}
        >
          <Camera size={18} />
          {buttonLabel}
        </Button>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={stopScanner}
            >
              <X size={18} />
            </Button>
          </div>
          <div
            id={containerId}
            className="w-full rounded-lg overflow-hidden border"
          />
        </div>
      )}
    </div>
  );
};

export default QrScanner;
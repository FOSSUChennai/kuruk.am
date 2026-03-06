"use client"

import { useState, useRef, useEffect } from "react"
import type React from "react"
import QRCode from "react-qr-code"
import { useToast } from "@/hooks/use-toast"
import { Download, Copy, ArrowLeft } from "lucide-react" // Import Copy and ArrowLeft icons
interface QrCodeGeneratorProps {
  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  isValidHttpUrl: (alias: string) => boolean;
}

export function QrCodeGenerator({ url, setUrl, isValidHttpUrl }: QrCodeGeneratorProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("")
  const [showQrCode, setShowQrCode] = useState(false) // New state to control QR code visibility
  const qrCodeRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const generateQrCodeImage = () => {
    if (qrCodeRef.current) {
      const svgElement = qrCodeRef.current.querySelector('svg');
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          setQrCodeDataUrl(canvas.toDataURL('image/png'));
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      }
    }
  };

  useEffect(() => {
    if (url && showQrCode) { // Only generate if URL is present and showQrCode is true
      generateQrCodeImage();
    }
  }, [url, showQrCode]); // Depend on showQrCode as well

  const handleGenerateQrCode = async () => {
    if (!isValidHttpUrl(url)){
      toast({
        title: "Invalid URL",
        description: "Please enter a valid http(s) link.",
        variant: "destructive",
      })
      return;
    }

    if (url) {
      setShowQrCode(true);
      // The QR code generation and copy to clipboard will now be handled by the useEffect hooks
    } else {
      toast({
        title: "Error",
        description: "Please enter a URL to generate a QR code.",
        variant: "destructive",
      });
    }
  };

  const downloadQrCode = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a');
      link.href = qrCodeDataUrl;
      link.download = 'qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: "QR Code Downloaded!",
        description: "The QR code has been downloaded successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "QR Code not available for download.",
        variant: "destructive",
      });
    }
  };

  const copyQrCodeToClipboard = async () => {
    if (qrCodeDataUrl) {
      try {
        const response = await fetch(qrCodeDataUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ]);
        toast({
          title: "QR Code Copied!",
          description: "The QR code has been copied to your clipboard.",
        });
      } catch (error) {
        console.error("Failed to copy QR code:", error);
        toast({
          title: "Error",
          description: "Failed to copy QR Code to clipboard.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "QR Code not available for copy.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full space-y-6 relative">
      {/* <div className="space-y-3"> */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleGenerateQrCode();
        }}
        className="space-y-3"
      >
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setShowQrCode(false); // Hide QR code when URL changes
          }}
          placeholder="Paste your long URL here..."
          className="w-full px-4 py-3 bg-gray-11/5 border border-gray-11/10 rounded-xl text-slate-12 placeholder:text-gray-9 focus:outline-none focus:ring-2 focus:ring-[#06B051]/20 focus:border-[#06B051]/30 transition-all"
          required
        />
        <button
          onClick={handleGenerateQrCode}
          disabled={!url}
          className="w-full bg-gradient-to-r from-[#06B051] to-[#05A049] hover:from-[#05A049] hover:to-[#049041] disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          Generate QR Code
        </button>
      </form>
      {/* </div> */}

      {showQrCode && url && ( // Only show QR code if showQrCode is true and URL is present
        <div className="relative bg-gradient-to-r from-[#06B051]/10 to-[#06B051]/20 dark:from-[#06B051]/10 dark:to-[#06B051]/20 border border-[#06B051]/30 dark:border-[#06B051]/30 rounded-xl p-4 flex flex-col items-center justify-center space-y-3 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
          <p className="text-xs text-[#06B051] dark:text-[#06B051] font-medium mb-1">QR Code for: {url}</p>
          <div ref={qrCodeRef} className="relative p-2 bg-white rounded-lg group">
            <QRCode value={url} size={180} />
            <button
              onClick={copyQrCodeToClipboard}
              disabled={!qrCodeDataUrl}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg cursor-pointer disabled:cursor-not-allowed"
              aria-label="Copy QR Code"
            >
              <Copy className="w-8 h-8" />
            </button>
          </div>
          <div className="flex w-full gap-2">
            <button
              onClick={downloadQrCode}
              disabled={!qrCodeDataUrl}
              className="flex-1 bg-gradient-to-r from-[#06B051] to-[#05A049] hover:from-[#05A049] hover:to-[#049041] disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download QR
            </button>
          </div>
          <button
            onClick={() => {
              setUrl("");
              setShowQrCode(false);
            }}
            className="absolute top-4 left-4 text-[#06B051] dark:text-[#06B051] hover:text-[#05A049] dark:hover:text-[#05A049] transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  )
}

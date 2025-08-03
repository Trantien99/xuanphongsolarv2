import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { X, Camera, Upload, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { t } from "@/lib/i18n";

interface VisualSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VisualSearchModal({ isOpen, onClose }: VisualSearchModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      toast({
        title: t("toastMessages.cameraError"),
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg");
        setSelectedImage(imageData);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const handleSearch = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    
    // Simulate visual search processing
    setTimeout(() => {
      setIsProcessing(false);
      onClose();
      toast({
        title: t("toastMessages.visualSearchComplete"),
        description: "Redirecting to search results...",
      });
      // In a real implementation, this would process the image and redirect to results
      setLocation("/products?visual_search=true");
    }, 2000);
  };

  const reset = () => {
    setSelectedImage(null);
    stopCamera();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Visual Search
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-gray-600">
            Upload a photo or take a picture of the product you're looking for. 
            Our AI will find similar items in our catalog.
          </p>

          {!selectedImage && !isCameraActive && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}>
                <CardContent className="p-6 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-medium mb-2">Upload Image</h3>
                  <p className="text-sm text-gray-600">
                    Choose a photo from your device
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={startCamera}>
                <CardContent className="p-6 text-center">
                  <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-medium mb-2">Take Photo</h3>
                  <p className="text-sm text-gray-600">
                    Use your camera to capture an image
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {isCameraActive && (
            <div className="space-y-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 object-cover rounded-lg bg-gray-100"
              />
              <div className="flex gap-2 justify-center">
                <Button onClick={capturePhoto}>
                  <Camera className="h-4 w-4 mr-2" />
                  Capture Photo
                </Button>
                <Button variant="outline" onClick={stopCamera}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {selectedImage && (
            <div className="space-y-4">
              <img
                src={selectedImage}
                alt="Selected for search"
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={handleSearch}
                  disabled={isProcessing}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search Products
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={reset}>
                  Try Another Image
                </Button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <canvas ref={canvasRef} className="hidden" />
        </div>
      </DialogContent>
    </Dialog>
  );
}

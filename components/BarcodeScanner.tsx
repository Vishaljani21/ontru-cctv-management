
import React, { useEffect, useRef, useState } from 'react';
import { CloseIcon } from './icons';

interface BarcodeScannerProps {
  onScanSuccess: (data: string) => void;
  onClose: () => void;
}

// A simple feature detection check for the BarcodeDetector API.
const isBarcodeDetectorSupported = 'BarcodeDetector' in window;

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScanSuccess, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Abort if the browser doesn't support the API.
    if (!isBarcodeDetectorSupported) {
      setError('Barcode Detector API is not supported in this browser.');
      return;
    }

    let stream: MediaStream | null = null;
    let animationFrameId: number | null = null;

    // The 'any' type is used here because BarcodeDetector is not yet in the default TS DOM libs.
    const barcodeDetector = new (window as any).BarcodeDetector({
      formats: ['code_128', 'ean_13', 'qr_code', 'upc_a', 'upc_e', 'itf']
    });

    const startScan = async () => {
      try {
        // Request access to the user's camera, preferring the rear camera.
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();

          // Continuously scan frames from the video feed.
          const scanFrame = async () => {
            if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) {
              return;
            }
            try {
              const barcodes = await barcodeDetector.detect(videoRef.current);
              if (barcodes.length > 0) {
                onScanSuccess(barcodes[0].rawValue);
                stopScan();
              } else {
                // Keep scanning if no barcode is found.
                animationFrameId = requestAnimationFrame(scanFrame);
              }
            } catch (err) {
              // Log detection errors but continue scanning.
              console.error('Error during barcode detection:', err);
              animationFrameId = requestAnimationFrame(scanFrame);
            }
          };
          
          scanFrame();
        }

      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Could not access camera. Please grant permission in your browser settings.');
      }
    };
    
    // Function to stop the camera stream and clean up resources.
    const stopScan = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    
    startScan();

    // Cleanup function runs when the component is unmounted.
    return () => {
      stopScan();
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <video ref={videoRef} className="absolute top-0 left-0 w-full h-full object-cover" playsInline />
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>
      
      <div className="relative z-10 flex flex-col items-center text-white space-y-4">
        <div className="w-[250px] h-[150px] md:w-[400px] md:h-[200px] shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] rounded-lg"></div>
        <p className="text-lg font-medium p-2 bg-black bg-opacity-50 rounded-md">Point camera at a barcode</p>
      </div>
      
      <button onClick={onClose} className="absolute top-4 right-4 text-white z-20 p-2 bg-black bg-opacity-50 rounded-full">
        <CloseIcon />
      </button>

      {error && (
        <div className="absolute bottom-10 z-20 p-4 bg-red-600 text-white rounded-md max-w-sm text-center">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
          <button onClick={onClose} className="mt-2 font-bold underline">Close</button>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;

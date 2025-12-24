import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

export interface SignaturePadRef {
  clear: () => void;
  getSignature: () => string | undefined;
}

const SignaturePad = forwardRef<SignaturePadRef>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  const getContext = () => canvasRef.current?.getContext('2d');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
        const rect = canvas.parentElement!.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = 200; // Fixed height

        const ctx = getContext();
        if (!ctx) return;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const getCoords = (event: MouseEvent | TouchEvent): [number, number] | null => {
      if (!canvasRef.current) return null;
      const rect = canvasRef.current.getBoundingClientRect();
      const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
      const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
      return [clientX - rect.left, clientY - rect.top];
  }

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const ctx = getContext();
    if (!ctx) return;
    const coords = getCoords(event.nativeEvent);
    if (!coords) return;
    const [x, y] = coords;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSigned(true);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    event.preventDefault();
    const ctx = getContext();
    if (!ctx) return;
    const coords = getCoords(event.nativeEvent);
    if (!coords) return;
    const [x, y] = coords;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    const ctx = getContext();
    if (!ctx) return;
    ctx.closePath();
    setIsDrawing(false);
  };

  useImperativeHandle(ref, () => ({
    clear: () => {
      const canvas = canvasRef.current;
      const ctx = getContext();
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSigned(false);
      }
    },
    getSignature: () => {
      const canvas = canvasRef.current;
      if (canvas && hasSigned) {
        // Return a trimmed, non-empty canvas to save space
        return canvas.toDataURL('image/png');
      }
      return undefined;
    }
  }));

  return (
    <div className="w-full h-[200px] bg-slate-50 border border-slate-300 rounded-md touch-none relative">
        <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full"
        />
        {!hasSigned && (
             <div className="absolute inset-0 flex items-center justify-center text-slate-400 pointer-events-none">
                Sign here
             </div>
        )}
    </div>
  );
});

export default SignaturePad;

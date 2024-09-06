import React, { useEffect, useRef } from 'react';

const CursorTrail = () => {
  const canvasRef = useRef(null);
  const cursorRef = useRef({ x: 0, y: 0 });
  const pointsRef = useRef([]);
  const cursorImageRef = useRef(null);

  useEffect(() => {
    console.log('CursorTrail effect running');
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Load stethoscope image
    const cursorImage = new Image();
    cursorImage.src = '/stethoscope.svg';
    cursorImage.onload = () => {
      console.log('Stethoscope image loaded');
      cursorImageRef.current = cursorImage;
    };
    cursorImage.onerror = (e) => {
      console.error('Error loading stethoscope image', e);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      console.log('Canvas resized', canvas.width, canvas.height);
    };

    const updateCursorPosition = (e) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pointsRef.current.push({ ...cursorRef.current });

      if (pointsRef.current.length > 50) {
        pointsRef.current.shift();
      }

      ctx.beginPath();
      ctx.moveTo(pointsRef.current[0].x, pointsRef.current[0].y);

      for (let i = 1; i < pointsRef.current.length; i++) {
        const point = pointsRef.current[i];
        ctx.lineTo(point.x, point.y);
      }

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Draw stethoscope cursor
      if (cursorImageRef.current) {
        ctx.drawImage(cursorImageRef.current, cursorRef.current.x - 12, cursorRef.current.y - 12, 24, 24);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', updateCursorPosition);

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', updateCursorPosition);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
      <style jsx global>{`
        body {
          cursor: none;
        }
      `}</style>
    </>
  );
};

export default CursorTrail;

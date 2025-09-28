import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import type { MediaFile } from '../types/chat';

interface MediaViewerProps {
  mediaFile: MediaFile;
  isOpen: boolean;
  onClose: () => void;
}

const ViewerOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(0.25em);
  animation: ${({ $isOpen }) => $isOpen ? 'fadeIn' : 'fadeOut'} 0.3s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;

const ViewerContainer = styled.div`
  position: relative;
  max-width: 95vw;
  max-height: 95vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1em;
  right: 1em;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  width: 3em;
  height: 3em;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.25rem;
  z-index: 10000;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: scale(1.1);
  }
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    width: 3.5em;
    height: 3.5em;
    top: 1.5em;
    right: 1.5em;
    font-size: 1.5rem;
  }
`;

const MediaContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  max-height: 100%;
`;

const FullscreenImage = styled.img<{ $scale: number; $translateX: number; $translateY: number }>`
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  cursor: ${({ $scale }) => $scale > 1 ? 'grab' : 'zoom-in'};
  transform: scale(${({ $scale }) => $scale}) translate(${({ $translateX }) => $translateX}px, ${({ $translateY }) => $translateY}px);
  transition: transform 0.2s ease;
  user-select: none;
  
  &:active {
    cursor: ${({ $scale }) => $scale > 1 ? 'grabbing' : 'zoom-in'};
  }
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    max-height: 85vh;
    touch-action: none;
  }
`;

const FullscreenVideo = styled.video`
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  outline: none;
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    max-height: 85vh;
    width: 100vw;
  }
`;

const ZoomControls = styled.div`
  position: absolute;
  bottom: 2em;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5em;
  background: rgba(0, 0, 0, 0.7);
  padding: 0.5em 1em;
  border-radius: 2em;
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    bottom: 3em;
    padding: 0.75em 1.25em;
  }
`;

const ZoomButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  width: 2.5em;
  height: 2.5em;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.25rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    width: 3em;
    height: 3em;
    font-size: 1.5rem;
  }
`;

const MediaInfo = styled.div`
  position: absolute;
  bottom: 1em;
  left: 1em;
  color: white;
  background: rgba(0, 0, 0, 0.7);
  padding: 0.5em 1em;
  border-radius: 1em;
  font-size: 0.875rem;
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    left: 50%;
    transform: translateX(-50%);
    bottom: 1.5em;
    font-size: 1rem;
  }
`;

export function MediaViewer({ mediaFile, isOpen, onClose }: MediaViewerProps) {
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset zoom when modal opens/closes or media changes
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setTranslateX(0);
      setTranslateY(0);
    }
  }, [isOpen, mediaFile.name]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      } else if (e.key === '0') {
        resetZoom();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  // Handle touch events for mobile
  useEffect(() => {
    let initialDistance = 0;
    let initialScale = 1;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        initialDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        initialScale = scale;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const currentDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const scaleChange = currentDistance / initialDistance;
        const newScale = Math.max(0.5, Math.min(5, initialScale * scaleChange));
        setScale(newScale);
      }
    };

    if (isOpen && imageRef.current) {
      imageRef.current.addEventListener('touchstart', handleTouchStart);
      imageRef.current.addEventListener('touchmove', handleTouchMove);
      
      return () => {
        if (imageRef.current) {
          imageRef.current.removeEventListener('touchstart', handleTouchStart);
          imageRef.current.removeEventListener('touchmove', handleTouchMove);
        }
      };
    }
  }, [isOpen, scale]);

  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.5, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 0.5, 0.5));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
  }, []);

  const handleImageClick = useCallback(() => {
    if (scale === 1) {
      handleZoomIn();
    } else {
      resetZoom();
    }
  }, [scale, handleZoomIn, resetZoom]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  }, [scale]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;
      setTranslateX(prev => prev + deltaX);
      setTranslateY(prev => prev + deltaY);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, scale, lastMousePos]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const isImage = mediaFile.type.startsWith('image/');
  const isVideo = mediaFile.type.startsWith('video/');

  if (!isOpen) return null;

  return (
    <ViewerOverlay $isOpen={isOpen} onClick={handleOverlayClick}>
      <ViewerContainer>
        <CloseButton onClick={onClose}>×</CloseButton>
        
        <MediaContainer>
          {isImage && (
            <>
              <FullscreenImage
                ref={imageRef}
                src={mediaFile.url}
                alt={mediaFile.name}
                $scale={scale}
                $translateX={translateX}
                $translateY={translateY}
                onClick={handleImageClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                draggable={false}
              />
              <ZoomControls>
                <ZoomButton onClick={handleZoomOut} disabled={scale <= 0.5}>
                  −
                </ZoomButton>
                <ZoomButton onClick={resetZoom}>
                  ⌂
                </ZoomButton>
                <ZoomButton onClick={handleZoomIn} disabled={scale >= 5}>
                  +
                </ZoomButton>
              </ZoomControls>
            </>
          )}
          
          {isVideo && (
            <FullscreenVideo
              src={mediaFile.url}
              controls
              autoPlay
              playsInline
              onLoadStart={() => console.log('Video loading started')}
              onError={(e) => console.error('Video error:', e)}
            />
          )}
        </MediaContainer>

        <MediaInfo>
          {mediaFile.name} • {(mediaFile.size / 1024 / 1024).toFixed(1)} MB
        </MediaInfo>
      </ViewerContainer>
    </ViewerOverlay>
  );
}
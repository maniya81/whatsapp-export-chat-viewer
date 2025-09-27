import { useState, useRef, useEffect, memo, useCallback } from 'react';
import styled from 'styled-components';
import type { MediaFile } from '../types/chat';

const MediaContainer = styled.div`
  max-width: 300px;
  margin: 8px 0;
  border-radius: 12px;
  overflow: hidden;
  background: #f0f2f5;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  display: block;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const Video = styled.video`
  width: 100%;
  height: auto;
  display: block;
  outline: none;
`;

const AudioContainer = styled.div`
  background: #dcf8c6;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 56px;
`;

const Audio = styled.audio`
  flex: 1;
  height: 32px;

  &::-webkit-media-controls-panel {
    background-color: transparent;
  }
`;

const DocumentContainer = styled.div`
  background: #e3f2fd;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #bbdefb;
  }
`;

const DocumentIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #2196f3;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 12px;
`;

const DocumentInfo = styled.div`
  flex: 1;
`;

const DocumentName = styled.div`
  font-weight: 500;
  color: #1976d2;
  font-size: 14px;
`;

const DocumentSize = styled.div`
  color: #666;
  font-size: 12px;
  margin-top: 2px;
`;

const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid #e0e0e0;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  padding: 12px 16px;
  background: #ffebee;
  color: #c62828;
  font-size: 14px;
  border-radius: 8px;
`;

const FullscreenModal = styled.div<{ show: boolean }>`
  display: ${props => props.show ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  align-items: center;
  justify-content: center;
`;

const FullscreenImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 24px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

interface MediaDisplayProps {
  mediaFile: MediaFile;
  caption?: string;
}

const MediaDisplay = memo(({ mediaFile, caption }: MediaDisplayProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleImageLoad = useCallback(() => {
    setLoading(false);
    setError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setLoading(false);
    setError(true);
  }, []);

  const handleFullscreenToggle = useCallback(() => {
    setShowFullscreen(prev => !prev);
  }, []);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const getDocumentExtension = useCallback((filename: string): string => {
    const ext = filename.split('.').pop()?.toUpperCase();
    return ext || 'DOC';
  }, []);

  if (!mediaFile.url) {
    return <ErrorMessage>Media file not available</ErrorMessage>;
  }

  const renderMedia = () => {
    // Only render media if it's intersecting (lazy loading)
    if (!isIntersecting) {
      return (
        <div style={{ 
          width: '300px', 
          height: '200px', 
          background: '#f0f2f5', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#666'
        }}>
          Loading media...
        </div>
      );
    }

    switch (mediaFile.type) {
      case 'image':
        return (
          <>
            {loading && <LoadingSpinner />}
            {error ? (
              <ErrorMessage>Failed to load image</ErrorMessage>
            ) : (
              <Image
                src={mediaFile.url}
                alt={mediaFile.name}
                onLoad={handleImageLoad}
                onError={handleImageError}
                onClick={handleFullscreenToggle}
                style={{ display: loading ? 'none' : 'block' }}
                loading="lazy"
              />
            )}
            <FullscreenModal show={showFullscreen} onClick={handleFullscreenToggle}>
              <FullscreenImage src={mediaFile.url} alt={mediaFile.name} />
              <CloseButton onClick={handleFullscreenToggle}>×</CloseButton>
            </FullscreenModal>
          </>
        );

      case 'video':
        return (
          <Video
            src={mediaFile.url}
            controls
            preload="metadata"
            onLoadStart={() => setLoading(true)}
            onLoadedMetadata={() => setLoading(false)}
            onError={handleImageError}
          >
            Your browser does not support the video tag.
          </Video>
        );

      case 'audio':
        return (
          <AudioContainer>
            <Audio
              src={mediaFile.url}
              controls
              preload="metadata"
              onLoadStart={() => setLoading(true)}
              onLoadedMetadata={() => setLoading(false)}
              onError={handleImageError}
            >
              Your browser does not support the audio element.
            </Audio>
          </AudioContainer>
        );

      case 'document':
      default:
        return (
          <DocumentContainer onClick={() => window.open(mediaFile.url, '_blank')}>
            <DocumentIcon>
              {getDocumentExtension(mediaFile.name)}
            </DocumentIcon>
            <DocumentInfo>
              <DocumentName>{mediaFile.name}</DocumentName>
              <DocumentSize>{formatFileSize(mediaFile.size)}</DocumentSize>
            </DocumentInfo>
          </DocumentContainer>
        );
    }
  };

  return (
    <MediaContainer ref={containerRef}>
      {renderMedia()}
      {caption && (
        <div style={{ 
          padding: '8px 12px', 
          fontSize: '14px', 
          color: '#666',
          background: '#f8f9fa',
          borderTop: '1px solid #e9ecef' 
        }}>
          {caption}
        </div>
      )}
    </MediaContainer>
  );
});

MediaDisplay.displayName = 'MediaDisplay';

export { MediaDisplay };
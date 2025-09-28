import { useState, useRef, useEffect, memo, useCallback } from 'react';
import styled from 'styled-components';
import type { MediaFile } from '../types/chat';
import { MediaViewer } from './MediaViewer';

const MediaContainer = styled.div`
  max-width: 18.75em;
  margin: 0.5em 0;
  border-radius: 0.75em;
  overflow: hidden;
  background: #f0f2f5;
  font-size: 16px;
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    max-width: 85vw;
    font-size: 18px;
  }

  @media (max-width: 480px) {
    max-width: 90vw;
    font-size: 17px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  display: block;
  cursor: pointer;
  transition: transform 0.2s ease;
  position: relative;

  &:hover {
    transform: scale(1.02);
  }
  
  &::after {
    content: '🔍';
    position: absolute;
    top: 0.5em;
    right: 0.5em;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 0.25em 0.5em;
    border-radius: 0.5em;
    font-size: 0.875em;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  &:hover::after {
    opacity: 1;
  }
`;

const Video = styled.video`
  width: 100%;
  height: auto;
  display: block;
  outline: none;
  cursor: pointer;
  position: relative;
  
  &:hover {
    filter: brightness(1.1);
  }
`;

const AudioContainer = styled.div`
  background: #dcf8c6;
  padding: 0.75em 1em;
  display: flex;
  align-items: center;
  gap: 0.75em;
  min-height: 3.5em;
`;

const Audio = styled.audio`
  flex: 1;
  height: 2em;

  &::-webkit-media-controls-panel {
    background-color: transparent;
  }
`;

const DocumentContainer = styled.div`
  background: #e3f2fd;
  padding: 0.75em 1em;
  display: flex;
  align-items: center;
  gap: 0.75em;
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

interface MediaDisplayProps {
  mediaFile: MediaFile;
  caption?: string;
}

const MediaDisplay = memo(({ mediaFile, caption }: MediaDisplayProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(true); // Force true for debugging
  const containerRef = useRef<HTMLDivElement>(null);

  // Debug logging
  console.log("MediaDisplay component rendering:", {
    name: mediaFile.name,
    type: mediaFile.type,
    url: mediaFile.url,
    hasUrl: !!mediaFile.url
  });

  // Intersection Observer for lazy loading - DISABLED FOR DEBUGGING
  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       if (entry.isIntersecting) {
  //         setIsIntersecting(true);
  //         observer.disconnect();
  //       }
  //     },
  //     { threshold: 0.1 }
  //   );

  //   if (containerRef.current) {
  //     observer.observe(containerRef.current);
  //   }

  //   return () => observer.disconnect();
  // }, []);

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
    // Debug logging for intersection state
    console.log(`MediaDisplay renderMedia for ${mediaFile.name}:`, {
      isIntersecting,
      loading,
      error,
      mediaType: mediaFile.type
    });

    // TEMPORARY: Bypass lazy loading to test if intersection observer is the issue
    // if (!isIntersecting) {
    //   return (
    //     <div style={{ 
    //       width: '300px', 
    //       height: '200px', 
    //       background: '#f0f2f5', 
    //       display: 'flex', 
    //       alignItems: 'center', 
    //       justifyContent: 'center',
    //       color: '#666'
    //     }}>
    //       Loading media...
    //     </div>
    //   );
    // }

    switch (mediaFile.type) {
      case 'image':
        console.log(`Rendering image case for ${mediaFile.name}:`, {
          url: mediaFile.url,
          loading,
          error
        });
        console.log(`BLOB URL DEBUG for ${mediaFile.name}:`, mediaFile.url);
        
        // Test if blob URL is valid by trying to fetch a small portion
        if (mediaFile.url && mediaFile.url.startsWith('blob:')) {
          console.log(`Testing blob URL for ${mediaFile.name}...`);
          fetch(mediaFile.url)
            .then(response => {
              console.log(`Blob URL test for ${mediaFile.name}:`, response.ok ? 'SUCCESS' : 'FAILED', response.status, `Content-Type: ${response.headers.get('content-type')}`);
              return response.blob();
            })
            .then(blob => {
              console.log(`Full blob size for ${mediaFile.name}:`, blob.size, `Type: ${blob.type}`);
            })
            .catch(err => {
              console.error(`Blob URL test failed for ${mediaFile.name}:`, err);
            });
        }
        return (
          <>
            {loading && <LoadingSpinner />}
            {error ? (
              <ErrorMessage>Failed to load image</ErrorMessage>
            ) : (
              <Image
                src={mediaFile.url}
                alt={mediaFile.name}
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement;
                  console.log(`🎉 Image loaded successfully: ${mediaFile.name}`, {
                    naturalWidth: img.naturalWidth,
                    naturalHeight: img.naturalHeight,
                    src: img.src
                  });
                  handleImageLoad();
                }}
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  console.error(`❌ Image failed to load: ${mediaFile.name}`, {
                    src: img.src,
                    error: e
                  });
                  handleImageError();
                }}
                onClick={handleFullscreenToggle}
                style={{ 
                  display: loading ? 'none' : 'block',
                  border: '2px solid red', // Temporary debugging border
                  minWidth: '100px',
                  minHeight: '100px'
                }}
              />
            )}
            <MediaViewer 
              mediaFile={mediaFile}
              isOpen={showFullscreen}
              onClose={() => setShowFullscreen(false)}
            />
          </>
        );

      case 'video':
        return (
          <>
            <Video
              src={mediaFile.url}
              controls
              preload="metadata"
              onLoadStart={() => setLoading(true)}
              onLoadedMetadata={() => setLoading(false)}
              onError={handleImageError}
              onClick={handleFullscreenToggle}
            >
              Your browser does not support the video tag.
            </Video>
            <MediaViewer 
              mediaFile={mediaFile}
              isOpen={showFullscreen}
              onClose={() => setShowFullscreen(false)}
            />
          </>
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
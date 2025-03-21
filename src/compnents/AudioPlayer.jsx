import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { FaPlay, FaStop, FaSpinner } from 'react-icons/fa';

const AudioPlayer = ({ audioUrl }) => {
  const waveformRef = useRef(null);
  const [waveSurfer, setWaveSurfer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!waveformRef.current) return; // Ensure container exists

    // Create WaveSurfer instance with your preferred configuration
    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#D9DCFF',
      progressColor: '#4353FF',
      height: 100,
      barWidth: 2,
    });
    setWaveSurfer(ws);

    // Function to fetch audio as a blob and load into WaveSurfer
    const fetchAudioAsBlob = async () => {
      try {
        const response = await fetch(audioUrl, { mode: 'cors' });
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        ws.load(blobUrl);
      } catch (err) {
        console.error('Error fetching audio:', err);
        setError('Error loading audio');
        setLoading(false);
      }
    };

    fetchAudioAsBlob();

    // WaveSurfer event listeners
    ws.on('ready', () => {
      setLoading(false);
      console.log('Audio is ready for playback');
    });

    ws.on('error', (err) => {
      console.error('WaveSurfer error:', err);
      setError('Error loading audio');
      setLoading(false);
    });

    ws.on('finish', () => {
      setIsPlaying(false);
    });

    // Cleanup when the component unmounts or audioUrl changes
    return () => {
      ws.destroy();
    };
  }, [audioUrl]);

  // Toggle play/pause
  const handlePlayPause = () => {
    if (!waveSurfer) return;
    waveSurfer.playPause();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="audio-player" style={{ position: 'relative', marginTop: '20px' }}>
      <div ref={waveformRef} style={{ width: '100%', border: '1px solid #ddd', borderRadius: '4px' }} />
      {loading && (
        <div
          className="loading-overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FaSpinner className="spinner" style={{ animation: 'spin 1s linear infinite', fontSize: '2rem', color: '#FF0000' }} />
        </div>
      )}
      {error && (
        <div
          className="error-overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>
        </div>
      )}
      {!loading && !error && (
        <button
          onClick={handlePlayPause}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#FF0000',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          {isPlaying ? <FaStop /> : <FaPlay />}
          {isPlaying ? 'Stop' : 'Play'}
        </button>
      )}
    </div>
  );
};

export default AudioPlayer;

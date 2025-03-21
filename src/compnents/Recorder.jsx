import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';
import { FaMicrophone, FaStop, FaPause, FaPlay } from 'react-icons/fa';

const AudioRecorder = ({ audioBlob, setAudioBlob }) => {
  const [wavesurfer, setWavesurfer] = useState(null);
  const [recordPlugin, setRecordPlugin] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState('00:00');

  const micRef = useRef(null);
  const playbackRef = useRef(null);
  const playbackWavesurfer = useRef(null);

  const createGradient = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 30, 0);
    gradient.addColorStop(0, '#e11d48');
    gradient.addColorStop(0.33, '#ffffff');
    gradient.addColorStop(0.66, '#3b82f6');
    gradient.addColorStop(1, '#e11d48');
    return gradient;
  };

  useEffect(() => {
    if (wavesurfer) wavesurfer.destroy();
    const ws = WaveSurfer.create({
      container: micRef.current,
      waveColor: createGradient(),
      progressColor: '#e11d48',
      backgroundColor: '#fef2f2',
      cursorColor: '#e11d48',
      barWidth: 2,
      barGap: 1.5,
      responsive: true,
      height: 80,
    });

    const rec = ws.registerPlugin(
      RecordPlugin.create({
        renderRecordedAudio: false,
        scrollingWaveform: false,
      })
    );

    rec.on('record-end', (blob) => {
      setAudioBlob(blob);
      setIsRecording(false);
      setIsPaused(false);
    });

    rec.on('record-progress', (time) => {
      const formattedTime = [
        Math.floor((time % 3600000) / 60000),
        Math.floor((time % 60000) / 1000),
      ]
        .map((v) => (v < 10 ? '0' + v : v))
        .join(':');
      setProgress(formattedTime);
    });

    setWavesurfer(ws);
    setRecordPlugin(rec);

    return () => ws.destroy();
  }, []);

  useEffect(() => {
    if (audioBlob && playbackRef.current) {
      if (playbackWavesurfer.current) {
        playbackWavesurfer.current.destroy();
      }
      const preview = WaveSurfer.create({
        container: playbackRef.current,
        waveColor: createGradient(),
        progressColor: '#e11d48',
        backgroundColor: '#fff',
        cursorColor: '#e11d48',
        barWidth: 2,
        barGap: 1.5,
        responsive: true,
        height: 80,
      });

      preview.loadBlob(audioBlob);
      preview.on('finish', () => setIsPlaying(false));
      playbackWavesurfer.current = preview;
    }
  }, [audioBlob]);

  const handleRecord = () => {
    if (!recordPlugin) return;
    if (isRecording || isPaused) {
      recordPlugin.stopRecording();
    } else {
      recordPlugin.startRecording().then(() => {
        setIsRecording(true);
        setAudioBlob(null);
      });
    }
  };

  const handlePause = () => {
    if (!recordPlugin) return;
    if (recordPlugin.isPaused()) {
      recordPlugin.resumeRecording();
      setIsPaused(false);
    } else {
      recordPlugin.pauseRecording();
      setIsPaused(true);
    }
  };

  const togglePlayback = () => {
    if (!playbackWavesurfer.current) return;
    playbackWavesurfer.current.playPause();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-6">
      {/* Recorder */}
      <div className="bg-white shadow-2xl rounded-2xl p-6 space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-red-600 flex items-center gap-2">
            <FaMicrophone /> Audio Recorder
          </h1>
          <p className="text-gray-500 text-sm">Progress: {progress}</p>
        </header>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleRecord}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full hover:scale-105 hover:bg-red-700 transition-all"
          >
            {isRecording || isPaused ? (
              <>
                <FaStop size={20} /> Stop
              </>
            ) : (
              <>
                <FaMicrophone size={20} /> Record
              </>
            )}
          </button>
          {isRecording && (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 bg-white text-red-600 border border-red-600 px-6 py-3 rounded-full hover:scale-105 hover:bg-red-50 transition-all"
            >
              {isPaused ? (
                <>
                  <FaPlay size={20} /> Resume
                </>
              ) : (
                <>
                  <FaPause size={20} /> Pause
                </>
              )}
            </button>
          )}
        </div>

        <div
          ref={micRef}
          className="border border-dashed border-red-400 rounded-xl bg-red-50 p-2 mt-4"
        ></div>
      </div>

      {/* Playback */}
      {audioBlob && (
        <div className="bg-white shadow-2xl rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-red-600">Playback</h2>
          <div
            ref={playbackRef}
            className="border border-dashed border-red-400 rounded-xl bg-white p-2"
          ></div>
          <div className="flex justify-center">
            <button
              onClick={togglePlayback}
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full hover:scale-105 hover:bg-red-700 transition-all"
            >
              {isPlaying ? (
                <>
                  <FaPause size={20} /> Pause
                </>
              ) : (
                <>
                  <FaPlay size={20} /> Play
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;

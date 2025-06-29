import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';
import { FaMicrophone, FaStop, FaPause, FaPlay } from 'react-icons/fa';

const AudioRecorder = ({ audioBlob, setAudioBlob, question }) => {
  const [wavesurfer, setWavesurfer] = useState(null);
  const [recordPlugin, setRecordPlugin] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  // We'll track the current recorded time in milliseconds.
  const [currentMs, setCurrentMs] = useState(0);
  // Countdown (time remaining) formatted as mm:ss.
  const [countdown, setCountdown] = useState("03:00");

  const micRef = useRef(null);
  const playbackRef = useRef(null);
  const playbackWavesurfer = useRef(null);

  const TOTAL_TIME_MS = 180000; // 3 minutes in milliseconds

  // Create a gradient for the waveform.
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

    // Register record plugin.
    const rec = ws.registerPlugin(
      RecordPlugin.create({
        renderRecordedAudio: false,
        scrollingWaveform: false,
      })
    );

    // When recording ends, set the audio blob and reset states.
    rec.on('record-end', (blob) => {
      setAudioBlob(blob);
      setIsRecording(false);
      setIsPaused(false);
    });

    // Update progress – here we use the elapsed time to compute countdown.
    rec.on('record-progress', (time) => {
      // 'time' is in milliseconds.
      setCurrentMs(time);
      // Calculate remaining time.
      const remainingMs = Math.max(TOTAL_TIME_MS - time, 0);
      const minutes = Math.floor(remainingMs / 60000);
      const seconds = Math.floor((remainingMs % 60000) / 1000);
      const formatted = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
      setCountdown(formatted);
      // Optionally, you can auto-stop when the limit is reached.
      if (remainingMs === 0 && isRecording) {
        rec.stopRecording();
      }
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
      // Reset previous recording data before starting a new recording.
      setAudioBlob(null);
      setCurrentMs(0);
      setCountdown("03:00");
      recordPlugin.startRecording().then(() => {
        setIsRecording(true);
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
  useEffect(() => {
    // Reset countdown and recorded time when question changes
    setCurrentMs(0);
    setCountdown("03:00");
    setAudioBlob(null); // Optional: clear previous audio if needed
  }, [question]);

  return (
    <div className="space-y-6">
      {/* Recorder */}
      <div className="bg-white shadow-2xl rounded-2xl p-6 space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-sm font-bold text-blue-600 flex items-center gap-2">
            <FaMicrophone /> Audio Recorder
          </h1>
          <p className="text-gray-500 text-sm">Time Left: {countdown}</p>
        </header>

        {/* Countdown Progress Bar */}


        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={handleRecord}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full hover:scale-105 hover:bg-blue-700 transition-all"
          >
            {isRecording || isPaused ? (
              <>
                <FaStop size={15} /> Stop
              </>
            ) : (
              <>
                <FaMicrophone size={15} /> Record
              </>
            )}
          </button>
          {isRecording && (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-full hover:scale-105 hover:bg-blue-50 transition-all"
            >
              {isPaused ? (
                <>
                  <FaPlay size={15} /> Resume
                </>
              ) : (
                <>
                  <FaPause size={15} /> Pause
                </>
              )}
            </button>
          )}
        </div>

        <div
          ref={micRef}
          className="border border-dashed border-blue-400 rounded-xl bg-blue-50 p-2 mt-4"
        ></div>
      </div>

      {/* Playback */}
      {audioBlob && (
        <div className="bg-white shadow-2xl rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-blue-600">Playback</h2>
          <div
            ref={playbackRef}
            className="border border-dashed border-blue-400 rounded-xl bg-white p-2"
          ></div>
          <div className="flex justify-center">
            <button
              onClick={togglePlayback}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full hover:scale-105 hover:bg-blue-700 transition-all"
            >
              {isPlaying ? (
                <>
                  <FaPause size={15} /> Pause
                </>
              ) : (
                <>
                  <FaPlay size={15} /> Play
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

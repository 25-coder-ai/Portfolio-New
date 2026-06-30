import { useCallback, useEffect, useRef } from "react";

/**
 * Loads and plays the mechanical keycap press / release samples used by the
 * keyboard. Trimmed from the original portfolio's larger sound hook to only the
 * two sounds the keyboard needs.
 *
 * Expects these files to be served at the given URLs (see README):
 *   /assets/keycap-sounds/press.mp3
 *   /assets/keycap-sounds/release.mp3
 */
export const useKeycapSounds = (
  pressUrl = "/assets/keycap-sounds/press.mp3",
  releaseUrl = "/assets/keycap-sounds/release.mp3"
) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const pressBufferRef = useRef<AudioBuffer | null>(null);
  const releaseBufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    const loadSound = async () => {
      try {
        const Ctor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!Ctor) return;

        const ctx = new Ctor();
        audioContextRef.current = ctx;

        const press = await fetch(pressUrl).then((r) => r.arrayBuffer());
        pressBufferRef.current = await ctx.decodeAudioData(press);

        const release = await fetch(releaseUrl).then((r) => r.arrayBuffer());
        releaseBufferRef.current = await ctx.decodeAudioData(release);
      } catch (error) {
        console.error("Failed to load keycap sound", error);
      }
    };

    loadSound();
    return () => {
      audioContextRef.current?.close();
    };
  }, [pressUrl, releaseUrl]);

  const getContext = useCallback(() => {
    if (audioContextRef.current?.state === "suspended") {
      audioContextRef.current.resume().catch(() => {});
    }
    return audioContextRef.current;
  }, []);

  const playSoundBuffer = useCallback(
    (buffer: AudioBuffer | null, baseDetune = 0) => {
      try {
        const ctx = getContext();
        if (!ctx || !buffer) return;

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        // Slight random pitch variation so repeated keys don't sound identical.
        source.detune.value = baseDetune + Math.random() * 200 - 100;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.4;

        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start(0);
      } catch (err) {
        console.error(err);
      }
    },
    [getContext]
  );

  const playPressSound = useCallback(
    () => playSoundBuffer(pressBufferRef.current),
    [playSoundBuffer]
  );
  const playReleaseSound = useCallback(
    () => playSoundBuffer(releaseBufferRef.current),
    [playSoundBuffer]
  );

  return { playPressSound, playReleaseSound };
};

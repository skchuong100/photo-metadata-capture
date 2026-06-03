import { useCallback, useEffect, useState } from 'react';
import {
  clearPhotoCaptures,
  deletePhotoCapture,
  getPhotoCaptures,
  savePhotoCapture,
} from '../lib/photoCaptureDb';
import type { CreatePhotoCaptureInput, PhotoCapture } from '../types/photoCapture';

function sortByNewest(captures: PhotoCapture[]) {
  return [...captures].sort(
    (firstCapture, secondCapture) =>
      new Date(secondCapture.capturedAt).getTime() -
      new Date(firstCapture.capturedAt).getTime()
  );
}

export default function usePhotoCaptures() {
  const [captures, setCaptures] = useState<PhotoCapture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCaptures = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const storedCaptures = await getPhotoCaptures();
      setCaptures(storedCaptures);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load saved photo captures.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addCapture = useCallback(async (input: CreatePhotoCaptureInput) => {
    const capture: PhotoCapture = {
      ...input,
      savedAt: new Date().toISOString(),
    };

    await savePhotoCapture(capture);
    setCaptures(currentCaptures => sortByNewest([capture, ...currentCaptures]));

    return capture;
  }, []);

  const removeCapture = useCallback(async (id: string) => {
    await deletePhotoCapture(id);
    setCaptures(currentCaptures =>
      currentCaptures.filter(capture => capture.id !== id)
    );
  }, []);

  const clearCaptures = useCallback(async () => {
    await clearPhotoCaptures();
    setCaptures([]);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialCaptures() {
      try {
        setIsLoading(true);
        setError(null);
        const storedCaptures = await getPhotoCaptures();

        if (isMounted) {
          setCaptures(storedCaptures);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Unable to load saved photo captures.'
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadInitialCaptures();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    captures,
    isLoading,
    error,
    addCapture,
    removeCapture,
    clearCaptures,
    loadCaptures,
  };
}

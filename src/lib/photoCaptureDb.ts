import type { PhotoCapture } from '../types/photoCapture';

const dbName = 'photo-metadata-capture';
const dbVersion = 1;
const photoCapturesStoreName = 'photoCaptures';

function isIndexedDbSupported() {
  return typeof window !== 'undefined' && 'indexedDB' in window;
}

function openPhotoCaptureDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (!isIndexedDbSupported()) {
      reject(new Error('IndexedDB is not supported in this browser.'));
      return;
    }

    const request = window.indexedDB.open(dbName, dbVersion);

    request.onerror = () => {
      reject(request.error ?? new Error('Unable to open IndexedDB.'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(photoCapturesStoreName)) {
        const store = db.createObjectStore(photoCapturesStoreName, {
          keyPath: 'id',
        });

        store.createIndex('capturedAt', 'capturedAt', { unique: false });
        store.createIndex('savedAt', 'savedAt', { unique: false });
      }
    };
  });
}

function readAllFromStore<T>(store: IDBObjectStore) {
  return new Promise<T[]>((resolve, reject) => {
    const request = store.getAll();

    request.onerror = () => {
      reject(request.error ?? new Error('Unable to read from IndexedDB.'));
    };

    request.onsuccess = () => {
      resolve(request.result as T[]);
    };
  });
}

function waitForWriteTransaction(transaction: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      reject(transaction.error ?? new Error('Unable to write to IndexedDB.'));
    };

    transaction.onabort = () => {
      reject(transaction.error ?? new Error('IndexedDB write was cancelled.'));
    };
  });
}

export async function getPhotoCaptures() {
  const db = await openPhotoCaptureDb();

  try {
    const transaction = db.transaction(photoCapturesStoreName, 'readonly');
    const store = transaction.objectStore(photoCapturesStoreName);
    const captures = await readAllFromStore<PhotoCapture>(store);

    return captures.sort(
      (firstCapture, secondCapture) =>
        new Date(secondCapture.capturedAt).getTime() -
        new Date(firstCapture.capturedAt).getTime()
    );
  } finally {
    db.close();
  }
}

export async function savePhotoCapture(capture: PhotoCapture) {
  const db = await openPhotoCaptureDb();

  try {
    const transaction = db.transaction(photoCapturesStoreName, 'readwrite');
    const store = transaction.objectStore(photoCapturesStoreName);
    store.put(capture);
    await waitForWriteTransaction(transaction);
  } finally {
    db.close();
  }
}

export async function deletePhotoCapture(id: string) {
  const db = await openPhotoCaptureDb();

  try {
    const transaction = db.transaction(photoCapturesStoreName, 'readwrite');
    const store = transaction.objectStore(photoCapturesStoreName);
    store.delete(id);
    await waitForWriteTransaction(transaction);
  } finally {
    db.close();
  }
}

export async function clearPhotoCaptures() {
  const db = await openPhotoCaptureDb();

  try {
    const transaction = db.transaction(photoCapturesStoreName, 'readwrite');
    const store = transaction.objectStore(photoCapturesStoreName);
    store.clear();
    await waitForWriteTransaction(transaction);
  } finally {
    db.close();
  }
}

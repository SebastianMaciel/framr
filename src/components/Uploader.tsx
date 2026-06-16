"use client";

import { useCallback, useRef, useState } from "react";
import styles from "./Uploader.module.css";

type Props = {
  onImage: (file: File) => void;
};

export default function Uploader({ onImage }: Props) {
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const accept = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setError("THAT'S NOT AN IMAGE.");
        return;
      }
      setError(null);
      onImage(file);
    },
    [onImage],
  );

  const openPicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div
      role="button"
      tabIndex={0}
      className={`${styles.dropzone} ${drag ? styles.dragging : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        accept(e.dataTransfer.files[0]);
      }}
      onClick={openPicker}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openPicker();
        }
      }}
    >
      <label htmlFor="file-input" className={styles.kicker}>
        01 / SOURCE.
      </label>
      <input
        id="file-input"
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.input}
        aria-label="Image file"
        tabIndex={-1}
        onChange={(e) => accept(e.target.files?.[0])}
      />
      <h1 className={styles.headline}>
        DROP.
        <br />
        AN.
        <br />
        IMAGE.
      </h1>
      <p className={styles.cta}>
        <span className={styles.ctaArrow} aria-hidden="true">
          ↓
        </span>
        DRAG IT IN. OR CLICK ANYWHERE.
      </p>
      <p id="upload-specs" className={styles.specs}>
        PNG · JPG · WEBP &nbsp;&nbsp;|&nbsp;&nbsp; STAYS IN YOUR BROWSER.
      </p>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}

"use client";
import styles from "./page.module.css";
import { useState } from "react";

export default function Home() {
  const [fileInfo, setFileInfo] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileInfo({
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Exercise Tracker</h1>
      <form
        className={styles.form}
        method="POST"
        action="/api/fileanalyse"
        encType="multipart/form-data"
      >
        <input
          className={styles.input}
          type="file"
          name="upfile"
          onChange={handleFileChange}
        />
        {fileInfo && (
          <div>
            <p>Name: {fileInfo.name}</p>
            <p>Size: {fileInfo.size} bytes</p>
            <p>Type: {fileInfo.type}</p>
          </div>
        )}
        <button className={styles.button} type="submit">
          Submit File
        </button>
      </form>
    </div>
  );
}

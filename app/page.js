"use client";
import styles from "./page.module.css";
import { useState } from "react";
export default function Home() {
  const [url, setUrl] = useState("");


  return (
    <div className={styles.page}>
      <h1 className={styles.title}>URL shortner Microservice</h1>
      <form className={styles.form} method="POST" action="/api/shorturl">
        <input
          className={styles.input}
          type="url"
          name="url"
          placeholder="Enter URL to shorten"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button className={styles.button} type="submit">
          Shorten
        </button>
      </form>
    </div>
  );
}

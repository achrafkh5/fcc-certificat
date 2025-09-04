"use client";
import styles from "./page.module.css";
import { useState } from "react";
export default function Home() {
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Exercise Tracker</h1>
      <form className={styles.form} method="POST" action="/api/users">
        <input
          className={styles.input}
          type="text"
          name="username"
          placeholder="Enter userName"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className={styles.button} type="submit">
          submit user
        </button>
      </form>
      <input type="text"placeholder="Enter user ID" value={id} onChange={(e) => setId(e.target.value)} style={{marginTop:"-200px"}}/>
      <form className={styles.form} style={{display:"flex",flexDirection:"column",gap:"20px",marginTop:"-150px"}} method="POST" action={`/api/users/${id}/exercises`}>
        <input
          className={styles.input}
          type="text"
          name="description"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className={styles.input}
          type="number"
          name="duration"
          placeholder="Enter duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <input
          className={styles.input}
          type="date"
          name="date"
          placeholder="Enter date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button className={styles.button} type="submit">
          submit user
        </button>
      </form>
    </div>
  );
}

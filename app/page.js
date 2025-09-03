"use client";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/shorturl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>URL Shortener Microservice</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit">Shorten</button>
      </form>
      {result && (
        <div>
          {result.error ? (
            <p>Error: {result.error}</p>
          ) : (
            <p>
              Short URL: <a href={`/api/shorturl/${result.short_url}`}>{result.short_url}</a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

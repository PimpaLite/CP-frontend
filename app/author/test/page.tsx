"use client";
import { useState, ChangeEvent } from "react";

export default function TestUpload() {
  const [image, setImage] = useState<string | null>(null);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create memory link
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div style={{ padding: '50px' }}>
      <h1>Upload Isolation Test</h1>
      
      <input type="file" accept="image/*" onChange={handleUpload} />
      
      <hr style={{ margin: '20px 0' }} />
      
      {image ? (
        <div style={{ border: '5px solid red', padding: '10px' }}>
          <p>If you see a red box but no image, CSP or Global CSS is blocking it!</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="Test" style={{ maxWidth: '500px', display: 'block' }} />
        </div>
      ) : (
        <p>Waiting for file...</p>
      )}
    </div>
  );
}
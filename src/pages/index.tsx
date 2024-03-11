// pages/editor.js

import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { io, Socket } from "socket.io-client";
const SERVER_URL = "http://localhost:8080";

export default function Home() {
  const [content, setContent] = useState("");
  const ydocRef = useRef<Y.Doc | null>(null);
  const socketRef = useRef<Socket | null>(null);
  useEffect(() => {
    // Initialize Yjs document
    ydocRef.current = new Y.Doc();
    const yText = ydocRef.current?.getText("sharedText");
    yText.insert(0, content);

    // Listen to changes in the Yjs text type
    yText.observe((event) => {
      setContent(yText.toString());
    });

    // set up socket
    socketRef.current = io(SERVER_URL);

    // Handle socket
    socketRef.current.on("connect", () => {
      if (socketRef.current) {
        console.log("Connected to the server.", socketRef.current.id);
      }
    });
    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    socketRef.current.on("update", (update) => {
      console.log("Received an update: ", update);
      const updateDoc = new Uint8Array(update);
      if (ydocRef.current) {
        Y.applyUpdate(ydocRef.current, updateDoc);
      }
    });
    // Clean up when the component unmounts
    return () => {
      if (ydocRef.current) {
        ydocRef.current.destroy();
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Function to handle text changes
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log("About to send an update");
    if (ydocRef.current) {
      const ytext = ydocRef.current.getText("sharedText");
      ydocRef.current?.transact(() => {
        ytext.delete(0, ytext.length);
        ytext.insert(0, e.target.value);
      });
      const update = Y.encodeStateAsUpdate(ydocRef.current);
      if (socketRef.current) {
        console.log("socketRef exists when about to send updates");
        socketRef.current.emit("update", update);
      } else {
        console.log("socketRef doesn't exist when about to send updates");
      }
    }
  };

  return <textarea value={content} onChange={handleTextChange} />;
}

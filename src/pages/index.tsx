// pages/editor.js

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
const Diff = require("diff");
// const SERVER_URL = "http://localhost:8080";
const SERVER_URL = "https://nodejs-production-1c2e.up.railway.app/";

export default function Home() {
  const [content, setContent] = useState("Text Editor...");
  const socketRef = useRef<Socket | null>(null);
  useEffect(() => {
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
      setContent(update);
    });
    // Clean up when the component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Function to handle text changes
  const handleTextChange = async (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    console.log("Value changed to: ", e.target.value);
    if (socketRef.current) {
      setContent(e.target.value);
      console.log("Send to socket");
      socketRef.current.emit("update", e.target.value);
    }
  };
  interface DiffPart {
    added?: boolean;
    removed?: boolean;
    value: string;
  }

  interface Operation {
    type: "add" | "delete";
    position: number;
    value?: string;
    length?: number;
  }
  function findDiff(prev: string, current: string): Operation[] {
    const diffs = Diff.diffWords(prev, current);
    let position = 0; // Initialize a position counter
    const operations: Operation[] = []; // Store the operations to perform on the Yjs document

    diffs.forEach((part: DiffPart) => {
      if (part.added) {
        operations.push({ type: "add", position: position, value: part.value });
        position += part.value.length; // Move position forward for additions
      } else if (part.removed) {
        operations.push({
          type: "delete",
          position: position,
          length: part.value.length,
        });
        // Do not move position forward for deletions
      } else {
        position += part.value.length; // Move position forward for unchanged parts
      }
    });

    return operations;
  }

  return (
    <textarea
      value={content}
      onChange={handleTextChange}
      // placeholder="Type something here..."
    />
  );
}

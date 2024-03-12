// pages/editor.js

import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { io, Socket } from "socket.io-client";
// const SERVER_URL = "http://localhost:8080";
const SERVER_URL = "https://nodejs-production-1c2e.up.railway.app/";

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
    const diff = findDiff(content, e.target.value);
    console.log("About to send an update");
    if (ydocRef.current && diff) {
      const ytext = ydocRef.current.getText("sharedText");
      ydocRef.current?.transact(() => {
        if (diff.type == "add") {
          ytext.insert(diff.position, diff.character);
        } else if (diff.type == "delete") {
          ytext.delete(diff.position, 1);
        }
        // ytext.delete(0, ytext.length);
        // ytext.insert(0, e.target.value);
      });
      const update = Y.encodeStateAsUpdate(ydocRef.current);
      if (socketRef.current) {
        console.log("socketRef exists when about to send updates");
        socketRef.current.emit("update", update);
        setContent(e.target.value);
      } else {
        console.log("socketRef doesn't exist when about to send updates");
      }
    }
  };

  function findDiff(prev, current) {
    if (prev.length + 1 === current.length) {
      for (let i = 0; i < current.length; i++) {
        if (prev[i] !== current[i]) {
          return { type: "add", character: current[i], position: i };
        }
      }
    } else if (prev.length === current.length + 1) {
      for (let i = 0; i < prev.length; i++) {
        if (prev[i] !== current[i]) {
          return { type: "delete", position: i };
        }
      }
    }
    return null;
  }

  return (
    <textarea
      value={content}
      onChange={handleTextChange}
      placeholder="Type something here..."
    />
  );
}

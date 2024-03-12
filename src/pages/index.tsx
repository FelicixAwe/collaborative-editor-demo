// pages/editor.js

import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { io, Socket } from "socket.io-client";
const Diff = require("diff");
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
    // yText.insert(0, content);

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
    const newText = e.target.value;
    const diffs = findDiff(content, newText);
    console.log("About to send an update");
    console.log("diffs: ", diffs);

    if (ydocRef.current && diffs.length > 0) {
      const ytext = ydocRef.current.getText("sharedText");
      ydocRef.current.transact(() => {
        ytext.insert(
          ytext.length - 1,
          e.target.value[e.target.value.length - 1],
        );
        // diffs.forEach((diff) => {
        //   if (diff.type === "add" && typeof diff.value === "string") {
        //     ytext.insert(diff.position, diff.value);
        //   } else if (
        //     diff.type === "delete" &&
        //     typeof diff.length === "number"
        //   ) {
        //     ytext.delete(diff.position, diff.length);
        //   }
        // });
      });
      const update = Y.encodeStateAsUpdate(ydocRef.current);
      if (socketRef.current) {
        console.log("Sending updates");
        socketRef.current.emit("update", update);
      }
      setContent(newText); // Update local state to reflect new content
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
      placeholder="Type something here..."
    />
  );
}

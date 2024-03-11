// pages/editor.js

import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { io, Socket } from "socket.io-client";
const SERVER_URL = "https://nodejs-production-1c2e.up.railway.app/";
const initiaContent = `<style>      body {        font-family: sans-serif;      }      .title {        position: absolute;        top: 15%;        right: 0px;        width: 55%;        margin-top: 30px;        background-color: #0074C8;        color: white;        padding: 0.5em;        text-align: start;        font-size: 25px;      }      .bg-image {        display: flex;        justify-content: center;        margin: 8%;        height: 60%;      }      .wrapper{        position: absolute;        bottom: 30px;        margin: 0px 50px;        width: 87%;        height: 160px;      }      .contact-info {        display: flex;        flex-direction: row;        width: 50%;        justify-content: space-around;      }      .info {        display: flex;        flex-direction: row;        justify-content: space-between;        height: 100%;      }      .logo-info {        display: flex;        flex-direction: column;        width: 50%;      }      .upload {        display: flex;        justify-content: start;      }      .logo {        width: 218px;        height: 46px;        margin-top: 10px;        font-size: 14px;        border: 2px solid;        border-radius: 10px;        color: #2F2F2F;        text-align: center;        background-color: #FFFFFF;        cursor: pointer;      }      .respondent-info {        text-align: right;        font-size: 12px;        color: #2F2F2F;        font-family: Roboto;        line-height: 18px;        letter-spacing: 0.189px;      }      .client-info {        font-family: Roboto;        font-size: 12px;        color: #2F2F2F;        line-height: 18px;        letter-spacing: 0.189px;        text-align: start;        margin-top: 8%;      }      footer {        background-color: #0074C8;        color: #FFFFFF;        width: 100%;        height: 30px;        position: absolute;        bottom: 0px;        text-align: center;        font-size: 10px;        font-style: normal;        padding-top: 5px;      }    </style>  <body>      <div>      <div class="title" contenteditable="true">      <header>REQUEST FOR PROPOSAL (RFP) NO. *****</header>      </div>      <div class="bg-image"><img width="550px" height="600px" src=https://storage.googleapis.com/voop-68258.appspot.com/Proposal%20Templates/aThB9h/coverImage/coverImage.png?GoogleAccessId=firebase-adminsdk-vuc6t%40voop-68258.iam.gserviceaccount.com&Expires=16447046400&Signature=sfta517miKetxBYHPz4ukZB38V3bgsOi%2BUKR8pvSRkTwyhRT9EeCZueZ%2FAZPU9zw8M%2BoIqudakfmST%2BblnxA2stVGfVLn%2BVVpOIYCtM9uuaiNu42Vjrb9ZELb6IC618yHD%2BviLm7Ud%2BIoG%2BR7T6sXevggLoOCnMKClHbN%2FcH4Jtoa3slWYOwYbtkBjjwHl9hL%2BTE7y2ydRvycbSGkg6cl82t7uKE6uSpqRe%2FxWw0SJafdi6R%2F9dgWo5Nd%2BVpYa5l91GN8HgiVM6o3lmlVIvOinCPdv0YfPyx1VW5oZifTJBBiMa6cUY0frkLoz07Iin6%2BejnRPmTRQ7a6%2Fl0DNe9Iw%3D%3D alt="BG"></div>      <div class="wrapper">      <div class="info">        <div class="logo-info">          <div class="upload">          <button class="logo">YOUR COMPANY LOGO HERE</button>          </div>          <div class="client-info" contenteditable="true" >          <p>REQUEST FOR PROPOSAL FLEET CLIMATE ACTION CONSULTING SERVICES RFP-**-***</p></div>        </div>        <div class="contact-info">        <div class="respondent-info">          <p><b>Respondent:</b>          <br/>          GBCS Group Ltd.<br/>          330 5 Ave SW 18th floor,<br/>          Calgary, AB T2P 0L4<br/>          (403) 608-5543<br/>          shahab@gbcsgroup.ca<br/>          Shahab Seyedi          </p>        </div>        <div>           <img src=https://storage.googleapis.com/voop-68258.appspot.com/Proposal%20Templates/aThB9h/GBCSGroupLogo/GBCSGroupLogo.png?GoogleAccessId=firebase-adminsdk-vuc6t%40voop-68258.iam.gserviceaccount.com&Expires=16447046400&Signature=oMTPQ2kdO%2FcYN5SnkEZicF0wSs7xLeZ5bBAed06z4M7sbVstypM%2BYNtHiTy%2Binlnf%2F9cOyEx5J7bxva5gAUxTFJ7JMBrnS%2FnZEGVviQpbj8HiAFXSigYjiHtKJqqDcPJYmZgB4J91liNGcSIe%2FCeFIWAxEQIQQVu1Yy5kgdmiUKH4sCnE8JQriy1OtrzQj3qApfw2sy1IUL5zg3FtN4ZTT0GgHELiufzDQTcUPEOYge3ykdXpYAWX4QYjYXtAlqKxyP4MdkQbEAjzFOlv7Ra%2FMPPLnJgELUCpgM79w7xe%2BcBeVzHOLXp7alj9klMG%2BXLDAqvFnx2ywIRGapfzakzVg%3D%3D alt="Logo GBCS" width="88px" height="125px">        </div>        </div>      </div>      </div>      <footer>      <p>Copyright 2022 &copy; GBCS Group Ltd. All rights reserved</p></footer>    </div>    </body>`;
const htmlContent = initiaContent.replace(/\s+/g, " ");
export default function Home() {
  const [content, setContent] = useState("");
  const ydocRef = useRef<Y.Doc | null>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  useEffect(() => {
    // Initialize Yjs document
    ydocRef.current = new Y.Doc();
    const yText = ydocRef.current?.getText("sharedText");
    if (divRef.current) {
      divRef.current.innerHTML = htmlContent;
      const titleElement = divRef.current.querySelector(".title");
      // titleElement.textContent = "";
      // const initialTextContent = titleElement?.textContent;
      // console.log("initialTextContent: ", initialTextContent);
      // if (!yText.toString()) {
      //   yText.insert(0, initialTextContent);
      // }
      // setContent(initialTextContent);
      // Attach event listener to the title element
      // if (titleElement) {
      //   titleElement.addEventListener(
      //     "input",
      //     handleTextChange as EventListener,
      //   );
      // }
    }

    // Listen to changes in the Yjs text type
    yText.observe((event) => {
      // console.log("about to change content to: ", yText.toString());
      setContent(yText.toString());
      const titleElement = divRef.current?.querySelector(".title");
      if (titleElement) {
        titleElement.textContent = yText.toString();
      }
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
        console.log(
          "Current yDoc is: ",
          ydocRef.current.getText("sharedText").toString(),
        );
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

  const handleTextChange = (e: React.FormEvent<HTMLDivElement>) => {
    // const target = e.target as HTMLDivElement;
    // console.log("e.target.textContent: ", e.target.textContent);
    if (ydocRef.current) {
      const ytext = ydocRef.current.getText("sharedText");
      ydocRef.current?.transact(() => {
        ytext.delete(0, ytext.length);
        // ytext.insert(0, e.currentTarget.innerHTML);
        ytext.insert(0, (e.target as HTMLElement).textContent || "");
        // console.log("About to send an update: ", e.target.textContent);
      });
      const update = Y.encodeStateAsUpdate(ydocRef.current);
      if (socketRef.current) {
        // console.log("socketRef exists when about to send updates");
        socketRef.current.emit("update", update);
      } else {
        // console.log("socketRef doesn't exist when about to send updates");
      }
    }
  };

  return (
    <div
      style={{
        width: "650px",
        height: "850px",
        margin: "0 auto",
        maxWidth: "750px",
        maxHeight: "900px",
        fontSize: "20px",
        position: "relative",
        backgroundColor: "#FFFFFF",
      }}
    >
      <div
        id="editable-content"
        onInput={handleTextChange}
        ref={divRef}
        // dangerouslySetInnerHTML={{ __html: content }}
      ></div>
    </div>
  );
}

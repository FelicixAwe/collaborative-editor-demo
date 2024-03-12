// pages/editor.js

import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
const SERVER_URL = "https://nodejs-production-1c2e.up.railway.app/";
const initiaContent = `<style>      body {        font-family: sans-serif;      }      .title {        position: absolute;        top: 15%;        right: 0px;        width: 55%;        margin-top: 30px;        background-color: #0074C8;        color: white;        padding: 0.5em;        text-align: start;        font-size: 25px;      }      .bg-image {        display: flex;        justify-content: center;        margin: 8%;        height: 60%;      }      .wrapper{        position: absolute;        bottom: 30px;        margin: 0px 50px;        width: 87%;        height: 160px;      }      .contact-info {        display: flex;        flex-direction: row;        width: 50%;        justify-content: space-around;      }      .info {        display: flex;        flex-direction: row;        justify-content: space-between;        height: 100%;      }      .logo-info {        display: flex;        flex-direction: column;        width: 50%;      }      .upload {        display: flex;        justify-content: start;      }      .logo {        width: 218px;        height: 46px;        margin-top: 10px;        font-size: 14px;        border: 2px solid;        border-radius: 10px;        color: #2F2F2F;        text-align: center;        background-color: #FFFFFF;        cursor: pointer;      }      .respondent-info {        text-align: right;        font-size: 12px;        color: #2F2F2F;        font-family: Roboto;        line-height: 18px;        letter-spacing: 0.189px;      }      .client-info {        font-family: Roboto;        font-size: 12px;        color: #2F2F2F;        line-height: 18px;        letter-spacing: 0.189px;        text-align: start;        margin-top: 8%;      }      footer {        background-color: #0074C8;        color: #FFFFFF;        width: 100%;        height: 30px;        position: absolute;        bottom: 0px;        text-align: center;        font-size: 10px;        font-style: normal;        padding-top: 5px;      }    </style>  <body>      <div>      <div class="title" contenteditable="true">      <header>REQUEST FOR PROPOSAL (RFP) NO. *****</header>      </div>      <div class="bg-image"><img width="550px" height="600px" src=https://storage.googleapis.com/voop-68258.appspot.com/Proposal%20Templates/aThB9h/coverImage/coverImage.png?GoogleAccessId=firebase-adminsdk-vuc6t%40voop-68258.iam.gserviceaccount.com&Expires=16447046400&Signature=sfta517miKetxBYHPz4ukZB38V3bgsOi%2BUKR8pvSRkTwyhRT9EeCZueZ%2FAZPU9zw8M%2BoIqudakfmST%2BblnxA2stVGfVLn%2BVVpOIYCtM9uuaiNu42Vjrb9ZELb6IC618yHD%2BviLm7Ud%2BIoG%2BR7T6sXevggLoOCnMKClHbN%2FcH4Jtoa3slWYOwYbtkBjjwHl9hL%2BTE7y2ydRvycbSGkg6cl82t7uKE6uSpqRe%2FxWw0SJafdi6R%2F9dgWo5Nd%2BVpYa5l91GN8HgiVM6o3lmlVIvOinCPdv0YfPyx1VW5oZifTJBBiMa6cUY0frkLoz07Iin6%2BejnRPmTRQ7a6%2Fl0DNe9Iw%3D%3D alt="BG"></div>      <div class="wrapper">      <div class="info">        <div class="logo-info">          <div class="upload">          <button class="logo">YOUR COMPANY LOGO HERE</button>          </div>          <div class="client-info" contenteditable="true" >          <p>REQUEST FOR PROPOSAL FLEET CLIMATE ACTION CONSULTING SERVICES RFP-**-***</p></div>        </div>        <div class="contact-info">        <div class="respondent-info">          <p><b>Respondent:</b>          <br/>          GBCS Group Ltd.<br/>          330 5 Ave SW 18th floor,<br/>          Calgary, AB T2P 0L4<br/>          (403) 608-5543<br/>          shahab@gbcsgroup.ca<br/>          Shahab Seyedi          </p>        </div>        <div>           <img src=https://storage.googleapis.com/voop-68258.appspot.com/Proposal%20Templates/aThB9h/GBCSGroupLogo/GBCSGroupLogo.png?GoogleAccessId=firebase-adminsdk-vuc6t%40voop-68258.iam.gserviceaccount.com&Expires=16447046400&Signature=oMTPQ2kdO%2FcYN5SnkEZicF0wSs7xLeZ5bBAed06z4M7sbVstypM%2BYNtHiTy%2Binlnf%2F9cOyEx5J7bxva5gAUxTFJ7JMBrnS%2FnZEGVviQpbj8HiAFXSigYjiHtKJqqDcPJYmZgB4J91liNGcSIe%2FCeFIWAxEQIQQVu1Yy5kgdmiUKH4sCnE8JQriy1OtrzQj3qApfw2sy1IUL5zg3FtN4ZTT0GgHELiufzDQTcUPEOYge3ykdXpYAWX4QYjYXtAlqKxyP4MdkQbEAjzFOlv7Ra%2FMPPLnJgELUCpgM79w7xe%2BcBeVzHOLXp7alj9klMG%2BXLDAqvFnx2ywIRGapfzakzVg%3D%3D alt="Logo GBCS" width="88px" height="125px">        </div>        </div>      </div>      </div>      <footer>      <p>Copyright 2022 &copy; GBCS Group Ltd. All rights reserved</p></footer>    </div>    </body>`;
const htmlContent = initiaContent.replace(/\s+/g, " ");
export default function Home() {
  const ydocRef = useRef<Y.Doc | null>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const [negotiateData, setNegotiateData] = useState({
    webPubSubUrl: null,
    userID: null,
  });
  const appliedUpdate = new Set();

  useEffect(() => {
    console.log("Component mounts");
    // Initialize Yjs Map
    ydocRef.current = new Y.Doc();
    const elementsMap = ydocRef.current.getMap("elements");

    if (divRef.current) {
      divRef.current.innerHTML = htmlContent;
      const editableElements = divRef.current.querySelectorAll(
        '[contenteditable="true"]',
      );

      editableElements.forEach((element) => {
        // console.log(element.className);
        const yText = new Y.Text();
        elementsMap.set(element.className, yText);
      });
    }

    // @ts-ignore
    elementsMap.forEach((yText: Y.Text, key: string) => {
      yText.observe((event: Y.YTextEvent) => {
        // React to changes in this Y.Text
        console.log(
          "yText received updates: " + key + " as " + yText.toString(),
        );
        const domElement = document.querySelector(`.${key}`);
        if (domElement) {
          domElement.textContent = yText.toString();
        }
      });
    });

    async function fetchNegotiate() {
      try {
        const response = await fetch("http://localhost:8080/negotiate");
        const data = await response.json();
        setNegotiateData({
          webPubSubUrl: data.url,
          userID: data.userId,
        });
        console.log("UserID from server: ", data.userId);
        // set up socket
        const pubsubClient = new WebSocket(data.url);

        pubsubClient.onopen = () => {
          console.log("Connected to the server.");
        };
        pubsubClient.onclose = (event) => {
          console.log("Disconnected from server. ", event);
        };
        pubsubClient.onmessage = (event) => {
          const eventData = JSON.parse(event.data);
          console.log(event.data);
          // if (eventData.type === "message") {
          console.log("eventData: ", eventData);
          const key = eventData.key;
          const update = eventData.update;
          const userID = eventData.userID;
          // console.log("received from server:", eventData.data.key, userID);
          const updateDoc = new Uint8Array(update);
          // console.log(appliedUpdate.has(update.join(",")));
          if (
            updateDoc.length > 0 &&
            userID != negotiateData.userID
            // !appliedUpdate.has(update.join(","))
          ) {
            // appliedUpdate.add(update.join(","));
            console.log(updateDoc, userID);
            Y.applyUpdate(ydocRef.current, updateDoc);

            elementsMap.forEach((yText: Y.Text, key: string) => {
              console.log(
                "After applied changes : " + key + " as " + yText.toString(),
              );
            });
            // Apply changes
            const yText = elementsMap.get(key) as Y.Text;
            const domElement = document.querySelector(`.${key}`);
            if (domElement) {
              // console.log(yText.toString());
              domElement.textContent = yText.toString();
            }
          }
          // }
        };

        socketRef.current = pubsubClient;

        return () => {
          pubsubClient.close();
        };
      } catch (error) {
        console.error("Failed to fetch negotiation data:", error);
      }
    }

    fetchNegotiate();

    // Clean up when the component unmounts
    return () => {
      if (ydocRef.current) {
        ydocRef.current.destroy();
      }
    };
  }, []);

  const handleTextChange = (e: React.FormEvent<HTMLDivElement>) => {
    if (ydocRef.current) {
      const yMap = ydocRef.current.getMap("elements");
      const target = e.target as HTMLDivElement;
      if (yMap.has(target.className)) {
        const yText = yMap.get(target.className) as Y.Text;
        ydocRef.current?.transact(() => {
          yText.delete(0, yText.length);
          yText.insert(0, (e.target as HTMLElement).textContent || "");
          console.log("About to send an update: ", target.textContent);
        });
      }
      //@ts-ignore
      yMap.forEach((yText: Y.Text, key: string) => {
        console.log("Send changes for " + key + " as " + yText.toString());
      });

      const update = Y.encodeStateAsUpdate(ydocRef.current);
      if (socketRef.current) {
        // console.log("socketRef exists when about to send updates");
        const messageObject = {
          key: target.className,
          update: Array.from(update),
          userID: negotiateData.userID,
        };
        console.log(
          "Ready to send to the server: ",
          JSON.stringify(messageObject),
        );
        fetch("http://localhost:8080/send-message", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(messageObject),
        });
      } else {
        console.log("socketRef doesn't exist when about to send updates");
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
      <div id="editable-content" onInput={handleTextChange} ref={divRef}></div>
    </div>
  );
}

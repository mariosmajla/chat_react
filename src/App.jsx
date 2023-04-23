import "./App.css";
import React, { useState, useEffect } from "react";
import Input from "./components/Input";
import RandomName from "../src/utils/randomName"

export default function App() {

  const objectCollection = {
    member: { username: "" }, //username inicijalno prazan string
    messages: []
  };

  const [drone, setDrone] = useState(null);   //tu spremamo konekciju od scaledrone-a, inicijalno ju postavimo na null
  const [collection, setCollection] = useState(objectCollection);


  useEffect(() => {
    if (collection.member.username !== "") { //provjera da nije prazan string kako bi se samo jednom napravila kreirala instanca konekcije
      const drone = new window.Scaledrone(process.env.REACT_APP_CHANNEL_ID, { data: collection.member }); //prosljeđujemo channel ID i collection.member kao "data" property prema Scaledrone instanci
      setDrone(drone); //spremljena konekcija u state drone
    }
  }, [collection.member]); //otvaranje nove konekcije/instance kada se promijeni username


  if (drone) {
    drone.on("open", (error) => {
      if (error) { //u slucaju greske logirati u console log i izaci van
        return console.error(error);
      }
      collection.member.id = drone.clientId;
      setCollection({ ...collection }, collection.member);

      const room = drone.subscribe("observable-room");

      room.on("message", (message) => {
        const { id, member, data } = message; //destrukturirali smo iz message: id, member, data
        const username = member.clientData.username;
        setCollection(prevCollection => ({
          ...prevCollection,
          messages: [...prevCollection.messages, { id, member, data, username }]
        }));
      });
    });
  }

  const onSendMessage = (message) => {
    if (drone) {
      drone.publish({
        room: "observable-room",
        message
      });

    }
  };

  useEffect(() => {
    if (!collection.member.username) {  //provjera truthy
      const newUsername = RandomName();
      setCollection({ ...collection, member: { username: newUsername } });
    }
  }, [collection]);

  return (
    <>
      <h1>Seminarski rad final</h1>
      <div>
        {collection.messages.map((message, index) => {
          const { data, username } = message;
          return (
            <div key={index}>
              <strong>{username}</strong>
              <p>{data}</p>
            </div>
          );
        })}
        <Input onSendMessage={onSendMessage} />
      </div >
    </>
  );
}


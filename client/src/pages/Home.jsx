import { useState, useEffect } from "react";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Home.scss";
import friendsLogo from "../assets/logo/Friends-logo.png";
// images of characters
import chandlerImg from "../assets/images/chandler.webp";
import monicaImg from "../assets/images/monica.avif";
import rossImg from "../assets/images/ross.png";
import joeyImg from "../assets/images/joey.jpg";
import rachelImg from "../assets/images/rachel.avif";
import phoebeImg from "../assets/images/phoebe.jpg";

//skip audio
import skipSound from "../assets/audio/skip-sound.mp3";

const BASE_URL = import.meta.env.VITE_API_URL;
const characters = ["Joey", "Monica", "Chandler", "Ross", "Rachel", "Phoebe"];

const characterImages = {
  Joey: joeyImg,
  Monica: monicaImg,
  Chandler: chandlerImg,
  Ross: rossImg,
  Rachel: rachelImg,
  Phoebe: phoebeImg,
};

function Home() {
  const audioRef = useRef(null);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
    getQuote();
  };

  const [serverStatus, setServerStatus] = useState("");
  const [quote, setQuote] = useState("");
  // correct answer:
  const [character, setCharacter] = useState("");
  // the persons guess
  const [guess, setGuess] = useState(null);
  // state for if user is correct
  const [isCorrect, setIsCorrect] = useState(null);

  // disable all other options when not chosen
  const [disabled, setDisabled] = useState(false);
  // state for correct charachter img
  const [characterImage, setCharacterImage] = useState(null);

  //
  const getQuote = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}`);
      // Initially, quotes come with the characters name, here, we are removing it
      const filteredQuote = data.text.split(":")[1].trim();
      setQuote(filteredQuote);
      setCharacter(data.character);
      setGuess(null);
      setIsCorrect(null);
      setDisabled(false);
      setCharacterImage(null);
    } catch (error) {
      console.log("Error getting quote");
    }
  };

  // Connecting to server
  const getServerStatus = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}`);
      setServerStatus(data);
      console.log("Connected to server.");
    } catch (error) {
      console.log("Error getting server status.");
    }
  };

  useEffect(() => {
    getServerStatus();
    getQuote();
  }, []);

  const handleGuess = (option) => {
    if (disabled) return;
    setGuess(option);
    setDisabled(true);
    if (option === character) {
      console.log(character);
      console.log(characterImages[character]);
      // they got it right
      console.log("right!");
      setCharacterImage(characterImages[character]); // Set the correct character's image
      setIsCorrect(true);
      setTimeout(getQuote, 3000);
    } else {
      // they got it wrong
      setCharacterImage(characterImages[character]); // Set the correct character's image
      console.log("wrong!");
      setIsCorrect(false);
      setTimeout(getQuote, 3000);
    }
  };

  return (
    <>
      <div className="page">
        <header className="header">
          <nav className="nav">
            <div>
              <img className="logo" src={friendsLogo} alt="" />
            </div>
            <div className="nav-items-div">
              <ul className="nav-items">
                <li>The Office</li>
                <li>New Girl</li>
                <li>HIMYM</li>
                <li>Breaking Bad</li>
              </ul>
            </div>
          </nav>
        </header>
        <div className="main">
          <iframe
            src="https://archive.org/embed/tvtunes_31736"
            width="500"
            height="60"
            frameborder="0"
            // webkitallowfullscreen="true"
            // mozallowfullscreen="true"
            // allowfullscreen
          ></iframe>
          <h1 className="main__title">Guess which friend said the quote!</h1>
          <h3 className="main__quote">{quote}</h3>
          {/* <h2>{character}</h2> */}
          <div className="buttons">
            {characters.map((option) => (
              <button
                className={`button ${
                  guess === option ? (isCorrect ? "correct" : "wrong") : ""
                } ${disabled && guess !== option ? "button-disabled" : ""}`}
                key={option}
                onClick={() => handleGuess(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="skip-container">
            <button className="button skip-button" onClick={playSound}>
              Skip
            </button>
            <audio ref={audioRef} src={skipSound} preload="auto" />
          </div>
          {characterImage && ( // Show image only if a guess has been made
            <div className="img-container">
              <img
                className="img-person"
                src={characterImage}
                alt={character}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;

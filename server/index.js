import express from "express";
import cors from "cors";
import axios from "axios";
import "dotenv/config";

const app = express();
const { PORT, BACKEND_URL, CORS_ORIGIN } = process.env;
const allowedCharacters = ["Joey", "Monica" ,"Chandler", "Ross", "Rachel", "Phoebe"];

app.use(cors({ origin: CORS_ORIGIN }));


const fetchQuote = async () => {
  try {
    const response = await axios.get(
      "https://quotes.alakhpc.com/quotes?show=Friends&short=true"
    );
    const quote = response.data;

    // filter for the main 6 characters
    if (allowedCharacters.includes(quote.character)) {
      return quote;
    } else {
      return await fetchQuote();
    }
  } catch (error) {
    console.log(error);
  }
}

app.get("/", async (req, res) => {
  try {
    const quote = await fetchQuote();
    res.json(quote);
  } catch (error) {
    console.log(error);
  }
});

app.listen(8080, () => {
  console.log(`Server is listening at ${BACKEND_URL}:${PORT}`);
});

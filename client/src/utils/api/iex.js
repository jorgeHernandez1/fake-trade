import axios from "axios";

function searchSymbols() {
  return axios.get("/api/iex/symbols");
}

function searchPrice(data) {
  return axios.post("/api/iex/price", data);
}

export const apiIEX = {
  searchSymbols,
  searchPrice
};
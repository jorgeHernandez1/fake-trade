import axios from "axios";

function addStock(data) {
  return axios.post("/api/transactions/add-stock", data);
}

export const apiTransactions = {
  addStock,
};
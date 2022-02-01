import axios from "axios";

export const apiRequest = (url: string) => {
  return axios.get(`${process.env.REACT_APP_API_URL}${url}`)
    .then(response => {
      return response;
    })
    .catch(err => {
      return err;
    })
}
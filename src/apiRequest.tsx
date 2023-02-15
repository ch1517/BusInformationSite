import axios, { AxiosResponse } from "axios";

export const apiRequest = async (url: string): Promise<AxiosResponse<any>> => {
  try{
    const response = await axios.get(`http://apis.data.go.kr/1613000${url}`);
    return response;
  } catch(e: any){
    return e;
  }
}
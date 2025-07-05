import axios from "axios";
import { baseURL } from "../context/context";

const token = document.cookie.split("archive_cookie=")[1];

export const getInfinityFeatchApis = async ({ page = 1, search, url }) => {
  try {
    const { data } = await axios.get(`${baseURL}/${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        active: true,
        page,
        search,
        limit: 4,
      },
    });

    return {
      data: data.data,
      page,
      hasMore: data.results > 0,
    };
  } catch (error) {
    console.log(error);
    return {
      data: [],
      page,
      hasMore: false,
    };
  }
};

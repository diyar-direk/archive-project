import Cookies from "js-cookie";
import { baseURL } from "../context/context";
import axios from "axios";

export const getInfinityFeatchApis = async ({ page = 1, search, url }) => {
  const token = Cookies.get("archive_cookie");
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

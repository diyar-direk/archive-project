import axios from "axios";
import { baseURL } from "../../context/context.jsx";

const token = document.cookie.split("archive_cookie=")[1];

export const getInformations = async ({ page = 1, search }) => {
  try {
    const { data } = await axios.get(`${baseURL}/Information`, {
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
      data: data[search ? "data" : "informations"],
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

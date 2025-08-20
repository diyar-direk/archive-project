import Cookies from "js-cookie";
import axios from "axios";
import { baseURL } from "../../context/context";

export const getPeopleApi = async ({ page = 1, search }) => {
  const token = Cookies.get("archive_cookie");
  try {
    const { data } = await axios.get(`${baseURL}/people`, {
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
      data: data[search ? "data" : "people"],
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
export const getCoordsApi = async ({ page = 1, search }) => {
  const token = Cookies.get("archive_cookie");
  try {
    const { data } = await axios.get(`${baseURL}/Coordinates`, {
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
      data: data[search ? "data" : "data"],
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

export const searchByImage = async (formData) => {
  const token = Cookies.get("archive_cookie");
  const { data } = await axios.post(
    `${baseURL}/media/images/searchImages`,
    formData,
    {
      headers: { Authorization: "Bearer " + token },
    }
  );
  return data;
};

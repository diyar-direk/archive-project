import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Outlet } from "react-router-dom";
import { baseURL, Context } from "../context/context";
import { useCookies } from "react-cookie";
import Loader from "./../components/loading/Loader";

const Refresh = () => {
  const [loading, setLoading] = useState(true);
  const context = useContext(Context);
  const tokenContext = context.userDetails.token;

  const [cookie] = useCookies(["archive_cookie"]);

  const refreshToken = async () => {
    try {
      const profile = await axios.get(`${baseURL}/Users/profile`, {
        headers: { Authorization: "Bearer " + cookie.archive_cookie },
      });
      if (profile.data.user.active) {
        const user = {
          role: profile.data.user.role,
          isAdmin: profile.data.user.role === "admin",
          username: profile.data.user.username,
          token: cookie.archive_cookie,
          _id: profile.data.user._id,
        };
        profile.data.user.sectionId &&
          (user.sectionId = profile.data.user.sectionId);
        context.setUserDetails(user);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!tokenContext) {
      refreshToken();
    } else {
      setLoading(false);
    }
  }, [tokenContext]);

  return loading ? <Loader /> : <Outlet />;
};

export default Refresh;

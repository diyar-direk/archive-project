import { useContext, useEffect, useMemo, useRef, useState } from "react";
import "../../components/form/form.css";
import { baseURL, Context } from "../../context/context";
import axios from "axios";
import SendData from "../../components/response/SendData";
import Loading from "../../components/loading/Loading";
import useLanguage from "../../hooks/useLanguage";
import SelectInputApi from "../../components/inputs/SelectInputApi";
import { getInfinityFeatchApis } from "../../utils/infintyFeatchApis";
import InputWithLabel from "../../components/inputs/InputWithLabel";
import SelectOptionInput from "../../components/inputs/SelectOptionInput";
const AddUser = () => {
  const [loading, setLoading] = useState(false);

  const { language } = useLanguage();

  const [error, setError] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "",
    sectionId: "",
  });
  useEffect(() => {
    if (form.role === "admin")
      form.sectionId && setForm({ ...form, sectionId: "" });
  }, [form, setForm]);
  const [passwordCon, setPasswordCon] = useState("");

  const handleForm = (e) => {
    const { id, value } = e.target;

    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    if (id === "username") {
      if (usernameRegex.test(value) || value === "") {
        error && setError(false);
        setForm({ ...form, [id]: value });
      }
    } else {
      setForm({ ...form, [id]: value });
    }
  };

  const context = useContext(Context);
  const token = context.userDetails.token;
  const response = useRef(true);
  const [responseOverlay, setResponseOverlay] = useState(false);

  const responseFun = (complete = false) => {
    complete === true
      ? (response.current = true)
      : complete === "reapeted data"
      ? (response.current = 400)
      : (response.current = false);
    setResponseOverlay(true);
    window.onclick = () => {
      setResponseOverlay(false);
    };
    setTimeout(() => {
      setResponseOverlay(false);
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.role) setError(language?.table?.please_selecet_role);
    else if (form.role === "user" && !form.sectionId)
      setError(language?.table?.please_selecet_section);
    else if (form.password !== passwordCon)
      setError(language?.table?.password_match);
    else {
      setLoading(true);
      const keys = Object.keys(form);
      const formData = {};

      keys.forEach((key) => {
        if (form[key]) {
          formData[key] = form[key];
        }
      });

      try {
        const data = await axios.post(`${baseURL}/Users`, formData, {
          headers: { Authorization: "Bearer " + token },
        });
        if (data.status === 201) {
          responseFun(true);
          setForm({
            username: "",
            password: "",
            role: "",
            sectionId: "",
          });
          setPasswordCon("");
        }
      } catch (error) {
        console.log(error);
        if (error.status === 400) responseFun("reapeted data");
        else responseFun(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const roleOptions = useMemo(() => {
    const arrayOfOptionsInput = [
      {
        options: [
          {
            onSelectOption: () => setForm({ ...form, role: "user" }),
            text: language?.users?.user,
          },
          {
            text: language?.users?.admin,
            onSelectOption: () => setForm({ ...form, role: "admin" }),
          },
        ],
      },
    ];
    return arrayOfOptionsInput.map((input) => (
      <SelectOptionInput
        key="role"
        label={language?.users?.select_role}
        placeholder={language?.users?.select_role}
        value={form.role && language?.enums?.role[form.role]}
        onIgnore={() => setForm({ ...form, role: "" })}
        options={input.options}
      />
    ));
  }, [language, form]);

  return (
    <>
      {responseOverlay && (
        <SendData
          data={language?.users?.username}
          response={response.current}
        />
      )}
      {loading && <Loading />}
      <h1 className="title">{language?.header?.add_users}</h1>
      <form onSubmit={handleSubmit} className="dashboard-form">
        <div className="form">
          <div className="flex wrap">
            <InputWithLabel
              label={language?.users?.user_name}
              required
              minLength={3}
              maxLength={50}
              id="username"
              value={form.username}
              onChange={handleForm}
              placeholder={language?.users?.user_name_placeHolder}
            />

            {roleOptions}
            {form.role === "user" && (
              <SelectInputApi
                fetchData={getInfinityFeatchApis}
                selectLabel={language?.coordinates?.select_section}
                label={language?.coordinates?.section}
                optionLabel={(option) => option?.name}
                onChange={(option) => setForm({ ...form, sectionId: option })}
                value={form.sectionId.name}
                onIgnore={() => setForm({ ...form, sectionId: "" })}
                url="Sections"
              />
            )}

            <InputWithLabel
              label={language?.users?.password}
              value={form.password}
              onChange={handleForm}
              required
              type="password"
              minLength={6}
              id="password"
              placeholder={language?.users?.password_placeHolder}
            />
            <InputWithLabel
              label={language?.users?.password_confirmation}
              value={passwordCon}
              onChange={(e) => setPasswordCon(e.target.value)}
              required
              type="password"
              id="passwordConf"
              className="inp"
              placeholder={language?.users?.password_confirmation_placeholder}
            />
          </div>
        </div>

        {error && <p className="error"> {error} </p>}
        <button className="btn">{language?.users?.save}</button>
      </form>
    </>
  );
};

export default AddUser;

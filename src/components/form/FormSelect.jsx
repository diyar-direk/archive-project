import React, { useContext, useEffect, useRef, useState } from "react";
import { baseURL, Context, searchPlaceholder } from "../../context/context";
import "./form-select.css";
import axios from "axios";
import useLanguage from "../../hooks/useLanguage";

const FormSelect = (props) => {
  const handleClick = (e) => {
    e.stopPropagation();
    const divs = document.querySelectorAll("div.form .selecte .inp.active");
    divs.forEach((ele) => ele !== e.target && ele.classList.remove("active"));
    e.target.classList.toggle("active");
  };
  window.addEventListener("click", () => {
    const selectDiv = document.querySelector("div.form .selecte .inp.active");
    selectDiv && selectDiv.classList.remove("active");
  });
  const { language } = useLanguage();
  const keyValues = Keys(props.formKey);
  const context = useContext(Context);
  const token = context.userDetails.token;
  const [dataLoading, setDataLoading] = useState({
    Countries: true,
    Governments: true,
    Cities: true,
    Regions: true,
    Streets: true,
    Villages: true,
    Sources: true,
    Sections: true,
    Events: true,
    Parties: true,
    Coordinates: true,
  });

  const [allDataSelect, setAllDataSelect] = useState({
    data: {
      Countries: [],
      Governments: [],
      Cities: [],
      Regions: [],
      Streets: [],
      Villages: [],
      Sources: [],
      Sections: [],
      Events: [],
      Parties: [],
      Coordinates: [],
    },
    searchData: {
      Countries: [],
      Governments: [],
      Cities: [],
      Regions: [],
      Streets: [],
      Villages: [],
      Sources: [],
      Sections: [],
      Events: [],
      Parties: [],
      Coordinates: [],
    },
  });
  const refData = useRef({
    countryId: props.form.form.countryId?._id,
    cityId: props.form.form.cityId?._id,
  });

  useEffect(() => {
    if (
      !props.form.form.countryId ||
      (props.form.form.countryId._id &&
        refData.current.countryId !== props.form.form.countryId._id)
    ) {
      props.form.setForm({
        ...props.form.form,
        governmentId: "",
        cityId: "",
      });
      setAllDataSelect({
        ...allDataSelect,
        data: { ...allDataSelect.data, Cities: [], Governments: [] },
        searchData: {
          ...allDataSelect.searchData,
          Cities: [],
          Governments: [],
        },
      });
    }

    return () => 0;
  }, [props.form.form.countryId]);

  useEffect(() => {
    if (
      !props.form.form.cityId ||
      (props.form.form.cityId._id &&
        refData.current.cityId !== props.form.form.cityId._id)
    ) {
      props.form.setForm({
        ...props.form.form,
        villageId: "",
        regionId: "",
        streetId: "",
      });
      setAllDataSelect({
        ...allDataSelect,
        data: { ...allDataSelect.data, Regions: [], Streets: [], Villages: [] },
        searchData: {
          ...allDataSelect.searchData,
          Regions: [],
          Streets: [],
          Villages: [],
        },
      });
    }
    return () => 0;
  }, [props.form.form.cityId]);

  const getFltrData = (key) => {
    let url = `${baseURL}/${key.key}?active=true`;

    key.requiredKey &&
      (url += `&${key.backendRequiredKey}=${
        props.form.form[key.requiredKey]._id
      }`);

    if (allDataSelect?.data[key.key]?.length <= 0)
      axios
        .get(url, { headers: { Authorization: "Bearer " + token } })
        .then((res) => {
          setAllDataSelect({
            data: {
              ...allDataSelect?.data,
              [key.key]: res.data.data,
            },

            searchData: {
              ...allDataSelect?.searchData,
              [key.key]: res.data.data,
            },
          });
        })
        .catch((err) => console.log(err))
        .finally(() => setDataLoading({ ...dataLoading, [key.key]: false }));
  };

  const handleFormSelect = (e, itm) => {
    props?.form?.setForm({ ...props?.form?.form, [e.target.id]: itm });
    props?.error?.error && props?.error?.setError(false);
  };

  function Keys(key) {
    switch (key) {
      case "city":
        return {
          key: "Cities",
          formKey: "cityId",
          requiredKey: "countryId",
          translatedRequiredKey: language?.header?.country,
          backendRequiredKey: "country",
          title: language?.table?.cities,
        };
      case "allCity":
        return {
          key: "Cities",
          formKey: "city",
          title: language?.table?.cities,
        };
      case "government":
        return {
          key: "Governments",
          formKey: "governmentId",
          requiredKey: "countryId",
          translatedRequiredKey: language?.header?.country,
          backendRequiredKey: "country",
          title: language?.table?.governments,
        };
      case "country":
        return {
          key: "Countries",
          formKey: "countryId",
          title: language?.table?.countries,
        };
      case "coordinates":
        return {
          key: "Coordinates",
          formKey: "coordinates",
          title: language?.table?.coordinates,
        };
      case "region":
        return {
          key: "Regions",
          formKey: "regionId",
          requiredKey: "cityId",
          translatedRequiredKey: language?.header?.city,
          backendRequiredKey: "city",
          title: language?.table?.regions,
        };
      case "street":
        return {
          key: "Streets",
          formKey: "streetId",
          requiredKey: "cityId",
          translatedRequiredKey: language?.header?.city,
          backendRequiredKey: "city",
          title: language?.table?.streets,
        };
      case "village":
        return {
          key: "Villages",
          formKey: "villageId",
          requiredKey: "cityId",
          translatedRequiredKey: language?.header?.city,
          backendRequiredKey: "city",
          title: language?.table?.villages,
        };
      case "sources":
        return {
          key: "Sources",
          formKey: "sources",
          title: language?.table?.sources,
        };
      case "events":
        return {
          key: "Events",
          formKey: "events",
          title: language?.table?.events,
        };
      case "parties":
        return {
          key: "Parties",
          formKey: "parties",
          title: language?.table?.parties,
        };
      case "section":
        return {
          key: "Sections",
          formKey: "sectionId",
          title: language?.table?.sections,
        };
      default:
        return "countryId";
    }
  }

  const ignoreSelect = (e) => {
    props.form.setForm({ ...props.form.form, [e.target.title]: "" });
  };

  const selectCategories = (e, itm) => {
    if (
      props.form.form[e.target.id] &&
      !props.form.form[e.target.id]?.includes(itm)
    ) {
      props.form.setForm({
        ...props.form.form,
        [e.target.id]: [...new Set([...props.form.form[e.target.id], itm])],
      });

      props.error.error && props.error.setError(false);
    } else if (!props.form.form[e.target.id]) {
      props.form.setForm({
        ...props.form.form,
        [e.target.id]: [itm],
      });
    }
  };

  const removeSelectCategories = (e, itm) => {
    const data = props.form.form[e.target.id].filter((ele) => ele !== itm);

    props.form.setForm({
      ...props.form.form,
      [e.target.id]: data,
    });
  };

  return (
    <div className="flex flex-direction">
      <label>{keyValues.title}</label>
      <div className="selecte relative">
        <div
          onClick={(e) => {
            if (!keyValues.requiredKey) getFltrData(keyValues);
            else
              props.form.form[keyValues.requiredKey] && getFltrData(keyValues);
            handleClick(e);
          }}
          className="inp"
        >
          {language?.table?.select} {keyValues.title}
        </div>

        <article>
          {dataLoading[keyValues.key] && !keyValues.requiredKey ? (
            <p>{language?.table?.loading}</p>
          ) : props.form.form[keyValues.requiredKey] &&
            dataLoading[keyValues.key] &&
            keyValues.requiredKey ? (
            <p>{language?.table?.loading}</p>
          ) : (
            <>
              {!keyValues.requiredKey ||
              (keyValues.requiredKey &&
                props.form.form[keyValues.requiredKey]) ? (
                <>
                  <input
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                    placeholder={`${language?.table?.search_for} ${keyValues.title}`}
                    onInput={(inp) => {
                      const filteredCountries =
                        allDataSelect?.data?.[keyValues.key]?.filter((e) =>
                          e.name
                            ? e.name
                                .toLowerCase()
                                .includes(inp.target.value.toLowerCase())
                            : e.source_name
                            ? e.source_name
                                .toLowerCase()
                                .includes(inp.target.value.toLowerCase())
                            : e.coordinates
                                .toLowerCase()
                                .includes(inp.target.value.toLowerCase())
                        ) || [];
                      setAllDataSelect((prevState) => ({
                        ...prevState,
                        searchData: {
                          ...prevState?.searchData,
                          [keyValues.key]: filteredCountries,
                        },
                      }));
                    }}
                    type="text"
                  />
                  {allDataSelect?.searchData[keyValues.key]?.map((itm, i) => (
                    <h2
                      key={i}
                      id={keyValues.formKey}
                      onClick={(e) =>
                        !props.type
                          ? handleFormSelect(e, itm)
                          : selectCategories(e, itm)
                      }
                    >
                      {itm?.name
                        ? itm?.name
                        : itm?.source_name
                        ? itm?.source_name
                        : itm?.coordinates}
                    </h2>
                  ))}
                  {allDataSelect?.searchData[keyValues.key]?.length === 0 && (
                    <p>{language?.table?.no_results}</p>
                  )}
                </>
              ) : (
                <p>
                  {language?.table?.please_selecet}{" "}
                  {[keyValues.translatedRequiredKey]} {language?.table?.first}
                </p>
              )}
            </>
          )}
        </article>
      </div>
      {props.form.form[keyValues.formKey] && !props.type && (
        <span title={keyValues.formKey} onClick={ignoreSelect}>
          {props.form.form[keyValues.formKey].name
            ? props.form.form[keyValues.formKey].name
            : props.form.form[keyValues.formKey].source_name}
        </span>
      )}
      {props.type && props.form.form[keyValues.formKey]?.length > 0 && (
        <div className="flex selceted-itms">
          {props.form.form[keyValues.formKey].map((span) => (
            <span
              onClick={(e) => removeSelectCategories(e, span)}
              id={keyValues.formKey}
              key={span._id}
            >
              {span?.name
                ? span?.name
                : span?.source_name
                ? span?.source_name
                : span?.coordinates}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormSelect;

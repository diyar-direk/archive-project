import React, { useEffect, useState } from "react";
import { baseURL, searchPlaceholder } from "../context/context";
import axios from "axios";

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

  const keyValues = Keys(props.formKey);

  const [dataLoading, setDataLoading] = useState({
    Countries: true,
    Governments: true,
    Cities: true,
    Regions: true,
    Streets: true,
    Villages: true,
    Sources: true,
    Sections: true,
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
    },
  });

  useEffect(() => {
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
  }, [props.form.form.countryId]);
  useEffect(() => {
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
  }, [props.form.form.cityId]);

  const getFltrData = (key) => {
    let url = `${baseURL}/${key.key}?active=true`;

    key.requiredKey &&
      (url += `&${key.backendRequiredKey}=${
        props.form.form[key.requiredKey]._id
      }`);

    if (allDataSelect.data[key.key]?.length <= 0)
      axios
        .get(url)
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
          backendRequiredKey: "country",
        };
      case "government":
        return {
          key: "Governments",
          formKey: "governmentId",
          requiredKey: "countryId",
          backendRequiredKey: "country",
        };
      case "country":
        return {
          key: "Countries",
          formKey: "countryId",
          requiredKey: "",
          backendRequiredKey: "",
        };
      case "region":
        return {
          key: "Regions",
          formKey: "regionId",
          requiredKey: "cityId",
          backendRequiredKey: "city",
        };
      case "street":
        return {
          key: "Streets",
          formKey: "streetId",
          requiredKey: "cityId",
          backendRequiredKey: "city",
        };
      case "village":
        return {
          key: "Villages",
          formKey: "villageId",
          requiredKey: "cityId",
          backendRequiredKey: "city",
        };
      case "sources":
        return {
          key: "Sources",
          formKey: "sources",
          requiredKey: "",
          backendRequiredKey: "",
        };
      case "section":
        return {
          key: "Sections",
          formKey: "sectionId",
          requiredKey: "",
          backendRequiredKey: "",
        };
      default:
        return "countryId";
    }
  }

  const ignoreSelect = (e) => {
    props.form.setForm({ ...props.form.form, [e.target.title]: "" });
  };

  return (
    <div className="flex flex-direction">
      <label>{keyValues.key}</label>
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
          select {keyValues.key}
        </div>
        <article>
          {dataLoading[keyValues.key] && !keyValues.requiredKey ? (
            <p>loading ...</p>
          ) : props.form.form[keyValues.requiredKey] &&
            dataLoading[keyValues.key] &&
            keyValues.requiredKey ? (
            <p>loading ...</p>
          ) : (
            <>
              {!keyValues.requiredKey ||
              (keyValues.requiredKey &&
                props.form.form[keyValues.requiredKey]) ? (
                <>
                  <input
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                    placeholder={`${searchPlaceholder} ${keyValues.key}`}
                    onInput={(inp) => {
                      const filteredCountries =
                        allDataSelect?.data?.[keyValues.key]?.filter((e) =>
                          e.name
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
                      onClick={(e) => handleFormSelect(e, itm)}
                    >
                      {itm?.name ? itm?.name : itm?.source_name}
                    </h2>
                  ))}
                  {allDataSelect?.searchData[keyValues.key].length === 0 && (
                    <p>no data</p>
                  )}
                </>
              ) : (
                <p>please select {[keyValues.requiredKey]} first</p>
              )}
            </>
          )}
        </article>
      </div>
      {props.form.form[keyValues.formKey] && (
        <span title={keyValues.formKey} onClick={ignoreSelect}>
          {props.form.form[keyValues.formKey].name
            ? props.form.form[keyValues.formKey].name
            : props.form.form[keyValues.formKey].source_name}
        </span>
      )}
    </div>
  );
};

export default FormSelect;

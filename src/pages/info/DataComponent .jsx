import React from "react";

const DataComponent = React.forwardRef((props, ref) => {
  const data = props.data;
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      ref={ref}
      style={{ padding: "20px", backgroundColor: "white" }}
      className="single-info pdf-export"
    >
      <h1 style={{ textAlign: "center" }}>{data.subject}</h1>
      <div className="flex align-center gap-2">
        <h2> details</h2>
        <p>{data.details}</p>
      </div>
      <div className="flex align-center gap-2">
        <h2> note</h2>
        <p>{data.note}</p>
      </div>
      <div className="flex align-center gap-2">
        <h2> country</h2>
        <p>{data.countryId?.name}</p>
      </div>
      <div className="flex align-center gap-2">
        <h2> city</h2>
        <p>{data.cityId?.name}</p>
      </div>
      <div className="flex align-center gap-2">
        <h2> government</h2>
        <p>{data.governmentId?.name}</p>
      </div>
      <div className="flex align-center gap-2">
        <h2>region</h2>
        <p>{data.regionId ? data.regionId?.name : "no region found"}</p>
      </div>
      <div className="flex align-center gap-2">
        <h2>street</h2>
        <p>{data.streetId ? data.streetId?.name : "no street found"}</p>
      </div>
      <div className="flex align-center gap-2">
        <h2>village</h2>
        <p>{data.villageId ? data.villageId?.name : "no village found"}</p>
      </div>
      <div className="flex align-center gap-2">
        <h2>addressDetails</h2>
        <p>{data.addressDetails ? data.addressDetails : "no Details found"}</p>
      </div>
      <ArrayComponent
        title="coordinates"
        data={data.coordinates}
        name="coordinates"
      />
      <ArrayComponent title="people" name="people" data={data.people} />
      <ArrayComponent title="events" data={data.events} name="name" />
      <ArrayComponent title="parties" data={data.parties} name="name" />
      <ArrayComponent title="sources" data={data.sources} name="source_name" />
    </div>
  );
});

export default DataComponent;

const ArrayComponent = (props) => {
  return (
    <div>
      <h2>{props.title}</h2>
      {props.data?.length < 1 || !props.data ? (
        <p>no {props.title} found</p>
      ) : (
        props.data?.map((item, i) =>
          props.name !== "people" ? (
            <p key={i}>{item[props.name]}</p>
          ) : (
            <p key={i}>
              {item.firstName} {item.fatherName} {item.surName}
            </p>
          )
        )
      )}
    </div>
  );
};

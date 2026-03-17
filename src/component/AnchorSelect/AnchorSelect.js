import "./AnchorSelect.css";

import React, { useState } from "react";
import Select from "react-select";

const AnchorSelect = ({ anchorList, selected, setSelected }) => {
  // Chuyển đổi sang format của react-select
  const options = anchorList.map((item) => ({
    value: item.id,
    label: item.anchor,
  }));

  const customStyles = {
    control: (styles) => ({
      ...styles,
      height: "2.8rem",
      backgroundColor: "#333",
      borderColor: "#fff",
      border: 0,
      outline: 0,
    }),
    multiValue: (styles) => {
      return {
        ...styles,
        color: "#333",
        backgroundColor: "#fff",
      };
    },
    multiValueLabel: (styles) => ({
      ...styles,
      color: "#333",
      padding: "3px 5px",
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: "#333",
      backgroundColor: "#d6d6d6",
    }),
  };

  return (
    <div className="anchor-select-box">
      <Select
        options={options}
        isMulti
        placeholder="Select Anchor"
        value={selected}
        onChange={(val) => setSelected(val)}
        theme={(theme) => ({
          ...theme,
          borderRadius: 4,
          colors: {
            ...theme.colors,
            primary25: "rgb(181, 210, 73,0.4)",
            primary: "#fff",
            neutral50: "#fff",
          },
        })}
        styles={customStyles}
      />
    </div>
  );
};

export default AnchorSelect;

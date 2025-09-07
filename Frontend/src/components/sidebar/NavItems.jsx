import React from "react";

function NavItems(props) {
  const isSelected = props.isSelected;

  return (
    <>
      <div
        className={`flex flex-row items-center justify-center md:p-3 md:bg-gray-100 rounded-xl cursor-pointer md:mt-1 md:mb-1 md:hover:shadow-sm ${
          isSelected ? "md:bg-gray-300" : ""
        } ${props.className}`}
        id={props.id}
        onClick={props.onClick}
      >
        <div className="h-10 w-10 md:h-8 md:w-8 flex items-center justify-center md:bg-white rounded-md">
          <img
            className="md:h-6 md:w-6 cursor-pointer w-8 h-8"
            src={props.icon}
          />
        </div>
        <h5 className="hidden w-20 text-center lg:block cursor-pointer select-none m-0 p-0">
          {props.title}
        </h5>
      </div>
    </>
  );
}

export default NavItems;

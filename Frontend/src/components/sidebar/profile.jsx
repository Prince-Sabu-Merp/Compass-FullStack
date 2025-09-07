import React from "react";

function profile(props) {
  return (
    <>
      <div className="hidden relative md:block h-18">
        <div
          className="flex flex-row items-center justify-center md:p-3 rounded-xl cursor-pointer md:mt-1.5 md:mb-1.5"
          id="porfile"
        >
          <div className="md:h-10 md:w-10 flex items-center justify-center">
            <img
              className="shadow-gray-500 border-2 border-gray-300 rounded-full object-cover w-full h-full shadow-sm"
              src={props.img}
              alt=""
            />
          </div>
          <h6 className="hidden italic text-sm font-sans w-20 overflow-hidden wrap-break-word lg:block cursor-pointer m-0 pl-2 select-none">
            {props.name}
          </h6>
        </div>
      </div>
    </>
  );
}

export default profile;

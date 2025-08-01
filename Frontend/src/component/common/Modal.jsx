import React from "react";
import { FaUserCheck, FaUserSecret } from "react-icons/fa";

const Modal = ({ closeModal }) => {
  return (
    <div className="ModalBackground bg-[#f8fafc]">
      <div className="modal modal-open">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => closeModal(false)}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg text-center">
            How Would You Like to Raise Your Concern?
          </h3>
          <p className="py-4 text-center backdrop:blur-sm italic ">
            {" "}
            Your privacy matters. Please choose how you’d like to submit your
            concern:
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row space-x-8 m-5">
            {" "}
            <a href="/withinfo">
              <button className="btn bg-teal-600 text-white hover:bg-teal-700 ml-8 sm:ml-0 mt-4">
                <FaUserCheck className="mr-2" />
                With My Information
              </button>
            </a>
            <a href="/anonymous">
              {" "}
              <button className="btn bg-indigo-600 text-white hover:bg-indigo-700 w-48 ">
                <FaUserSecret className="mr-2" />
                Anonymously
              </button>
            </a>
          </div>
          <div className="Detailed text-gray-500 text-sm mt-4">
            <p className="text-center">
              {" "}
              All concerns are treated with urgency and care, regardless of your
              choice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

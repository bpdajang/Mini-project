import React from "react";
import { useState } from "react";
import Modal from "../component/common/Modal.jsx";

const HomePage = () => {
  const [OpenModal, setOpenModal] = useState(false);

  return (
    <section className="w-screen">
      <div id="home" className="container rounded-full">
        <div
          className=" min-h-screen overflow-hidden hero bg-base-200 bg-cover bg-center max-w-screen-2xl rounded-sm"
          style={{
            backgroundImage:
              "url(https://st.depositphotos.com/1011643/4242/i/950/depositphotos_42422717-stock-photo-embracing-college-friends.jpg)",
          }}
        >
          <div className="hero-overlay bg-red-600 bg-opacity-60"></div>
          <div className="hero-content text-neutral-content flex mt-2 flex-col place-items-start text-center">
            <div className="max-w-md mt-20 justify-center">
              <h1 className="mb-5 text-5xl font-bold">
                You Deserve To Feel Your Best.
              </h1>
              <p className="mb-5">
                Connect with your caring friends for emotional support. And if
                you feel alone don't hesitate to chat or talk with your caring
                friends.
              </p>
              <div className="sm:flex sm:flex-row sm:space-x-6 sm:justify-center flex flex-col space-y-5 items-center">
                <button
                  className="btn btn-secondary mt-5 w-56 text-white font-semibold rounded-lg shadow-md transition duration-300 transform hover:scale-105"
                  onClick={() => setOpenModal(true)}
                >
                  Raise a Corncern
                </button>
                <button className="btn btn-secondary w-56 text-white font-semibold rounded-lg shadow-md transition duration-300 transform hover:scale-105">
                  <a href="/peer">Talk to peer counsellor</a>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {OpenModal && <Modal closeModal={setOpenModal} />}
    </section>
  );
};

export default HomePage;

import React from "react";

const AboutUs = () => {
  return (
    <section className="py-5 m-0 md:py-16 px-4 bg-red-600 bg-cover w-full">
      <div id="about">
        <div className="text-center mb-8">
          <h1 className="text-3xl text-cyan-50 font-bold">About Us</h1>
          <p className="text-lg text-zinc-50">
            We are dedicated to providing a safe and supportive space for
            individuals seeking resources and peer support.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-10 lg:gap-8 ml-10">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body sm:w-72 lg:w-[500px]">
              <h2 className="card-title">Our Mission</h2>
              <p>
                The mission of A Health Mind in A health Body Project is to
                provide comprehensive support and connection to the resources to
                enhance the well-being and academic success of students. This
                includes fostering a supportive environment, offering
                counselling services, promoting inclusivity, and addressing the
                diverse needs of students, ensuring equitable access to
                opportunities and assistance.
              </p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Our Vision</h2>
              <p>
                A world where mental health is prioritized, and everyone has the
                support they need.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;

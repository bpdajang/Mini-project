import React from "react";
import { useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";

const Peer_counsellor = () => {
  const navigate = useNavigate();

  // List of peer counsellors
  const allCounsellors = [
    {
      id: 1,
      name: "Sarah Johnson",
      phone: "+233201219057",
      expertise: "Stress & Anxiety Support",
      description: "Available weekdays 3 PM - 7 PM",
    },
    {
      id: 2,
      name: "Michael Chen",
      phone: "+233201219057",
      expertise: "Study Buddy & Motivation",
      description: "Here to listen and help you through tough times",
    },
    {
      id: 3,
      name: "Emma Wilson",
      phone: "+233201219057",
      expertise: "Friendship & Social Life",
      description: "Evening chats welcome",
    },
    {
      id: 4,
      name: "David Smith",
      phone: "+233201219057",
      expertise: "Career Chat & Advice",
      description: "Fellow student navigating career paths",
    },
    {
      id: 5,
      name: "Priya Patel",
      phone: "+233201219057",
      expertise: "Cultural Exchange & Support",
      description: "Always happy to share experiences",
    },
    {
      id: 6,
      name: "James Brown",
      phone: "+233201219057",
      expertise: "LGBTQ+ Friendly Space",
      description: "Safe and understanding conversations",
    },
    {
      id: 7,
      name: "Linda Taylor",
      phone: "+233201219057",
      expertise: "Emotional Support",
      description: "Weekend availability for casual chats",
    },
    {
      id: 8,
      name: "Alex Kim",
      phone: "+233201219057",
      expertise: "Peer Relationships",
      description: "Fellow student who cares about your wellbeing",
    },
  ];

  // Function to shuffle array and pick first 6
  const getRandomCounsellors = (arr, n) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  };

  // Get 6 random counsellors
  const randomCounsellors = getRandomCounsellors(allCounsellors, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      {/* Header Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 bg-gradient-to-r from-red-600 to-red-700 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-white"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-white"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white hover:text-red-100 transition-colors duration-300 group"
            >
              <IoMdArrowBack className="text-2xl group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </button>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Peer Counsellors
            </h1>
            <p className="text-xl text-red-50 font-light">
              Connect with your caring friends who volunteer to listen and
              support you
            </p>
          </div>
        </div>
      </section>

      {/* Peer Counsellors Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Meet Your Peer counsellors
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These are your fellow students who care about your wellbeing and
              are here to offer a friendly ear and support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {randomCounsellors.map((counsellor) => (
              <div
                key={counsellor.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-l-4 border-red-500"
              >
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-full w-16 h-16 flex items-center justify-center text-white font-bold text-xl mr-4">
                      {counsellor.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {counsellor.name}
                      </h3>
                      <p className="text-red-600 font-medium">
                        {counsellor.expertise}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6">{counsellor.description}</p>

                  <div className="flex flex-col gap-3">
                    <a
                      href={`https://wa.me/${counsellor.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Chat on WhatsApp
                    </a>
                    <a
                      href={`tel:${counsellor.phone}`}
                      className="flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-3 px-4 rounded-lg transition-colors duration-300"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      Call Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 p-6 bg-red-50 rounded-xl">
            <h3 className="text-xl font-bold text-red-800 mb-2">
              Important Note
            </h3>
            <p className="text-red-700">
              Our peer counsellors are fellow students who volunteer their time
              to listen and provide friendly support. In case you need a friend
              to talk to, they are here for you.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Peer_counsellor;

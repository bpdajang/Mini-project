import React, { useState } from "react";
import { href } from "react-router-dom";

const AdviceSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for advice articles
  const adviceArticles = [
    {
      id: 1,
      title: "Managing Academic Stress at KNUST",
      category: "academics",
      excerpt:
        "Effective strategies to handle exam pressure and coursework demands specific to KNUST's rigorous academic environment.",
      author: "Dr. Akosua Mensah",
      date: "2023-10-15",
      readTime: "5 min read",
      image: "https://placehold.co/600x400/4f46e5/white?text=Academic+Stress",
    },
    {
      id: 2,
      title: "Balancing Studies and Social Life",
      category: "wellness",
      excerpt:
        "Tips for maintaining a healthy social life while excelling in your studies at KNUST.",
      author: "Kwame Asante",
      date: "2023-09-22",
      readTime: "4 min read",
      image: "https://placehold.co/600x400/ec4899/white?text=Social+Balance",
    },
    {
      id: 3,
      title: "Career Planning for KNUST Graduates",
      category: "career",
      excerpt:
        "Navigating job markets and building your professional network as a KNUST student.",
      author: "Prof. Kwasi Boateng",
      date: "2023-11-05",
      readTime: "7 min read",
      image: "https://placehold.co/600x400/0ea5e9/white?text=Career+Planning",
    },
    {
      id: 4,
      title: "Financial Management for Students",
      category: "wellness",
      excerpt:
        "Budgeting tips and money-saving strategies for managing expenses during your time at KNUST.",
      author: "Adwoa Gyamfi",
      date: "2023-08-30",
      readTime: "6 min read",
      image: "https://placehold.co/600x400/10b981/white?text=Financial+Tips",
    },
    {
      id: 5,
      title: "Overcoming Homesickness",
      category: "wellness",
      excerpt:
        "Coping strategies for students adjusting to life away from home in Kumasi.",
      author: "Nana Yaa Asantewaa",
      date: "2023-07-18",
      readTime: "4 min read",
      image: "https://placehold.co/600x400/f97316/white?text=Homesickness",
    },
    {
      id: 6,
      title: "Research Opportunities at KNUST",
      category: "academics",
      excerpt:
        "How to get involved in research projects and gain valuable experience in your field of study.",
      author: "Dr. Emmanuel Osei",
      date: "2023-10-28",
      readTime: "8 min read",
      image: "https://placehold.co/600x400/8b5cf6/white?text=Research",
      link: "https://ogr.knust.edu.gh/research/doing-research",
    },
  ];

  const categories = [
    { id: "all", name: "All Topics" },
    { id: "academics", name: "Academics" },
    { id: "wellness", name: "Wellness" },
    { id: "career", name: "Career" },
  ];

  // Filter articles based on category and search term
  const filteredArticles = adviceArticles.filter((article) => {
    const matchesCategory =
      activeCategory === "all" || article.category === activeCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-base-100 py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Student Advice Hub
          </h1>
          <p className="text-xl text-base-content max-w-3xl mx-auto">
            Expert guidance and resources tailored specifically for KNUST
            students to navigate academic, personal, and career challenges.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Search Bar */}
            <div className="w-full md:w-1/2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search advice articles..."
                  className="input input-bordered w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`btn btn-sm ${
                    activeCategory === category.id
                      ? "btn-primary"
                      : "btn-outline"
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="card card-compact bg-base-200 hover:bg-base-300 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <figure>
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
              </figure>
              <div className="card-body">
                <div className="card-actions justify-end mb-2">
                  <div className="badge badge-outline capitalize">
                    {article.category}
                  </div>
                </div>
                <h2 className="card-title text-xl">{article.title}</h2>
                <p className="text-base-content/80">{article.excerpt}</p>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-base-content/70">
                    <p>{article.author}</p>
                    <p>
                      {article.date} • {article.readTime}
                    </p>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    href={article.link}
                  >
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read More
                    </a>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Advice Section */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 mb-16 text-white">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h2 className="text-3xl font-bold mb-4">
                Personalized Advice Sessions
              </h2>
              <p className="text-lg mb-6">
                Connect with experienced counselors and mentors from KNUST
                community for personalized guidance on your specific challenges.
              </p>
              <button className="btn btn-accent text-primary font-bold">
                Book a Session
              </button>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="bg-white/20 p-6 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-24 w-24"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Topics */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">
            Popular Topics Among KNUST Students
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Exam Preparation", icon: "📚" },
              { title: "Time Management", icon: "⏰" },
              { title: "Mental Health", icon: "🧠" },
              { title: "Internship Opportunities", icon: "💼" },
            ].map((topic, index) => (
              <div
                key={index}
                className="bg-base-200 p-6 rounded-xl text-center hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer"
              >
                <div className="text-4xl mb-4">{topic.icon}</div>
                <h3 className="text-xl font-semibold">{topic.title}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-base-200 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              {
                question: "How can I access counseling services at KNUST?",
                answer:
                  "KNUST offers counseling services through the Student Counseling Unit. You can book appointments through the student portal or visit their office in the Student Representative Council building.",
              },
              {
                question: "What resources are available for academic support?",
                answer:
                  "The university provides study groups, peer tutoring, academic workshops, and access to online learning platforms. Check with your department for specific resources.",
              },
              {
                question:
                  "How do I balance coursework with extracurricular activities?",
                answer:
                  "Prioritize your commitments, create a schedule, and set realistic goals. Remember that quality participation is better than overcommitting yourself.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="collapse collapse-arrow bg-base-100 border border-base-300"
              >
                <input type="checkbox" />
                <div className="collapse-title text-xl font-medium">
                  {faq.question}
                </div>
                <div className="collapse-content">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdviceSection;

import React, { useState } from "react";
import { Link } from "react-router-dom";

const ResourcePage = () => {
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
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Student Resources
          </h1>
          <p className="text-lg text-base-content max-w-2xl mx-auto">
            Essential advice and resources for KNUST students. Explore our full
            collection for more in-depth guidance.
          </p>
          <Link to="/advice" className="btn btn-primary mt-4">
            View All Resources
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          {/* <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            <div className="w-full md:w-1/2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search resources..."
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
              </div> */}
        </div>

        {/* Category Filters */}
        {/* <div className="flex flex-wrap gap-2 justify-center">
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
            </div> */}
        {/* </div>
        </div> */}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filteredArticles.slice(0, 3).map((article) => (
            <div
              key={article.id}
              className="card card-compact bg-base-200 hover:bg-base-300 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <figure>
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-36 object-cover"
                />
              </figure>
              <div className="card-body">
                <div className="card-actions justify-end mb-2">
                  <div className="badge badge-outline capitalize">
                    {article.category}
                  </div>
                </div>
                <h2 className="card-title text-lg">{article.title}</h2>
                <p className="text-sm text-base-content/80">
                  {article.excerpt}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-xs text-base-content/70">
                    <p>{article.author}</p>
                    <p>
                      {article.date} • {article.readTime}
                    </p>
                  </div>
                  <Link to="/advice" className="btn btn-primary btn-xs">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/advice" className="btn btn-primary btn-wide">
            Explore All Advice Resources
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResourcePage;

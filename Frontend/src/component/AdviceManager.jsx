import React, { useState, useEffect } from "react";

const AdviceManager = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    excerpt: "",
    author: "",
    readTime: "",
    image: "",
    link: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch("/api/advice");
      if (!response.ok) throw new Error("Failed to fetch articles");
      const data = await response.json();
      setArticles(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingId ? "PATCH" : "POST";
    const url = editingId
      ? `/api/advice/update/${editingId}`
      : "/api/advice/create";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.status === 403) {
        // Try to get detailed error message
        const errorData = await response.json();
        setError(
          errorData.error || "Access denied. Please log in as an admin."
        );
        // Redirect to login if token is invalid/expired
        if (errorData.error.includes("Unauthorised")) {
          window.location.href = "/login";
        }
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Operation failed");
      }

      // Refresh list
      fetchArticles();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      excerpt: "",
      author: "",
      readTime: "",
      image: "",
      link: "",
    });
    setEditingId(null);
  };

  const handleEdit = (article) => {
    setFormData({
      title: article.title,
      category: article.category,
      excerpt: article.excerpt,
      author: article.author,
      readTime: article.readTime,
      image: article.image,
      link: article.link,
    });
    setEditingId(article._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?"))
      return;

    try {
      const response = await fetch(`/api/advice/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Delete failed");

      // Refresh list
      fetchArticles();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading articles...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Advice Articles</h2>

      {/* Article Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Article" : "Add New Article"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="select select-bordered w-full"
              >
                <option value="">Select category</option>
                <option value="academics">Academics</option>
                <option value="wellness">Wellness</option>
                <option value="career">Career</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Read Time
              </label>
              <input
                type="text"
                name="readTime"
                value={formData.readTime}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
                placeholder="e.g., 5 min read"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Image URL
              </label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Link</label>
              <input
                type="text"
                name="link"
                value={formData.link}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
                placeholder="Article URL"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Excerpt</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              required
              className="textarea textarea-bordered w-full"
              rows="3"
            ></textarea>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Update Article" : "Add Article"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Articles List */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Author</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article._id}>
                <td>{article.title}</td>
                <td className="capitalize">{article.category}</td>
                <td>{article.author}</td>
                <td>
                  <button
                    onClick={() => handleEdit(article)}
                    className="btn btn-sm btn-outline mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(article._id)}
                    className="btn btn-sm btn-error btn-outline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdviceManager;

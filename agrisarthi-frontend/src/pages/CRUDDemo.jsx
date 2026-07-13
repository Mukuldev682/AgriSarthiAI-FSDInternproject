import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Toast from "../components/Toast";
import { cropAPI } from "../utils/api";

const CRUDDemo = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    nameHindi: "",
    emoji: "🌾",
    season: "Rabi",
    description: "",
    diseases: ""
  });

  // Load crops on component mount
  useEffect(() => {
    loadCrops();
  }, []);

  const loadCrops = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cropAPI.getAllCrops();
      if (response.success) {
        setCrops(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const cropData = {
        ...formData,
        diseases: formData.diseases.split(",").map(d => d.trim()).filter(d => d)
      };

      if (editingCrop) {
        // Update existing crop
        await cropAPI.updateCrop(editingCrop._id, cropData);
        setEditingCrop(null);
      } else {
        // Create new crop
        await cropAPI.addCrop(cropData);
      }

      setFormData({
        name: "",
        nameHindi: "",
        emoji: "🌾",
        season: "Rabi",
        description: "",
        diseases: ""
      });
      setShowForm(false);
      loadCrops();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (crop) => {
    setEditingCrop(crop);
    setFormData({
      name: crop.name,
      nameHindi: crop.nameHindi || "",
      emoji: crop.emoji || "🌾",
      season: crop.season,
      description: crop.description || "",
      diseases: crop.diseases ? crop.diseases.join(", ") : ""
    });
    setShowForm(true);
  };

  const handleDelete = async (cropId) => {
    if (!window.confirm("Are you sure you want to delete this crop?")) return;

    try {
      setLoading(true);
      setError(null);
      await cropAPI.deleteCrop(cropId);
      loadCrops();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCrop(null);
    setFormData({
      name: "",
      nameHindi: "",
      emoji: "🌾",
      season: "Rabi",
      description: "",
      diseases: ""
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              🌾 CRUD Operations Demo
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Demonstration of Create, Read, Update, and Delete operations with MongoDB
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mb-6">
            <button
              onClick={() => setShowForm(true)}
              className="bg-leaf-600 hover:bg-leaf-700 text-white px-6 py-3 rounded-xl font-bold transition-colors"
              style={{ backgroundColor: "#16a34a" }}
            >
              ➕ Add New Crop
            </button>
            <button
              onClick={loadCrops}
              className="ml-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-xl font-bold transition-colors"
            >
              🔄 Refresh
            </button>
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  {editingCrop ? "✏️ Edit Crop" : "➕ Add New Crop"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Crop Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Hindi Name
                    </label>
                    <input
                      type="text"
                      name="nameHindi"
                      value={formData.nameHindi}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Emoji
                    </label>
                    <input
                      type="text"
                      name="emoji"
                      value={formData.emoji}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Season *
                    </label>
                    <select
                      name="season"
                      value={formData.season}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Rabi">Rabi</option>
                      <option value="Kharif">Kharif</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Diseases (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="diseases"
                      value={formData.diseases}
                      onChange={handleInputChange}
                      placeholder="e.g. Rust, Blight, Smut"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-leaf-600 hover:bg-leaf-700 text-white px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
                      style={{ backgroundColor: "#16a34a" }}
                    >
                      {loading ? <Loader size="small" /> : (editingCrop ? "Update" : "Create")}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-xl font-bold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Crops List */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                📋 All Crops ({crops.length})
              </h2>
            </div>
            {loading ? (
              <div className="p-8 flex justify-center">
                <Loader size="medium" text="Loading crops..." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Emoji
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Hindi Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Season
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {crops.map((crop) => (
                      <tr key={crop._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-2xl">
                          {crop.emoji}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          {crop.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {crop.nameHindi || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-leaf-100 text-leaf-800 dark:bg-leaf-900 dark:text-leaf-200">
                            {crop.season}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                          {crop.description || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleEdit(crop)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium mr-3"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(crop._id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-3">
              📸 Screenshot Instructions
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-400">
              <li><strong>CREATE:</strong> Click "Add New Crop", fill the form, and submit. Take screenshot of the success message and updated list.</li>
              <li><strong>READ:</strong> Take screenshot of the crops list table showing all records.</li>
              <li><strong>UPDATE:</strong> Click "Edit" on any crop, modify the data, and submit. Take screenshot of the updated record.</li>
              <li><strong>DELETE:</strong> Click "Delete" on any crop, confirm, and take screenshot of the removed record.</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
      {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
    </div>
  );
};

export default CRUDDemo;

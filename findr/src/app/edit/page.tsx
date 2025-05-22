"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function EditPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const item_id = searchParams.get("id") || "";

  const [formData, setFormData] = useState({
    image: "",
    box_location: "",
    lost_at: "",
    description: "",
    found_when: "",
    finder_details: "",
    valid_code: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function formatDateForInput(dateStr: string) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  useEffect(() => {
    if (!item_id) {
      setError("No item ID specified in URL.");
      setLoading(false);
      return;
    }

    async function fetchItem() {
      try {
        const res = await fetch(`/api/edit?id=${item_id}`);
        if (!res.ok) throw new Error("Failed to fetch item data.");
        const data = await res.json();

        setFormData({
          image: data.image || "",
          box_location: data.box_location || "",
          lost_at: data.lost_at || "",
          description: data.description || "",
          found_when: formatDateForInput(data.found_when || ""),
          finder_details: data.finder_details || "",
          valid_code: data.valid_code || "",
        });
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    }

    fetchItem();
  }, [item_id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch("/api/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id, ...formData }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update item.");
      }

      alert("Item updated successfully!");
      router.push("/admin");
    } catch (err) {
      alert((err as Error).message);
    }
  }

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading item data...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white shadow rounded space-y-6">
      <h2 className="text-2xl font-bold text-center">Edit Item #{item_id}</h2>

      {[
        { label: "Image URL", name: "image", type: "text" },
        { label: "Box Location", name: "box_location", type: "text" },
        { label: "Lost At", name: "lost_at", type: "text" },
        { label: "Found When", name: "found_when", type: "datetime-local" },
        { label: "Finder Details", name: "finder_details", type: "text" },
        { label: "Valid Code", name: "valid_code", type: "text" },
      ].map(({ label, name, type }) => (
        <div key={name}>
          <label htmlFor={name} className="block text-sm font-medium mb-1">
            {label}
          </label>
          <input
            type={type}
            name={name}
            id={name}
            value={formData[name as keyof typeof formData]}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
      ))}

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm resize-none focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
      >
        Save Changes
      </button>
    </form>
  );
}

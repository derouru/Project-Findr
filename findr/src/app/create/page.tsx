'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get('username') || '';

  const [formData, setFormData] = useState({
    image: '',
    box_location: '',
    lost_at: '',
    description: '',
    found_when: '',
    finder_details: '',
    valid_code: '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Something went wrong');
        return;
      }

      router.push(`/admin?username=${encodeURIComponent(username)}`);
    } catch {
      setError('Failed to submit form');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 space-y-6 bg-white rounded shadow"
    >
      <div>
        <label htmlFor="image" className="block font-semibold mb-1 text-gray-700">
          Image URL (Firebase)
        </label>
        <input
          type="text"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded text-gray-800"
        />
      </div>

      <div>
        <label htmlFor="box_location" className="block font-semibold mb-1 text-gray-700">
          Box Location
        </label>
        <select
          id="box_location"
          name="box_location"
          value={formData.box_location}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded text-gray-800"
        >
          <option value="" disabled>Select a location</option>
          <option value="NIGS-1">NIGS-1</option>
          <option value="AECH-1">AECH-1</option>
        </select>
      </div>

      <div>
        <label htmlFor="lost_at" className="block font-semibold mb-1 text-gray-700">
          Lost At
        </label>
        <input
          type="text"
          id="lost_at"
          name="lost_at"
          value={formData.lost_at}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded text-gray-800"
        />
      </div>

      <div>
        <label htmlFor="description" className="block font-semibold mb-1 text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full border px-3 py-2 rounded text-gray-800"
        />
      </div>

      <div>
        <label htmlFor="found_when" className="block font-semibold mb-1 text-gray-700">
          Found When
        </label>
        <input
          type="datetime-local"
          id="found_when"
          name="found_when"
          value={formData.found_when}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded text-gray-800"
        />
      </div>

      <div>
        <label htmlFor="finder_details" className="block font-semibold mb-1 text-gray-700">
          Finder Details
        </label>
        <input
          type="text"
          id="finder_details"
          name="finder_details"
          value={formData.finder_details}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded text-gray-800"
        />
      </div>

      <div>
        <label htmlFor="valid_code" className="block font-semibold mb-1 text-gray-700">
          Valid Code
        </label>
        <input
          type="text"
          id="valid_code"
          name="valid_code"
          value={formData.valid_code}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded text-gray-800"
        />
      </div>

      {error && <p className="text-red-600 font-semibold">{error}</p>}

      <button
        type="submit"
        className="w-full bg-amber-300 py-2 rounded font-semibold hover:bg-amber-400 transition"
      >
        Submit
      </button>
    </form>
  );
}

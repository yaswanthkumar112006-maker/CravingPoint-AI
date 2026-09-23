/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  initialValue?: string;
}

export function SearchBar({ 
  placeholder = "Search for restaurant, cuisine or a dish...", 
  onSearch, 
  initialValue = "" 
}: SearchBarProps) {
  const [val, setVal] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(val);
  };

  const handleClear = () => {
    setVal("");
    onSearch("");
  };

  return (
    <form id="cp-search-bar" onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row items-center gap-2 bg-white p-2 sm:p-2.5 rounded-2xl border border-gray-200/90 shadow-md shadow-gray-200/50">
        
        {/* Search Field */}
        <div className="flex-1 w-full relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-gray-400" />
          <input
            type="text"
            className="w-full py-2.5 pl-11 pr-10 text-sm bg-transparent border-0 focus:ring-0 focus:outline-none focus:text-gray-900 font-medium placeholder:text-gray-400"
            placeholder={placeholder}
            value={val}
            onChange={(e) => {
              setVal(e.target.value);
              onSearch(e.target.value);
            }}
          />
          {val && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full sm:w-auto bg-[#E23744] hover:bg-[#D02B38] text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md hover:shadow-red-500/20 select-none active:scale-95 shrink-0"
        >
          Search
        </button>

      </div>
    </form>
  );
}

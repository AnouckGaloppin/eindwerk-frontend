"use client";

import { FC } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Zoek...",
}) => {
  return (
    //de searchbar moet verticaal gecentreerd worden en 50% van de breedte hebben
    <div className="flex justify-center">
      <div className="flex bg-white light:bg-gray-900 text-black light:text-white w-1/2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border p-2 rounded-md"
        />
      </div>
    </div>
  );
};

export default SearchBar;

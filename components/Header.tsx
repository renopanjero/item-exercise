import React from "react";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filterCompleted: boolean;
  handleFilterCompletedChange: () => void;
  handleDoneClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  setSearchTerm,
  filterCompleted,
  handleFilterCompletedChange,
  handleDoneClick,
}) => {
  return (
    <div className="flex justify-between bg-color3 p-10">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-none p-2 rounded-md w-52"
        />
        <button className="bg-color4 text-black rounded-md px-2">Cari</button>
      </div>
      <div className="flex gap-4 justify-center items-center">
        <input
          type="checkbox"
          checked={filterCompleted}
          onChange={handleFilterCompletedChange}
          className="w-8 h-8 rounded-full"
        />

        <button onClick={handleDoneClick} className="text-white">
          Done
        </button>
      </div>
    </div>
  );
};

export default Header;

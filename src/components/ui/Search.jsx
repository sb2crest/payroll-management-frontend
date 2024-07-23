import { CiSearch } from "react-icons/ci";

const Search = ({ placeholder }) => {
  return (
    <div>
      <div className="relative max-w-[400px]">
        <button className="absolute top-1/2 left-2 transform -translate-y-1/2  border-none cursor-pointer rounded-l-lg">
          <CiSearch />
        </button>
        <input
          type="text"
          className=" py-2 text-sm outline-none pl-10 pr-4 bg-white  w-full"
          placeholder={placeholder}
        />
      </div>
      <div className="flex items-center gap-5"></div>
    </div>
  );
};

export default Search;

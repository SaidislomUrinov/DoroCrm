import { Button } from "@material-tailwind/react";

function Search({ onChange, value, placeholder, run }) {
  return (
    <div className="flex items-center justify-center w-full relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white w-full shadow-md p-[0_100px_0_20px] text-[13px_!important] h-[40px] rounded-[10px]"
        placeholder={placeholder}
        onKeyDown={(k) => k.key === "Enter" && value && run}
      />
      <div className="absolute right-[5px]">
        <Button variant="gradient" disabled={!value} size="sm" onClick={run}>
          Search
        </Button>
      </div>
    </div>
  );
}

export default Search;

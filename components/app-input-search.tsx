import { Input } from "./ui/input";

export interface IAppInputSearchProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AppInputSearch({
  value,
  onChange,
}: IAppInputSearchProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          aria-hidden="true"
          className="w-5 h-5 text-gray-500 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="XXXXXXXXXXXXXXXXXXXXXXXXXX"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>
      <Input
        type="search"
        id="default-search"
        placeholder="Search your Module"
        className="pl-10"
        onChange={onChange}
        value={value}
      />
    </div>
  );
}

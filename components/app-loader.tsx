import Image from "next/image";
import Logo from "../public/logo.png";

export default function AppLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 animate-pulse">
      <Image
        className="animate-hflip"
        src={Logo}
        width={32}
        height={32}
        alt="Logo"
      />
      <span className="text-indigo-400 text-md font-medium">Loading...</span>
    </div>
  );
}

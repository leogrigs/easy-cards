import Image from "next/image";
import Logo from "../public/logo.png";

export default function AppLoader() {
  return (
    <div className="flex animate-pulse flex-col items-center justify-center gap-4">
      <Image
        className="animate-hflip"
        src={Logo}
        width={32}
        height={32}
        alt="Logo"
      />
      <span className="text-md font-medium text-indigo-400">Loading...</span>
    </div>
  );
}

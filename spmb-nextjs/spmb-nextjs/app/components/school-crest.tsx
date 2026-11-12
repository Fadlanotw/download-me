import Image from "next/image";

type SchoolCrestProps = {
  className?: string;
};

export default function SchoolCrest({ className }: SchoolCrestProps) {
  return (
    <Image
      className={className}
      src="/garuda-utama-crest.png"
      width={58}
      height={52}
      alt=""
      aria-hidden="true"
    />
  );
}

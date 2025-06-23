import { ChefHatIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const quote = {
  text: "Człowiek nie może prawidłowo myśleć, kochać i spać, jeśli wcześniej porządnie się nie najadał.",
  author: "Virginia Woolf",
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 lg:p-4">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 font-medium font-display text-2xl text-primary"
          >
            <ChefHatIcon className="size-6" />
            grien
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block rounded-xl overflow-hidden">
        <div className="size-full absolute z-20 from-black/80 to-black/0 bg-gradient-to-t flex flex-col justify-end">
          <div className="p-10">
            <h2 className="text-white font-display text-3xl/snug">
              {quote.text}
            </h2>
            <p className="text-white/80 mt-4">- {quote.author}</p>
          </div>
        </div>
        <div className="relative size-full">
          <Image
            src="/food.jpg"
            fill
            alt="Image"
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

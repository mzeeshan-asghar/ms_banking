import Image from "next/image";
import React from "react";

function layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex min-h-screen w-full justify-between font-inter">
      <section className="flex-center size-full max-sm:px-6">
        {children}
      </section>
      <section className="auth-asset">
        <div>
          <Image
            src="/icons/auth-image.svg"
            alt="Auth Image"
            width={500}
            height={500}
          />
        </div>
      </section>
    </main>
  );
}

export default layout;

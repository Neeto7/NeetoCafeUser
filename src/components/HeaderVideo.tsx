"use client";

type HeaderVideoProps = {
  username?: string | null;
  table?: string | null;
};

export const HeaderVideo = ({ username, table }: HeaderVideoProps) => {
  return (
    <section className="relative w-full h-[260px] sm:h-[360px] md:h-[420px] lg:h-[480px] overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/neetocafe.mp4" type="video/mp4" />
      </video>

      {/* Gradient supaya transisi smooth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20"></div>

      {/* Text Overlay */}
      <div className="absolute inset-0 flex flex-col justify-center px-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-md">
          Welcome to Neeto Cafe
        </h1>
        <p className="text-sm sm:text-base opacity-90 mt-1 text-white">
          {username} • Meja {table}
        </p>
      </div>

      {/* Wave separator di bottom */}
      <svg
        className="absolute bottom-[-1px] w-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="#0C2B4E"
          fillOpacity="1"
          d="M0,224L120,224C240,224,480,224,720,218.7C960,213,1200,203,1320,197.3L1440,192L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"
        ></path>
      </svg>
    </section>
  );
};

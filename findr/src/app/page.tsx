// app/page.tsx
'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className="bg-white text-[30px] min-h-screen flex flex-col justify-center items-center">
      {/* LOGO */}
      <div id="logo" className="text-[50px] mb-10">
        <h1><b>FINDR</b></h1>
      </div>

      {/* BUTTONS */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => router.push('/userLost')}
          className="text-black bg-amber-300 hover:bg-amber-500 focus:outline-none font-semibold rounded-full text-lg px-5 py-2.5 text-center mb-2 drop-shadow-gray-500 drop-shadow-lg"
        >
          I lost an item
        </button>
        <button
          onClick={() => router.push('/userFound')}
          className="text-black bg-amber-300 hover:bg-amber-500 focus:outline-none font-semibold rounded-full text-lg px-5 py-2.5 text-center mb-2 drop-shadow-gray-500 drop-shadow-lg"
        >
          I found an item
        </button>
      </div>

      {/* FOOTER */}
      <div className="text-center text-[15px] mt-10">
        <a className="underline" href="/login">Admin Center</a>
      </div>
    </main>
  );
}

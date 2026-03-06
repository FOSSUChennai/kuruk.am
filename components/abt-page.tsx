import { FaGithub } from "react-icons/fa";

export default function About() {
  return (
    // <div className="min-h-screen bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center px-4">
      <div className="bg-black rounded-2xl shadow-lg w-full p-8 md:p-12 text-white">  
        {/* About */}
        <h1 className="text-3xl font-bold mb-6">About</h1>
        <p className="mb-4 leading-relaxed text-gray-200">
          Welcome to <span className="font-semibold text-white">kuruk.am</span> –
          a modern URL shortener forked from <span className="font-semibold text-white">ssn.lat</span>,
          which was originally built by <span className="font-semibold text-white">SSN Lakshya</span>,
          the entrepreneurship club of SSN College of Engineering.
          <br /><br />
          This project has been rebranded and customized to serve a broader audience
          while maintaining the core functionality and quality of the original.
          <br /><br />
          Our goal is to simplify sharing long, messy links into clean,
          short ones that are easy to use and remember.
        </p>

        {/* Disclaimer */}
        <h2 className="text-2xl font-semibold mt-10 mb-4">Disclaimer</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          kuruk.am is provided as-is. We strive for accuracy,
          but we are not responsible for misuse of shortened links or downtime
          caused by third-party services. Use at your own discretion.
        </p>

        {/* Footer */}
        <p className="mt-10 text-sm text-gray-400 text-center">
          Forked with respect from <span className="text-white font-semibold">ssn.lat</span>
        </p>
        <p className="mt-2 text-sm text-gray-400 text-center">
          Original project by <span className="text-white font-semibold">SSN Lakshya Technical Team</span>
        </p>
      </div>
    // </div>
  );
}

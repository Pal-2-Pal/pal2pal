"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [btnAnimateTrig, setBtnTrig] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(1);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="hp-1 w-full h-screen flex flex-col justify-center items-center relative">
      <motion.div
        initial={{ x: "50vw", scale: 0 }}
        animate={{ x: 0, scale: 1 }}
        transition={{ delay: 0.5, duration: 1.5 }}
        className="logo left-5 top-5 z-20 absolute"
      >
        Pal2Pal
      </motion.div>
      <div className="z-20 flex flex-col gap-4 absolute">
        <div className="quote z-20 w-screen flex justify-center">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ x: "-5vw", scale: 1 }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="connect"
          >
            Connect
          </motion.span>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="heal"
          >
            Heal
          </motion.span>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ x: "5vw", scale: 1 }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="thrive"
          >
            Thrive &nbsp;&nbsp;&nbsp;
          </motion.span>
        </div>
        <div className="txt flex-col md:flex-row w-screen flex justify-center items-center">
          <motion.span
            animate={{ x: btnAnimateTrig ? "-20vw" : "-25vw" }}
            transition={{
              delay: loaded ? 0 : 0.5,
              duration: loaded ? 0.2 : 1.5,
              ease: "easeInOut",
            }}
            className="pal"
          >
            PAL
          </motion.span>
          <motion.span className="2">2</motion.span>
          <motion.span
            animate={{ x: btnAnimateTrig ? "20vw" : "25vw" }}
            transition={{
              delay: loaded ? 0 : 0.5,
              duration: loaded ? 0.2 : 1.5,
              ease: "easeInOut",
            }}
            className="pal"
          >
            PAL
          </motion.span>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 1.5 }}
          className="des z-20 flex justify-center text-center flex-col"
        >
          <p>A place to end loneliness</p>
          <p>Space where people can chat and talk</p>
        </motion.div>
      </div>
      <div className="btns h-full w-full flex justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 1.5 }}
          className="flex flex-col md:flex-row justify-center gap-x-48 bottom-0 absolute buttons mb-10 md:mb-20 md:text-8xl z-20"
        >
          <button
            onMouseEnter={() => setBtnTrig(1)}
            onMouseLeave={() => setBtnTrig(0)}
            onClick={() => router.push("./login")}
            className="text-white bg-blue-700 hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500  focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Want someone
          </button>
          <button
            onMouseEnter={() => setBtnTrig(1)}
            onMouseLeave={() => setBtnTrig(0)}
            onClick={() => router.push("./login")}
            className="text-white bg-blue-700 hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500  focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Be for someone
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{
          scale: 0,
          rotate: 45,
        }}
        animate={{
          scale: [0, 2, 1],
          rotate: [45, 45, 0],
        }}
        transition={{
          delay: 0.7,
          duration: 1.5,
        }}
        className="hp-2 w-full h-screen "
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute z-5 w-full h-full object-cover"
        >
          <source src="/1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div
          id="mask"
          className="mask h-full opacity-50 absolute w-full "
        ></div>
      </motion.div>
    </div>
  );
}

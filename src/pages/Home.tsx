import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Github, Linkedin, LogOut, Twitter, Link as L } from "lucide-react";
import toast from "react-hot-toast";

const links = [
  {
    icon: <Twitter size={18} />,
    link: "https://x.com/_namansharma_07",
    title: "Twitter",
  },
  {
    icon: <Linkedin size={18} />,
    link: "https://www.linkedin.com/in/naman-sharma-b46950226/",
    title: "LinkedIn",
  },
  {
    icon: <Github size={18} />,
    link: "https://github.com/namansharma3007/Poll-Chain-frontend",
    title: "GitHub",
  },
];

export default function Home() {
  const { user, logout, loadingLogout } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    class Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;

      constructor() {
        this.x = Math.random() * (canvas?.width ?? 0);
        this.y = Math.random() * (canvas?.height ?? 0);
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        if (!canvas) return;

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(147, 51, 234, 0.8)"; // Increased opacity from 0.5 to 0.8
        ctx.fill();
      }
    }

    const nodes: Node[] = Array.from({ length: 50 }, () => new Node());

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((node) => {
        node.update();
        node.draw();
      });

      nodes.forEach((node1, i) => {
        nodes.slice(i + 1).forEach((node2) => {
          const distance = Math.hypot(node1.x - node2.x, node1.y - node2.y);
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(node1.x, node1.y);
            ctx.lineTo(node2.x, node2.y);
            ctx.strokeStyle = `rgba(147, 51, 234, ${1 - distance / 150})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  const logoutUser = async () => {
    try {
      const response = await logout();
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success(response.message);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <section className="min-h-screen h-max flex flex-col bg-gradient-to-br from-[#0a0520] to-[#130749] relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-50"
        />

        <div className="relative z-10">
          <nav className="w-full h-18 py-5 px-6 flex items-center justify-end">
            <div className="flex items-center justify-between gap-5">
              {user ? (
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt="Profile Pic"
                    className="h-10 w-10 rounded-full"
                  />
                  <p className="font-semibold text-gray-200">{user.username}</p>
                  <button
                    onClick={logoutUser}
                    disabled={loadingLogout}
                    className={`flex items-center justify-center gap-2 text-sm text-white font-semibold px-4 py-2 rounded-lg w-full ${
                      loadingLogout
                        ? "cursor-not-allowed bg-red-900"
                        : "cursor-pointer bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {loadingLogout ? (
                      <div className="flex justify-center items-center">
                        <div className="w-5 h-5 rounded-full border-[3px] border-solid border-gray-900 border-l-transparent animate-spin"></div>
                      </div>
                    ) : (
                      <>
                        <LogOut size={18} />
                        Logout
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-4 py-1 rounded-md border border-gray-700 hover:bg-gray-700 text-white font-semibold"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-3 py-1 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                  >
                    Signup
                  </Link>
                </div>
              )}
            </div>
          </nav>

          <main className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Welcome to PollChain
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl text-lg">
              The next generation of decentralized polling powered by blockchain
              technology. Your voice matters and your vote is immutable.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link
                to={user ? "/dashboard" : "/login"}
                className="px-8 py-2 rounded-full font-semibold text-lg bg-purple-600 hover:bg-purple-700 text-white"
              >
                Go to dashboard
              </Link>
            </div>
          </main>

          <footer className="absolute right-10 text-white">
            <div className="relative group inline-block">
              <div className="p-1 rounded-full bg-white cursor-pointer z-10 relative">
                <div className="p-3 hover:bg-purple-700 hover:text-white text-purple-600 rounded-full">
                  <L size={18} />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 flex gap-2 p-1 bg-white rounded-full transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 translate-x-full group-hover:translate-x-0">
                {links.map((link, index) => (
                  <a
                    key={index}
                    href={link.link}
                    target="_blank"
                    rel="noreferrer"
                    data-title={link.title}
                    className="p-3 rounded-full hover:bg-purple-600 hover:text-white text-purple-700 relative
                             after:content-[attr(data-title)] after:absolute after:-top-8 after:left-1/2 
                             after:-translate-x-1/2 after:bg-gray-800 after:text-white after:text-xs 
                             after:px-2 after:py-1 after:rounded-md after:opacity-0 after:transition-opacity
                             hover:after:opacity-100 after:pointer-events-none"
                  >
                    {link.icon}
                  </a>
                ))}
                <div className="p-3 ml-4"></div>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </>
  );
}

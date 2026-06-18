import Image from "next/image";

const projects = [
  {
    title: "Personal Portfolio",
    description: "A beautiful, responsive portfolio website to showcase my design and programming skills.",
    image: "/next.svg",
    link: "#",
    tags: ["Next.js", "TailwindCSS", "Design"],
  },
  {
    title: "Creative UI Kit",
    description: "A modern UI kit for rapid prototyping and beautiful interfaces.",
    image: "/file.svg",
    link: "#",
    tags: ["UI/UX", "React", "Open Source"],
    download: null,
  },
  {
    title: "Code Playground",
    description: "An interactive coding playground for experimenting with JavaScript and CSS.",
    image: "/window.svg",
    link: "#",
    tags: ["JavaScript", "CSS", "Fun"],
    download: null,
  },
  {
    title: "Unity Game Demo",
    description: "A fun Unity game. Download and play!",
    image: "/vercel.svg",
    link: "#",
    tags: ["Unity", "Game", "C#"],
    download: "/downloads/unity-game.zip",
  },
  {
    title: "Android APK App",
    description: "A useful Android app. Download the APK to install.",
    image: "/globe.svg",
    link: "#",
    tags: ["Android", "Java", "APK"],
    download: "/downloads/myapp.apk",
  },
];

export default function Home() {
  return (
    <div className="relative overflow-x-clip min-h-screen w-full">
      {/* Decorative Color Spots & Animated Gradients */}
      <div className="fixed inset-0 -z-10 w-full h-full bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#f8fafc] dark:from-[#18181b] dark:via-[#23272f] dark:to-[#18181b]" />
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-pink-300/40 rounded-full blur-3xl z-0 animate-pulse" />
      <div className="absolute top-[60vh] right-[-100px] w-80 h-80 bg-blue-300/40 rounded-full blur-3xl z-0 animate-pulse" />
      <div className="absolute bottom-[-100px] left-[40vw] w-60 h-60 bg-yellow-200/40 rounded-full blur-3xl z-0 animate-pulse" />
      <div className="absolute top-[30vh] left-[-60px] w-40 h-40 bg-gradient-to-br from-purple-400/40 to-pink-400/30 rounded-full blur-2xl z-0 animate-spin-slow" />
      
      {/* About Section - Combined with Home */}
      <section id="about" className="flex flex-col items-center justify-center min-h-[80vh] gap-10 text-center relative z-10 transition-all duration-700">
        <div className="group relative">
          <Image
            src="/nati-avatar.webp"
            alt="Nati Birhauz Avatar"
            width={260}
            height={260}
            className="rounded-full shadow-2xl border-8 border-blue-400 group-hover:scale-105 transition-transform duration-500 bg-white/80"
            priority
          />
          <span className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-tr from-pink-400 to-blue-400 rounded-full blur-sm animate-bounce" />
        </div>
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-2 animate-gradient-x">
          Netanel Birhauz
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 animate-fade-in">
          Designer & Programmer
        </h2>
        <p className="max-w-xl text-lg text-gray-700 dark:text-gray-300 animate-fade-in">
          Hi! I&apos;m **Netanel Birhauz**, programming and designing since I was 15 years old. I&apos;m an **M.Sc. student in Software Engineering** with a specialization in A.I. I love managing projects and teams and am passionate about programming and the people I work with.
        </p>
        <div className="flex flex-wrap gap-4 justify-center mt-4 animate-fade-in">
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-4 py-2 rounded-full font-medium">Programmer</span>
          <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-4 py-2 rounded-full font-medium">QA</span>
          <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-4 py-2 rounded-full font-medium">Network Engineer</span>
          <span className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 px-4 py-2 rounded-full font-medium">Project Manager</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-8 mt-8 justify-center animate-fade-in">
          <div className="bg-white/80 dark:bg-black/60 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 min-w-[220px] hover:scale-105 transition-transform duration-300">
            <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Tools</h3>
            <ul className="text-gray-700 dark:text-gray-300 text-left list-disc list-inside">
              <li>Wireshark</li>
              <li>RF analyzer</li>
              <li>Jira</li>
              <li>Git</li>
              <li>Firebase</li>
              <li>Unity</li>
              <li>WordPress</li>
              <li>Photoshop</li>
            </ul>
          </div>
          <div className="bg-white/80 dark:bg-black/60 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 min-w-[220px] hover:scale-105 transition-transform duration-300">
            <h3 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">Languages</h3>
            <ul className="text-gray-700 dark:text-gray-300 text-left list-disc list-inside">
              <li>Java</li>
              <li>C</li>
              <li>C++</li>
              <li>HTML</li>
              <li>CSS</li>
              <li>Android</li>
              <li>Python</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="flex flex-col items-center justify-center min-h-[70vh] gap-8 py-16 relative z-10 transition-all duration-700">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center animate-fade-in">Projects</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-4 animate-fade-in">
          {projects.map((project, idx) => (
            <div key={idx} className="bg-white/80 dark:bg-black/60 rounded-xl shadow-lg p-6 flex flex-col gap-4 border border-gray-200 dark:border-gray-700 hover:scale-[1.05] transition-transform duration-300 hover:shadow-2xl">
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="block mx-auto">
                <Image
                  src={project.image}
                  alt={project.title + ' image'}
                  width={120}
                  height={120}
                  className="rounded-lg shadow-md hover:scale-110 transition-transform duration-300 bg-white"
                />
              </a>
              <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-400">{project.title}</h2>
              <p className="text-gray-700 dark:text-gray-300">{project.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.tags.map((tag, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-medium">{tag}</span>
                ))}
              </div>
              <div className="flex gap-4 mt-2 justify-center">
                <a href={project.link} className="text-blue-600 dark:text-blue-400 hover:underline font-medium" target="_blank" rel="noopener noreferrer">View Project</a>
                {project.download && (
                  <a href={project.download} className="text-green-600 dark:text-green-400 hover:underline font-medium" download>Download</a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="flex flex-col items-center justify-center min-h-[40vh] gap-8 py-16 relative z-10 transition-all duration-700">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 animate-fade-in">Contact</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 animate-fade-in">Let&apos;s connect! Reach out to me on LinkedIn or GitHub.</p>
        <div className="flex gap-6 animate-fade-in">
          <a href="https://github.com/natibirhauz" target="_blank" rel="noopener noreferrer" className="px-6 py-2 rounded-full bg-gradient-to-r from-gray-900 to-blue-700 text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-300">GitHub</a>
          <a href="https://www.linkedin.com/in/nati-birhauz-296724159/" target="_blank" rel="noopener noreferrer" className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-700 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-300">LinkedIn</a>
        </div>
      </section>
    </div>
  );
}
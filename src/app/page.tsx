import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url('/assets/image2.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold text-green-400 mb-6 tracking-tight">
            CollabLedger
          </h1>
          <p className="text-white text-xl md:text-2xl mb-4 max-w-3xl mx-auto leading-relaxed">
            CollabLedger is an <span className="text-green-400 font-semibold">open-source platform</span> for{" "}
            <span className="text-green-400 font-semibold">NGOs</span> and{" "}
            <span className="text-green-400 font-semibold">contributors</span> to eliminate duplicate work. 
            Discover active projects, align tasks, and accelerate social impact.
          </p>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
            Built with transparency at its core, CollabLedger ensures every contribution moves the mission forward—no more rebuilding what already exists.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-purple-900 mb-6">
            Mission of the Project !
          </h2>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed">
            CollabLedger is a non-profit organization with a primary mission to provide opportunities for individuals to 
            harness their creativity and organized skills to generate operations that benefit the community. Through 
            collaboration and structured project management, we encourage open dialogue to positively impact our local and global community.
          </p>
        </div>
      </section>

      {/* Project Card 1 - Left Image */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-green-400 rounded-full"></div>
              <div className="relative rounded-full overflow-hidden w-80 h-80 mx-auto border-8 border-gray-100 shadow-2xl">
                <Image
                  src="/assets/image2.png"
                  alt="Community collaboration"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-purple-600 rounded-full"></div>
            </div>

            {/* Content */}
            <div>
              <h3 className="text-3xl font-bold text-purple-900 mb-4">
                Future Projects and Activities
              </h3>
              <p className="text-gray-700 leading-relaxed">
                CollabLedger is a charitable organization with a primary intent to provide opportunities for individuals to harness 
                their creativity and organizing skills to generate operations that benefit the community. Through open dialogue and 
                structured collaboration, we encourage contributions that positively impact our local and global community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Card 2 - Green Wave Background */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-green-400 rounded-[100px] transform -skew-y-3"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Content (Left) */}
            <div className="text-purple-900">
              <h3 className="text-3xl font-bold mb-4">
                Future Projects and Activities
              </h3>
              <p className="leading-relaxed">
                CollabLedger is a charitable organization with a primary intent to provide opportunities for individuals to harness 
                their creativity and organizing skills to generate operations that benefit the community. Through active task alignment 
                and resource sharing, we aim to positively impact our local and global community.
              </p>
            </div>

            {/* Image (Right) */}
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-600 rounded-full"></div>
              <div className="relative rounded-full overflow-hidden w-80 h-80 mx-auto border-8 border-white shadow-2xl">
                <Image
                  src="/assets/image2.png"
                  alt="Garden project"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Card 3 - Right Image */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative order-2 md:order-1">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-green-400 rounded-full"></div>
              <div className="relative rounded-full overflow-hidden w-80 h-80 mx-auto border-8 border-gray-100 shadow-2xl">
                <Image
                  src="/assets/image2.png"
                  alt="Project planning"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-purple-600 rounded-full"></div>
            </div>

            {/* Content */}
            <div className="order-1 md:order-2">
              <h3 className="text-3xl font-bold text-purple-900 mb-4">
                Future Projects and Activities
              </h3>
              <p className="text-gray-700 leading-relaxed">
                CollabLedger is a charitable organization with a primary intent to provide opportunities for individuals to harness 
                their creativity and organizing skills to generate operations that benefit the community. We channel collective expertise 
                to drive meaningful change that positively impacts our local and global community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Card 4 - Green Wave Background (Reversed) */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-green-400 rounded-[100px] transform skew-y-3"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Content (Left) */}
            <div className="text-purple-900">
              <h3 className="text-3xl font-bold mb-4">
                Future Projects and Activities
              </h3>
              <p className="leading-relaxed">
                CollabLedger is a charitable organization with a primary intent to provide opportunities for individuals to harness 
                their creativity and organizing skills to generate operations that benefit the community. Together, we build systems 
                that positively impact our local and global community.
              </p>
            </div>

            {/* Image (Right) */}
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-600 rounded-full"></div>
              <div className="relative rounded-full overflow-hidden w-80 h-80 mx-auto border-8 border-white shadow-2xl">
                <Image
                  src="/assets/image2.png"
                  alt="New projects"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center bg-linear-to-br from-purple-50 to-white rounded-3xl py-16 shadow-xl">
          <h2 className="text-4xl font-bold text-purple-900 mb-6">
            Do you have any questions?
          </h2>
          <p className="text-gray-700 mb-8 text-lg">
            Contact{" "}
            <a href="mailto:hello@collabledger.org" className="text-purple-600 font-semibold underline">
              hello@collabledger.org
            </a>{" "}
            to get more information on the organization
          </p>
          <a
            href="/signup"
            className="inline-block bg-green-400 hover:bg-green-500 text-purple-900 font-bold px-10 py-4 rounded-full transition shadow-lg text-lg"
          >
            Take Action
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <p className="mb-2">
              <span className="inline-block mr-3">📍</span> Located in California, USA
            </p>
            <p className="mb-2">
              <span className="inline-block mr-3">📞</span> +01 987654310
            </p>
            <p className="mb-2">
              <span className="inline-block mr-3">✉️</span> hello@collabledger.org
            </p>
            <p className="mb-2">
              <span className="inline-block mr-3">🌐</span> www.collabledger.org
            </p>
          </div>

          <div className="border-t border-white/20 pt-6 text-center">
            <p className="text-sm text-gray-300">© 2026 CollabLedger - All Rights Reserved</p>
            <div className="flex justify-center gap-6 mt-4">
              <a href="#" className="hover:text-green-400 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-green-400 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-green-400 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121L7.673 13.98l-2.885-.903c-.626-.196-.64-.615.135-.916l11.283-4.35c.52-.19.976.12.806.917z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

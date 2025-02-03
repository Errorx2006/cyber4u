import React, { useEffect, useRef } from 'react';
import { Terminal, Code2, Boxes, ShieldAlert, Gift, UserCheck, Brush as Virus, Bug, Link as Linux, CreditCard, ShoppingBag, User, Mail, Github, Twitter, Send } from 'lucide-react';
import * as THREE from 'three';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup with fog for depth
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 50, 1000);
    sceneRef.current = scene;

    // Camera setup with wider FOV for better immersion
    const camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    cameraRef.current = camera;

    // High-performance renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Optimized star creation
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      size: 0.15,
      transparent: true,
      opacity: 1,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    // Reduced number of stars for better performance
    const starCount = 8000;
    const starVertices = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const color = new THREE.Color();

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      // Distribute stars in a more natural pattern
      const radius = Math.random() * 1000;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      starVertices[i3] = radius * Math.sin(phi) * Math.cos(theta);
      starVertices[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starVertices[i3 + 2] = radius * Math.cos(phi);

      // Enhanced color variation
      const colorChoice = Math.random();
      if (colorChoice < 0.15) {
        // Blue-ish stars
        color.setRGB(0.7, 0.8, 1);
      } else if (colorChoice < 0.25) {
        // Red-ish stars
        color.setRGB(1, 0.8, 0.8);
      } else {
        // White stars with slight variation
        const intensity = 0.8 + Math.random() * 0.2;
        color.setRGB(intensity, intensity, intensity);
      }

      starColors[i3] = color.r;
      starColors[i3 + 1] = color.g;
      starColors[i3 + 2] = color.b;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starVertices, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    starsRef.current = stars;

    // Optimized animation loop
    let lastTime = 0;
    const animate = (time: number) => {
      frameRef.current = requestAnimationFrame(animate);

      // Delta time for smooth animation
      const delta = (time - lastTime) * 0.0001;
      lastTime = time;

      if (starsRef.current) {
        // Smooth rotation based on delta time
        starsRef.current.rotation.x += 0.00005 * delta;
        starsRef.current.rotation.y += 0.0001 * delta;
        starsRef.current.rotation.z += 0.00002 * delta;

        // Update star positions
        const positions = starsRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 2] += 0.05; // Move along z-axis

          // Reset position with slight randomization
          if (positions[i + 2] > 500) {
            positions[i + 2] = -500;
            positions[i] = (Math.random() - 0.5) * 1000;
            positions[i + 1] = (Math.random() - 0.5) * 1000;
          }
        }
        starsRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate(0);

    // Optimized resize handler
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (containerRef.current && rendererRef.current.domElement) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-cyan-500 overflow-hidden">
      <div ref={containerRef} className="fixed inset-0 -z-10" />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center">
            <div className="mb-8 relative inline-block">
              <div className="relative group">
                <img
                  src="https://images.unsplash.com/photo-1701195618122-5c1d1c0c9d1c?auto=format&fit=crop&q=80&w=600&h=600"
                  alt="Cyberpunk Profile"
                  className="w-48 h-48 rounded-full border-4 border-cyan-500 mx-auto transform transition-all duration-500 hover:scale-105 object-cover group-hover:border-purple-500"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 animate-pulse"></div>
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 opacity-30 blur group-hover:opacity-50 transition-opacity"></div>
              </div>
            </div>
            <h1 className="text-7xl font-bold mb-4 relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 animate-gradient relative inline-block">
                CYBERPUNK
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-xl opacity-50 animate-pulse"></div>
              </span>
            </h1>
            <p className="text-xl mb-8 font-mono relative inline-block">
              <span className="typing-animation bg-gradient-to-r from-cyan-500 to-purple-500 text-transparent bg-clip-text">
                Decoding Reality, Encoding Revolution
              </span>
            </p>
            <div className="flex justify-center gap-4">
              {[
                { icon: <Mail className="w-6 h-6" />, href: "#" },
                { icon: <Github className="w-6 h-6" />, href: "#" },
                { icon: <Twitter className="w-6 h-6" />, href: "#" },
                { icon: <Send className="w-6 h-6" />, href: "https://t.me/cyberpunk_about" }
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target={link.href.startsWith('http') ? "_blank" : undefined}
                  rel={link.href.startsWith('http') ? "noopener noreferrer" : undefined}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg opacity-30 blur group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative p-3 bg-black rounded-lg group-hover:bg-black/50 transition-all duration-300">
                    {React.cloneElement(link.icon, {
                      className: "transition-all duration-300 group-hover:text-purple-500"
                    })}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold mb-16 text-center relative">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 animate-gradient relative inline-block">
              SKILLS MATRIX
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-xl opacity-50 animate-pulse"></div>
            </span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              { 
                icon: <ShieldAlert className="w-6 h-6" />, 
                name: 'Grey Hat Hacker',
                image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400'
              },
              { 
                icon: <CreditCard className="w-6 h-6" />, 
                name: 'Binning & Carding',
                image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=400'
              },
              { 
                icon: <Code2 className="w-6 h-6" />, 
                name: 'Analyst',
                image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400'
              },
              { 
                icon: <Bug className="w-6 h-6" />, 
                name: 'Cracking',
                image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400'
              },
              { 
                icon: <Boxes className="w-6 h-6" />, 
                name: 'DDoSer',
                image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=400'
              },
              { 
                icon: <Linux className="w-6 h-6" />, 
                name: 'Kali Linux',
                image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=400'
              },
              { 
                icon: <UserCheck className="w-6 h-6" />, 
                name: 'Phisher',
                image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=400'
              },
              { 
                icon: <User className="w-6 h-6" />, 
                name: 'Session Hijacker',
                image: 'https://images.unsplash.com/photo-1526374870839-e155464bb9b2?auto=format&fit=crop&q=80&w=400'
              },
              { 
                icon: <Terminal className="w-6 h-6" />, 
                name: 'Spoofer',
                image: 'https://images.unsplash.com/photo-1526925539332-aa3b66e35444?auto=format&fit=crop&q=80&w=400'
              },
              { 
                icon: <Virus className="w-6 h-6" />, 
                name: 'Virus Attacker',
                image: 'https://images.unsplash.com/photo-1548092372-0d1bd40894a3?auto=format&fit=crop&q=80&w=400'
              },
              { 
                icon: <Code2 className="w-6 h-6" />, 
                name: 'Programmer',
                image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400'
              },
              { 
                icon: <CreditCard className="w-6 h-6" />, 
                name: 'Stripe Carding',
                image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=400'
              },
              { 
                icon: <CreditCard className="w-6 h-6" />, 
                name: 'Carder',
                image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=400'
              },
              { 
                icon: <Gift className="w-6 h-6" />, 
                name: 'Gift Card Seller',
                image: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&q=80&w=400'
              },
              { 
                icon: <ShoppingBag className="w-6 h-6" />, 
                name: 'Cracked Account Seller',
                image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=400'
              },
            ].map((skill, index) => (
              <div
                key={index}
                className="group relative aspect-square"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full opacity-30 group-hover:opacity-100 transition-all duration-500 blur"></div>
                <div className="relative h-full bg-black/80 rounded-full backdrop-blur-sm border border-cyan-500/10 group-hover:border-purple-500/30 transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden rounded-full">
                    <img
                      src={skill.image}
                      alt={skill.name}
                      className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-all duration-500 scale-110 group-hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/70"></div>
                  </div>
                  <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
                    <div className="mb-2 text-cyan-500 transform transition-all duration-500 group-hover:scale-110 group-hover:text-purple-500">
                      {skill.icon}
                    </div>
                    <h3 className="text-sm font-bold text-center transition-all duration-500 group-hover:text-purple-500">
                      {skill.name}
                    </h3>
                    <div className="mt-2 w-full space-y-1">
                      <div className="flex items-center justify-center text-[10px] font-mono">
                        <span className="text-green-500 animate-pulse">ACTIVE</span>
                      </div>
                      <div className="h-0.5 bg-cyan-950 rounded-full overflow-hidden w-12 mx-auto">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 w-full transform -translate-x-full animate-[fill_2s_ease-out_forwards]"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
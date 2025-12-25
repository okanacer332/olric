import { Button } from "@repo/ui/components/ui/button"; // Ortak bileşeni çekiyoruz

export function Header() {
  const handleLogin = () => {
    // Backend Login kapısına yönlendiriyoruz
    window.location.href = "http://localhost:8080/api/auth/login/google";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="mx-auto px-8 md:px-16 lg:px-24 xl:px-48">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            {/* VOYAGER yerine OLRIC yaptık */}
            <div className="text-2xl font-bold text-[#0c1844]">OLRIC</div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm text-gray-700 hover:text-[#0c1844] transition-colors">
              About
            </a>
            <a href="#pricing" className="text-sm text-gray-700 hover:text-[#0c1844] transition-colors">
              Pricing
            </a>
            <a href="#help" className="text-sm text-gray-400 hover:text-[#0c1844] transition-colors">
              Help
            </a>
            <a href="#blog" className="text-sm text-gray-700 hover:text-[#0c1844] transition-colors">
              Blog
            </a>
            <a href="#security" className="text-sm text-gray-700 hover:text-[#0c1844] transition-colors">
              Data Security
            </a>
            <a href="#contact" className="text-sm text-gray-400 hover:text-[#0c1844] transition-colors">
              Contact
            </a>
          </nav>

          {/* Language & CTA */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-700">
              <span>EN</span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-400">TR</span>
            </div>
            
            {/* Shared UI Button Kullanımı */}
            <Button 
              onClick={handleLogin}
              className="bg-[#0c1844] hover:bg-[#1e3a8a] text-white px-6 py-2.5 rounded-full transition-colors shadow-sm h-auto font-normal"
            >
              Start for free
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
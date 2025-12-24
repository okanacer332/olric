export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8">
      <div className="mx-auto px-8 md:px-16 lg:px-24 xl:px-48">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-gray-600">
          <a href="#about" className="hover:text-[#0c1844] transition-colors">
            About
          </a>
          <a href="#pricing" className="hover:text-[#0c1844] transition-colors">
            Pricing
          </a>
          <a href="#help" className="hover:text-[#0c1844] transition-colors">
            Help
          </a>
          <a href="#blog" className="hover:text-[#0c1844] transition-colors">
            Blog
          </a>
          <a href="#security" className="hover:text-[#0c1844] transition-colors">
            Data Security
          </a>
          <a href="#privacy" className="hover:text-[#0c1844] transition-colors">
            Privacy Notice
          </a>
          <a href="#terms" className="hover:text-[#0c1844] transition-colors">
            Terms of Service
          </a>
          <a href="#refunds" className="hover:text-[#0c1844] transition-colors">
            Refunds
          </a>
          <div className="flex items-center gap-2">
            <span>Follow us on</span>
            <a href="#x" className="text-[#0c1844] hover:text-[#1e3a8a] transition-colors font-medium">
              X
            </a>
            <span>and</span>
            <a href="#linkedin" className="text-[#0c1844] hover:text-[#1e3a8a] transition-colors font-medium">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

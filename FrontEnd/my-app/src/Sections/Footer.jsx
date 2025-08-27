import { FaPhone, FaWhatsapp } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="w-full bg-[#333333] text-white text-sm shadow-inner transition-all duration-300 ">
      <div className="flex flex-col sm:flex-row items-center justify-between w-full px-6 py-3 sm:py-4 mx-auto max-w-7xl gap-2">
        <div className="flex items-center gap-4">
          <span className="font-semibold">Contact Admin:</span>
          <div className="flex items-center gap-2">
            <FaPhone className="text-green-400" />
            <span>+123 456 7890</span>
          </div>
          <div className="flex items-center gap-2">
            <FaWhatsapp className="text-green-400" />
            <span>+123 456 7890</span>
          </div>
        </div>
        <p className="text-gray-300 text-xs sm:text-sm">© 2025 TravelSite. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;

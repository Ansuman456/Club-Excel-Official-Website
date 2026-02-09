import { Hexagon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.webp';

const Navbar = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    return (
        <nav id="navigation" className="fixed top-6 left-0 right-0 z-50 flex justify-center">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 px-6 py-3 rounded-full flex items-center gap-8 hover-trigger transition-all hover:bg-white/10 shadow-2xl shadow-black/50">
                <Link to="/" className="text-sm font-bold tracking-tight text-white flex items-center gap-3">
                    <img src={logo} alt="Club Excel" className="w-8 h-8 object-contain" />
                    CLUB EXCEL
                </Link>
                <div className="hidden lg:flex items-center gap-6">
                    <Link to="/" className="text-[11px] font-medium text-neutral-400 hover:text-white transition-colors uppercase tracking-wide hover-trigger">Home</Link>
                    {isHomePage && (
                        <>
                            <a href="#about" className="text-[11px] font-medium text-neutral-400 hover:text-white transition-colors uppercase tracking-wide hover-trigger">About</a>
                            <a href="#domains" className="text-[11px] font-medium text-neutral-400 hover:text-white transition-colors uppercase tracking-wide hover-trigger">Domains</a>
                        </>
                    )}
                    <Link to="/sankalp" className="text-[11px] font-medium text-neutral-400 hover:text-white transition-colors uppercase tracking-wide hover-trigger">Sankalp</Link>
                    <Link to="/events" className="text-[11px] font-medium text-neutral-400 hover:text-white transition-colors uppercase tracking-wide hover-trigger">Events</Link>
                    <Link to="/ourteam" className="text-[11px] font-medium text-neutral-400 hover:text-white transition-colors uppercase tracking-wide hover-trigger">Our Team</Link>
                    <Link to="/contactus" className="text-[11px] font-medium text-neutral-400 hover:text-white transition-colors uppercase tracking-wide hover-trigger">Contact Us</Link>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/admin-login" className="text-[11px] font-medium text-neutral-400 hover:text-white transition-colors uppercase tracking-wide px-3">
                        Admin
                    </Link>
                    <Link to="/recruitment" className="text-[11px] font-semibold bg-white text-black px-4 py-1.5 rounded-full hover:bg-neutral-200 transition-colors hover-trigger">
                        Join Now
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

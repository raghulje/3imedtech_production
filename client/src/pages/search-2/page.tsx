import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

interface SearchResult {
  id: number;
  title: string;
  date: string;
  url: string;
  index: number;
}

const SearchPage2 = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('s') || '';
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    // AOS initialization
    const initAOS = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('aos-animate');
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px',
        }
      );

      elements.forEach((el) => observer.observe(el));
    };

    initAOS();
  }, []);

  // Page 2 search results (results 11-20)
  const searchResults: SearchResult[] = [
    { 
      id: 698, 
      title: 'Careers', 
      date: 'August 8, 2018', 
      url: '/careers', 
      index: 11 
    },
    { 
      id: 696, 
      title: 'Contact', 
      date: 'August 8, 2018', 
      url: '/contact', 
      index: 12 
    },
    { 
      id: 694, 
      title: 'Why Choose Us', 
      date: 'August 8, 2018', 
      url: '/why-choose-us', 
      index: 13 
    },
    { 
      id: 692, 
      title: 'Our Team', 
      date: 'August 8, 2018', 
      url: '/our-team', 
      index: 14 
    },
    { 
      id: 690, 
      title: 'Leadership', 
      date: 'August 8, 2018', 
      url: '/leadership', 
      index: 15 
    },
    { 
      id: 688, 
      title: 'Company History', 
      date: 'August 8, 2018', 
      url: '/company-history', 
      index: 16 
    },
    { 
      id: 686, 
      title: 'Awards & Recognition', 
      date: 'August 8, 2018', 
      url: '/awards-recognition', 
      index: 17 
    },
    { 
      id: 684, 
      title: 'Partnerships', 
      date: 'August 8, 2018', 
      url: '/partnerships', 
      index: 18 
    },
    { 
      id: 682, 
      title: 'Quality Assurance', 
      date: 'August 8, 2018', 
      url: '/quality-assurance', 
      index: 19 
    },
    { 
      id: 680, 
      title: 'Customer Support', 
      date: 'August 8, 2018', 
      url: '/customer-support', 
      index: 20 
    },
  ];

  const totalResults = 30;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/search?s=${encodeURIComponent(searchInput)}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      {/* Page Title Section */}
      <div className="bg-white py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-[#4A90A4] text-center animate-on-scroll" data-aos="fade-up">
            {totalResults} search results for "{searchQuery}"
          </h1>
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto animate-on-scroll" data-aos="fade-up" data-aos-delay="100">
            <div className="relative">
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search …"
                className="w-full px-6 py-4 text-base border border-gray-300 rounded-md focus:outline-none focus:border-[#4A90A4] transition-colors"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4A90A4] transition-colors"
              >
                <i className="ri-search-line text-xl"></i>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Search Results */}
      <div className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((result, idx) => (
              <article
                key={result.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group animate-on-scroll"
                data-aos="fade-up"
                data-aos-delay={idx * 50}
              >
                <Link to={result.url} className="block p-6 relative">
                  <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-[#E6662F] to-[#FF8C5A] rounded-bl-3xl flex items-center justify-center text-white font-bold text-sm shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    {result.index}
                  </div>
                  
                  <h2 className="text-xl font-bold text-[#1E4C84] mb-3 pr-16 group-hover:text-[#4A90A4] transition-colors duration-300">
                    {result.title}
                  </h2>
                  
                  <span className="text-sm text-gray-600">
                    {result.date}
                  </span>
                </Link>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center items-center gap-2 animate-on-scroll" data-aos="fade-up" data-aos-delay="200">
            <Link
              to="/search?s="
              className="px-4 py-2 rounded bg-white text-[#1E4C84] border border-gray-300 hover:bg-gray-50 transition-colors duration-300"
            >
              <i className="ri-arrow-left-s-line"></i>
            </Link>
            <Link
              to="/search?s="
              className="px-4 py-2 rounded bg-white text-[#1E4C84] border border-gray-300 hover:bg-gray-50 transition-colors duration-300"
            >
              1
            </Link>
            <button
              className="px-4 py-2 rounded bg-[#4A90A4] text-white transition-colors duration-300"
            >
              2
            </button>
            <Link
              to="/search-3?s="
              className="px-4 py-2 rounded bg-white text-[#1E4C84] border border-gray-300 hover:bg-gray-50 transition-colors duration-300"
            >
              3
            </Link>
            <Link
              to="/search-3?s="
              className="px-4 py-2 rounded bg-white text-[#1E4C84] border border-gray-300 hover:bg-gray-50 transition-colors duration-300"
            >
              <i className="ri-arrow-right-s-line"></i>
            </Link>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .animate-on-scroll.aos-animate {
          opacity: 1;
          transform: translateY(0);
        }

        .animate-on-scroll[data-aos-delay="50"] {
          transition-delay: 0.05s;
        }

        .animate-on-scroll[data-aos-delay="100"] {
          transition-delay: 0.1s;
        }

        .animate-on-scroll[data-aos-delay="150"] {
          transition-delay: 0.15s;
        }

        .animate-on-scroll[data-aos-delay="200"] {
          transition-delay: 0.2s;
        }

        .animate-on-scroll[data-aos-delay="250"] {
          transition-delay: 0.25s;
        }

        .animate-on-scroll[data-aos-delay="300"] {
          transition-delay: 0.3s;
        }

        .animate-on-scroll[data-aos-delay="350"] {
          transition-delay: 0.35s;
        }

        .animate-on-scroll[data-aos-delay="400"] {
          transition-delay: 0.4s;
        }

        .animate-on-scroll[data-aos-delay="450"] {
          transition-delay: 0.45s;
        }
      `}</style>
    </div>
  );
};

export default SearchPage2;

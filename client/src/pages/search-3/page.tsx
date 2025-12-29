
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

const SearchPage3 = () => {
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

  // Page 3 search results (results 21-30)
  const searchResults: SearchResult[] = [
    { 
      id: 192, 
      title: 'Tips to make your workforce a security front line', 
      date: 'May 8, 2018', 
      url: '/tips-to-make-your-workforce-a-security-front-line', 
      index: 21 
    },
    { 
      id: 193, 
      title: 'Scan & index manager delivers productivity at beaumont hospital', 
      date: 'May 8, 2018', 
      url: '/scan-index-manager-delivers-productivity-at-beaumont-hospital', 
      index: 22 
    },
    { 
      id: 194, 
      title: 'Partnering with IT provider helps erie manufacturing company thrive in 21st century', 
      date: 'May 8, 2018', 
      url: '/partnering-with-it-provider-helps-erie-manufacturing-company-thrive-in-21st-century', 
      index: 23 
    },
    { 
      id: 195, 
      title: '5 creative ways to address gaps in IT resources and talent', 
      date: 'May 8, 2018', 
      url: '/5-creative-ways-to-address-gaps-in-it-resources-and-talent', 
      index: 24 
    },
    { 
      id: 184, 
      title: 'The top 13 benefits of proactive managed services vs reactive break-fix', 
      date: 'May 8, 2018', 
      url: '/the-top-13-benefits-of-proactive-managed-services-vs-reactive-break-fix', 
      index: 25 
    },
    { 
      id: 179, 
      title: 'Dynamics 365: a game changer for dairygold operations', 
      date: 'May 8, 2018', 
      url: '/dynamics-365-a-game-changer-for-dairygold-operations', 
      index: 26 
    },
    { 
      id: 163, 
      title: 'Monroe county medical society makes one call for IT', 
      date: 'May 8, 2018', 
      url: '/monroe-county-medical-society-makes-one-call-for-it', 
      index: 27 
    },
    { 
      id: 13, 
      title: 'About', 
      date: 'April 24, 2018', 
      url: '/about', 
      index: 28 
    },
    { 
      id: 2, 
      title: 'Home', 
      date: 'April 24, 2018', 
      url: '/', 
      index: 29 
    },
    { 
      id: 1, 
      title: '4 ways compsec pros protect their computers', 
      date: 'April 24, 2018', 
      url: '/4-ways-compsec-pros-protect-their-computers', 
      index: 30 
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
            <Link
              to="/search?s="
              className="px-4 py-2 rounded bg-white text-[#1E4C84] border border-gray-300 hover:bg-gray-50 transition-colors duration-300"
            >
              2
            </Link>
            <button
              className="px-4 py-2 rounded bg-[#4A90A4] text-white transition-colors duration-300"
            >
              3
            </button>
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

export default SearchPage3;

import { useState, useEffect } from "react";

export default function MemeViewer() {
  const [meme, setMeme] = useState(null);
  const [subreddit, setSubreddit] = useState("memes");
  const [allowNSFW, setAllowNSFW] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const fetchMeme = async () => {
    setIsLoading(true);
    setIsAnimating(true);
    try {
      const res = await fetch(`https://meme-api.com/gimme/${subreddit}`);
      if (!res.ok) throw new Error('Failed to fetch meme');
      const data = await res.json();
      // Skip if NSFW and not allowed
      if (!allowNSFW && data.nsfw) return fetchMeme();
      setMeme(data);
    } catch (error) {
      console.error("Error fetching meme:", error);
      alert("Failed to fetch meme. Please try again.");
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  useEffect(() => {
    fetchMeme();
  }, [subreddit, allowNSFW]);

  const downloadMeme = async () => {
    try {
      const response = await fetch(meme.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${meme.title.replace(/[^a-z0-9]/gi, "_")}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading meme:", error);
      alert("Failed to download meme. Please try again.");
    }
  };

  const shareMeme = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: meme.title,
          url: meme.url,
        });
      } else {
        await navigator.clipboard.writeText(meme.url);
        alert("Meme link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing meme:", error);
      alert("Failed to share meme. Please try again.");
    }
  };

  if (!meme && isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        {/* Controls */}
        <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500">
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <input
              type="text"
              value={subreddit}
              onChange={(e) => setSubreddit(e.target.value)}
              placeholder="Subreddit"
              className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
            />
            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={allowNSFW}
                onChange={(e) => setAllowNSFW(e.target.checked)}
                className="w-4 h-4 rounded focus:ring-2 focus:ring-blue-400"
              />
              Allow NSFW
            </label>
          </div>
        </div>

        {/* Meme Container */}
        <div className="relative p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <h2 className="text-xl font-bold mb-4 text-gray-800">{meme.title}</h2>
              <div className="relative group">
                <img 
                  src={meme.url} 
                  alt={meme.title} 
                  className="w-full rounded-lg shadow-md transition-transform duration-300 group-hover:scale-[1.02]"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x300?text=Failed+to+load+meme';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg"></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                r/{meme.subreddit} | by {meme.author} | 👍 {meme.ups}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 bg-gray-50 flex flex-wrap gap-3 justify-center">
          <button 
            onClick={fetchMeme} 
            className="bg-blue-500 text-white px-6 py-2 rounded-lg transform transition-all duration-200 hover:scale-105 hover:bg-blue-600 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          >
            Next Meme
          </button>
          <button 
            onClick={downloadMeme} 
            className="bg-green-500 text-white px-6 py-2 rounded-lg transform transition-all duration-200 hover:scale-105 hover:bg-green-600 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
          >
            Download
          </button>
          <button 
            onClick={shareMeme} 
            className="bg-purple-500 text-white px-6 py-2 rounded-lg transform transition-all duration-200 hover:scale-105 hover:bg-purple-600 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

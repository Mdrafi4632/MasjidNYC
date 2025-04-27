import { supabase } from "./supabaseClient";
import { useState, useEffect, useRef } from "react";
import "./App.css";

export default function App() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [boroughFilter, setBoroughFilter] = useState("");
  const [selectedMasjid, setSelectedMasjid] = useState(null);
  const [masjids, setMasjids] = useState([]);
  const detailRef = useRef(null);
  const [newMasjid, setNewMasjid] = useState({
    title: "",
    description: "",
    rating: 0,
    tags: [],
    borough: "",
  });

  const defaultMasjids = [
    {
      id: 1,
      title: "Masjid At-Taqwa",
      description: "Passionate khutbahs & vibrant community.",
      rating: 5,
      upvotes: 92,
      createdAt: "4/25/2025, 11:00 AM",
      borough: "Brooklyn",
      tags: ["Women’s space", "Qiyam", "Khutbah vibes"],
    },
    {
      id: 2,
      title: "North Bronx Islamic Center",
      description: "Lovely Community.",
      rating: 4,
      upvotes: 80,
      createdAt: "4/25/2025, 11:01 AM",
      borough: "Bronx",
      tags: ["Jummah", "Islamic School", "Women’s space"],
    },
    {
      id: 3,
      title: "Masjid Manhattan",
      description: "Historic masjid in the heart of downtown.",
      rating: 5,
      upvotes: 79,
      createdAt: "4/25/2025, 11:02 AM",
      borough: "Manhattan",
      tags: ["Daily Salah", "Friday Khutbah", "Quran Classes"],
    },
    {
      id: 4,
      title: "Masjid Al-Falah",
      description: "Active youth group and beautiful Taraweeh.",
      rating: 5,
      upvotes: 21,
      createdAt: "4/25/2025, 11:03 AM",
      borough: "Queens",
      tags: ["Youth Programs", "Taraweeh", "Parking available"],
    },
    {
      id: 5,
      title: "ICNA Masjid Queens",
      description: "Multilingual khutbahs & diverse community.",
      rating: 4,
      upvotes: 93,
      createdAt: "4/25/2025, 11:04 AM",
      borough: "Queens",
      tags: ["Multilingual", "Women’s space", "Ramadan programs"],
    },
    {
      id: 6,
      title: "Masjid Rahmah",
      description: "Peaceful and welcoming environment.",
      rating: 5,
      upvotes: 34,
      createdAt: "4/25/2025, 11:05 AM",
      borough: "Bronx",
      tags: ["Qiyam", "Open 24/7", "Wheelchair access"],
    },
    {
      id: 7,
      title: "Masjid Al-Iman",
      description: "Family-focused programs and halaqas.",
      rating: 4,
      upvotes: 56,
      createdAt: "4/25/2025, 11:06 AM",
      borough: "Brooklyn",
      tags: ["Halaqah", "Family Friendly", "Community meals"],
    },
    {
      id: 8,
      title: "Masjid Ar-Rahman",
      description: "Strong Dawah efforts and weekend school.",
      rating: 3,
      upvotes: 87,
      createdAt: "4/25/2025, 11:07 AM",
      borough: "Staten Island",
      tags: ["Dawah", "Weekend School", "Youth Programs"],
    },
    {
      id: 9,
      title: "Masjid Abu Bakr",
      description: "Spacious with clean wudu area.",
      rating: 5,
      upvotes: 21,
      createdAt: "4/25/2025, 11:08 AM",
      borough: "Bronx",
      tags: ["Wudu area", "Taraweeh", "Friday Jummah"],
    },
    {
      id: 10,
      title: "Masjid Omar",
      description: "Known for powerful Friday khutbahs.",
      rating: 4,
      upvotes: 45,
      createdAt: "4/25/2025, 11:09 AM",
      borough: "Manhattan",
      tags: ["Khutbah vibes", "Janazah service", "Parking available"],
    },
  ];

  useEffect(() => {
    async function fetchMasjids() {
      const { data, error } = await supabase.from("masjids").select("*");
      if (error) {
        console.error("Error fetching masjids:", error);
      } else {
        setMasjids([...defaultMasjids, ...(data || [])]);
      }
    }
    fetchMasjids();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMasjid.title.trim() || newMasjid.rating === 0) {
      alert("Please enter both a name and a rating.");
      return;
    }
    const newPost = {
      title: newMasjid.title,
      description: newMasjid.description,
      borough: newMasjid.borough,
      rating: newMasjid.rating,
      upvotes: 0,
      tags: newMasjid.tags.length > 0 ? newMasjid.tags.join(",") : "",
      created_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from("masjids")
      .insert([newPost])
      .select();
    if (error) {
      console.error("Error inserting masjid:", error.message);
      alert("Error adding masjid.");
    } else {
      setMasjids([data[0], ...masjids]);
      setNewMasjid({
        title: "",
        description: "",
        rating: 0,
        tags: [],
        borough: "",
      });
      setShowForm(false);
    }
  };

  const handleUpvote = async (id) => {
    const masjid = masjids.find((m) => m.id === id);
    if (!masjid) return;
    const { error } = await supabase
      .from("masjids")
      .update({ upvotes: masjid.upvotes + 1 })
      .eq("id", id);
    if (error) {
      console.error("Error upvoting:", error);
    } else {
      setMasjids(
        masjids.map((m) =>
          m.id === id ? { ...m, upvotes: m.upvotes + 1 } : m,
        ),
      );
    }
  };

  const handleRemoveSelected = async () => {
    if (!selectedMasjid) return;
    const { error } = await supabase
      .from("masjids")
      .delete()
      .eq("id", selectedMasjid.id);
    if (error) {
      console.error("Error deleting masjid:", error.message);
      alert("Error deleting masjid.");
    } else {
      setMasjids(masjids.filter((m) => m.id !== selectedMasjid.id));
      setSelectedMasjid(null);
    }
  };

  const filteredMasjids = masjids.filter((masjid) => {
    const matchesSearch = masjid.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesBorough = boroughFilter
      ? masjid.borough === boroughFilter
      : true;
    return matchesSearch && matchesBorough;
  });

  return (
    <main className="main-container">
      <img
        src="/NYC logo Trans.png"
        alt="Masjid NYC Logo"
        className="masjid-logo"
        style={{ width: "400px", height: "auto", marginBottom: "1rem" }}
      />
      <h1 className="welcome-banner">Find your next Masjid in NYC 🕌</h1>

      <div className="search-container">
        <input
          className="search-bar"
          type="text"
          placeholder="🔍 Search by name, borough, or keyword"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="clear-search" onClick={() => setSearchTerm("")}>
            Clear
          </button>
        )}
      </div>

      <div className="borough-filters">
        {["Brooklyn", "Bronx", "Manhattan", "Queens", "Staten Island"].map(
          (borough) => (
            <button
              key={borough}
              className={`borough-button ${boroughFilter === borough ? "selected" : ""}`}
              onClick={() => setBoroughFilter(borough)}
            >
              {borough}
            </button>
          ),
        )}
        {boroughFilter && (
          <button
            className="borough-button clear-button"
            onClick={() => setBoroughFilter("")}
          >
            Clear Filter
          </button>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <button
          onClick={() => setShowForm(!showForm)}
          className="action-button add-button"
        >
          {showForm ? "Cancel" : " + Add Masjid"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="post-form">
          <input
            type="text"
            placeholder="Masjid Name (required)"
            value={newMasjid.title}
            onChange={(e) =>
              setNewMasjid({ ...newMasjid, title: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={newMasjid.description}
            onChange={(e) =>
              setNewMasjid({ ...newMasjid, description: e.target.value })
            }
          />
          <select
            value={newMasjid.borough}
            onChange={(e) =>
              setNewMasjid({ ...newMasjid, borough: e.target.value })
            }
            required
            className="borough-select"
          >
            <option value="">Select Borough (required)</option>
            <option value="Brooklyn">Brooklyn</option>
            <option value="Bronx">Bronx</option>
            <option value="Manhattan">Manhattan</option>
            <option value="Queens">Queens</option>
            <option value="Staten Island">Staten Island</option>
          </select>
          <div className="rating-box">
            <label>Rating (required)</label>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= newMasjid.rating ? "star filled" : "star"}
                  onClick={() => setNewMasjid({ ...newMasjid, rating: star })}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>
          <div className="tag-selector">
            {[
              "Women’s space",
              "Qiyam",
              "Halaqah",
              "Islamic School",
              "Youth Programs",
              "Taraweeh",
              "Friday Khutbah",
              "Parking",
            ].map((tag) => (
              <button
                type="button"
                key={tag}
                className={
                  newMasjid.tags.includes(tag)
                    ? "tag-button selected"
                    : "tag-button"
                }
                onClick={() => {
                  const tags = newMasjid.tags.includes(tag)
                    ? newMasjid.tags.filter((t) => t !== tag)
                    : [...newMasjid.tags, tag];
                  setNewMasjid({ ...newMasjid, tags });
                }}
              >
                {tag}
              </button>
            ))}
          </div>
          <button type="submit">Submit</button>
        </form>
      )}

      <section className="post-feed">
        {filteredMasjids.map((masjid) => (
          <div
            className="post-card"
            key={masjid.id}
            onClick={() => {
              setSelectedMasjid({
                ...masjid,
                createdAt: masjid.createdAt || masjid.created_at || "",
                tags: masjid.tags
                  ? Array.isArray(masjid.tags)
                    ? masjid.tags
                    : masjid.tags.split(",")
                  : [],
              });
              setTimeout(() => {
                detailRef.current?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            style={{ cursor: "pointer" }}
          >
            <div className="masjid-header">
              <h3 className="masjid-name">{masjid.title}</h3>
              <div className="rating">⭐ {masjid.rating}</div>
            </div>
            <div className="upvotes">👍 {masjid.upvotes} Upvotes</div>
            <button
              className="upvote-button"
              onClick={(e) => {
                e.stopPropagation();
                handleUpvote(masjid.id);
              }}
            >
              Upvote
            </button>
          </div>
        ))}
      </section>

      {selectedMasjid && (
        <div className="masjid-details-card" ref={detailRef}>
          <h2 className="details-title">{selectedMasjid.title}</h2>
          <p className="details-description">{selectedMasjid.description}</p>
          <div className="details-info">
            <p>
              <strong>Borough:</strong> {selectedMasjid.borough}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {selectedMasjid.createdAt.includes("T")
                ? new Date(selectedMasjid.createdAt).toLocaleString()
                : selectedMasjid.createdAt}
            </p>
            <p>
              <strong>Rating:</strong> {selectedMasjid.rating} ⭐
            </p>
            <p>
              <strong>Upvotes:</strong> {selectedMasjid.upvotes} 👍
            </p>
          </div>
          <div className="details-tags">
            {selectedMasjid.tags.map((tag, i) => (
              <span className="details-tag" key={i}>
                {tag.trim()}
              </span>
            ))}
          </div>
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            <button
              className="details-close-button"
              onClick={() => setSelectedMasjid(null)}
            >
              Close
            </button>
            <button
              className="details-close-button"
              onClick={handleRemoveSelected}
            >
              🗑 Remove Masjid
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

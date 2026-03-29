import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Grid3X3, List, Star, Filter, X, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";

interface MentorWithProfile {
  id: string;
  user_id: string;
  headline: string | null;
  bio: string | null;
  years_experience: number;
  hourly_rate: number;
  rating: number;
  total_reviews: number;
  total_sessions: number;
  expertise: string[];
  available: boolean;
  profile: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  categories: { name: string }[];
}

const MentorSearch = () => {
  const [mentors, setMentors] = useState<MentorWithProfile[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [minRating, setMinRating] = useState("any");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchMentors();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("id, name");
    if (data) setCategories(data);
  };

  const fetchMentors = async () => {
    setLoading(true);
    const { data: mentorData } = await supabase
      .from("mentor_profiles")
      .select(`
        *,
        profile:profiles!mentor_profiles_user_id_fkey(full_name, avatar_url),
        mentor_categories(category:categories(name))
      `)
      .eq("available", true);

    if (mentorData) {
      const mapped = mentorData.map((m: any) => ({
        ...m,
        profile: m.profile,
        categories: m.mentor_categories?.map((mc: any) => mc.category) ?? [],
      }));
      setMentors(mapped);
    }
    setLoading(false);
  };

  const filtered = mentors.filter((m) => {
    const matchesSearch =
      !search ||
      m.profile?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.headline?.toLowerCase().includes(search.toLowerCase()) ||
      m.expertise?.some((e) => e.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory =
      selectedCategory === "all" ||
      m.categories.some((c) => c.name === selectedCategory);
    const matchesPrice = m.hourly_rate >= priceRange[0] && m.hourly_rate <= priceRange[1];
    const matchesRating = minRating === "any" || m.rating >= parseFloat(minRating);
    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  const MentorCard = ({ mentor, index }: { mentor: MentorWithProfile; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={`/mentor/${mentor.id}`}
        className={`block bg-card rounded-xl border border-border hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
          viewMode === "list" ? "flex gap-6 p-4" : ""
        }`}
      >
        <div className={viewMode === "list" ? "w-20 h-20 flex-shrink-0" : "p-6 pb-0"}>
          <div
            className={`bg-accent rounded-xl flex items-center justify-center font-bold text-accent-foreground ${
              viewMode === "list" ? "w-20 h-20 text-xl" : "w-full h-48 text-4xl mb-4"
            }`}
          >
            {mentor.profile?.avatar_url ? (
              <img src={mentor.profile.avatar_url} alt="" className="w-full h-full object-cover rounded-xl" />
            ) : (
              mentor.profile?.full_name?.charAt(0) || "M"
            )}
          </div>
        </div>

        <div className={viewMode === "list" ? "flex-1 min-w-0" : "p-6 pt-0"}>
          <h3 className="font-bold text-foreground text-lg truncate">
            {mentor.profile?.full_name || "Mentor"}
          </h3>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
            {mentor.headline || "Expert Mentor"}
          </p>

          <div className="flex items-center gap-3 mt-3 text-sm">
            <span className="flex items-center gap-1 text-secondary">
              <Star className="w-4 h-4 fill-current" />
              {Number(mentor.rating).toFixed(1)}
            </span>
            <span className="text-muted-foreground">
              ({mentor.total_reviews} reviews)
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {mentor.years_experience}y
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {mentor.expertise?.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <span className="flex items-center gap-1 font-bold text-foreground">
              <DollarSign className="w-4 h-4" />
              {Number(mentor.hourly_rate).toFixed(0)}/hr
            </span>
            <Button size="sm" variant="outline">
              View Profile
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Find Your Mentor</h1>
            <p className="text-muted-foreground mt-2">
              Browse expert mentors across every field
            </p>
          </div>

          {/* Search & Filters Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, skill, or expertise..."
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:w-auto"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>

            <div className="flex gap-1 border border-border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-card border border-border rounded-xl p-6 mb-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-foreground">Filters</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}/hr
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={500}
                    step={10}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">
                    Minimum Rating
                  </label>
                  <Select value={minRating} onValueChange={setMinRating}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Rating</SelectItem>
                      <SelectItem value="4">4+ Stars</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Results */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card border border-border rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No mentors found matching your criteria</p>
              <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setSelectedCategory("all"); setMinRating("any"); setPriceRange([0, 500]); }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
              {filtered.map((m, i) => (
                <MentorCard key={m.id} mentor={m} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MentorSearch;

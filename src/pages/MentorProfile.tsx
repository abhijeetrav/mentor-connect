import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Clock, Award, MapPin, Video, Phone, ExternalLink, Calendar, DollarSign, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const MentorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [mentor, setMentor] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingPlan, setBookingPlan] = useState<string>("hourly");

  useEffect(() => {
    if (id) {
      fetchMentor();
      fetchReviews();
      fetchPortfolio();
    }
  }, [id]);

  const fetchMentor = async () => {
    const { data } = await supabase
      .from("mentor_profiles")
      .select(`*, profile:profiles!mentor_profiles_user_id_fkey(full_name, avatar_url, bio, phone), mentor_categories(category:categories(name))`)
      .eq("id", id)
      .single();
    if (data) setMentor({ ...data, categories: data.mentor_categories?.map((mc: any) => mc.category) ?? [] });
    setLoading(false);
  };

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select(`*, reviewer:profiles!reviews_user_id_fkey(full_name, avatar_url)`)
      .eq("mentor_id", id)
      .order("created_at", { ascending: false });
    if (data) setReviews(data);
  };

  const fetchPortfolio = async () => {
    const { data } = await supabase.from("portfolio_items").select("*").eq("mentor_id", id);
    if (data) setPortfolio(data);
  };

  const handleBooking = async () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to book a session", variant: "destructive" });
      return;
    }
    const amount = bookingPlan === "hourly" ? mentor.hourly_rate : bookingPlan === "weekly" ? mentor.weekly_rate : mentor.monthly_rate;
    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      mentor_id: mentor.id,
      plan: bookingPlan,
      amount: amount || 0,
    });
    if (error) {
      toast({ title: "Booking failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Booking requested!", description: "Your booking has been submitted. You'll be notified once confirmed." });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 text-center">
          <p className="text-muted-foreground text-lg">Mentor not found</p>
          <Button asChild className="mt-4"><Link to="/mentors">Browse Mentors</Link></Button>
        </div>
      </div>
    );
  }

  const plans = [
    { key: "hourly", label: "Hourly", price: mentor.hourly_rate, desc: "Single session" },
    { key: "weekly", label: "Weekly", price: mentor.weekly_rate, desc: "7-day access" },
    { key: "monthly", label: "Monthly", price: mentor.monthly_rate, desc: "30-day access" },
  ].filter((p) => p.price);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Link to="/mentors" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to mentors
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-32 h-32 bg-accent rounded-2xl flex items-center justify-center text-5xl font-bold text-accent-foreground flex-shrink-0">
                    {mentor.profile?.avatar_url ? (
                      <img src={mentor.profile.avatar_url} alt="" className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      mentor.profile?.full_name?.charAt(0) || "M"
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-foreground">{mentor.profile?.full_name}</h1>
                    <p className="text-lg text-muted-foreground mt-1">{mentor.headline}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-4">
                      <span className="flex items-center gap-1 text-secondary font-semibold">
                        <Star className="w-5 h-5 fill-current" /> {Number(mentor.rating).toFixed(1)}
                        <span className="text-muted-foreground font-normal">({mentor.total_reviews} reviews)</span>
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" /> {mentor.years_experience} years experience
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Award className="w-4 h-4" /> {mentor.total_sessions} sessions
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {mentor.categories?.map((c: any) => (
                        <Badge key={c.name}>{c.name}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Tabs */}
              <Tabs defaultValue="about">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="mt-6 space-y-6">
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-3">About</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {mentor.bio || mentor.profile?.bio || "No bio provided yet."}
                    </p>
                  </div>

                  {mentor.expertise?.length > 0 && (
                    <div className="bg-card border border-border rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-3">Expertise</h3>
                      <div className="flex flex-wrap gap-2">
                        {mentor.expertise.map((skill: string) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {mentor.achievements?.length > 0 && (
                    <div className="bg-card border border-border rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-3">Achievements</h3>
                      <ul className="space-y-2">
                        {mentor.achievements.map((a: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-muted-foreground">
                            <Award className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" /> {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="portfolio" className="mt-6">
                  {portfolio.length === 0 ? (
                    <p className="text-muted-foreground text-center py-10">No portfolio items yet.</p>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {portfolio.map((item) => (
                        <div key={item.id} className="bg-card border border-border rounded-xl p-5">
                          {item.image_url && (
                            <img src={item.image_url} alt={item.title} className="w-full h-40 object-cover rounded-lg mb-4" />
                          )}
                          <h4 className="font-semibold text-foreground">{item.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                          {item.url && (
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm mt-2 hover:underline">
                              <ExternalLink className="w-3.5 h-3.5" /> View
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="reviews" className="mt-6 space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-muted-foreground text-center py-10">No reviews yet.</p>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="bg-card border border-border rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-sm font-bold text-accent-foreground">
                            {review.reviewer?.full_name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{review.reviewer?.full_name || "User"}</p>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "text-secondary fill-current" : "text-muted"}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar - Booking */}
            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-2xl p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-foreground mb-4">Book a Session</h3>

                <div className="space-y-3 mb-6">
                  {plans.map((plan) => (
                    <button
                      key={plan.key}
                      onClick={() => setBookingPlan(plan.key)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        bookingPlan === plan.key
                          ? "border-primary bg-accent"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">{plan.label}</span>
                        <span className="font-bold text-foreground">${Number(plan.price).toFixed(0)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{plan.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="space-y-3 mb-6">
                  <p className="text-sm font-medium text-foreground">Session type</p>
                  <div className="flex gap-3">
                    <Badge variant="secondary" className="flex items-center gap-1 py-2 px-3 cursor-pointer">
                      <Video className="w-4 h-4" /> Video Call
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 py-2 px-3 cursor-pointer">
                      <Phone className="w-4 h-4" /> Voice Call
                    </Badge>
                  </div>
                </div>

                <Button onClick={handleBooking} className="w-full" size="lg">
                  <Calendar className="w-5 h-5" />
                  Book Now
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-3">
                  Schedule will be confirmed based on mentor availability
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MentorProfile;

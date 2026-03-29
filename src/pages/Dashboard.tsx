import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, Star, User, LogOut, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchBookings();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await (supabase as any).from("profiles").select("*").eq("id", user!.id).single();
    if (data) setProfile(data);
  };

  const fetchBookings = async () => {
    const { data } = await (supabase as any)
      .from("bookings")
      .select(`*, mentor:mentor_profiles(id, headline, profile:profiles!mentor_profiles_user_id_fkey(full_name, avatar_url))`)
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    if (data) setBookings(data);
    setLoading(false);
  };

  const statusColor: Record<string, string> = {
    pending: "bg-secondary/20 text-secondary",
    confirmed: "bg-primary/20 text-primary",
    completed: "bg-accent text-accent-foreground",
    cancelled: "bg-destructive/20 text-destructive",
  };

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "Signed out successfully" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome, {profile?.full_name || "User"}
              </h1>
              <p className="text-muted-foreground mt-1">{user?.email}</p>
            </div>
            <div className="flex gap-3">
              <Button asChild>
                <Link to="/mentors">
                  <BookOpen className="w-4 h-4" /> Find Mentors
                </Link>
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total Bookings", value: bookings.length, icon: Calendar },
              { label: "Upcoming", value: bookings.filter((b) => b.status === "confirmed").length, icon: Clock },
              { label: "Completed", value: bookings.filter((b) => b.status === "completed").length, icon: Star },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bookings */}
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Bookings</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            {["all", "upcoming", "completed"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-6">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-card border border-border rounded-xl h-24 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  (() => {
                    const filtered = tab === "all" ? bookings : tab === "upcoming" ? bookings.filter((b) => b.status === "confirmed" || b.status === "pending") : bookings.filter((b) => b.status === "completed");
                    return filtered.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">No bookings yet</p>
                        <Button asChild className="mt-4">
                          <Link to="/mentors">Browse Mentors</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filtered.map((booking, i) => (
                          <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-card border border-border rounded-xl p-5 flex flex-col md:flex-row justify-between gap-4"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-lg font-bold text-accent-foreground">
                                {booking.mentor?.profile?.full_name?.charAt(0) || "M"}
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">{booking.mentor?.profile?.full_name || "Mentor"}</p>
                                <p className="text-sm text-muted-foreground">{booking.mentor?.headline}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge className={statusColor[booking.status] || ""}>
                                {booking.status}
                              </Badge>
                              <span className="text-sm text-muted-foreground capitalize">{booking.plan} plan</span>
                              <span className="font-semibold text-foreground">${Number(booking.amount).toFixed(0)}</span>
                              {booking.status === "confirmed" && booking.meeting_link && (
                                <Button size="sm" asChild>
                                  <a href={booking.meeting_link} target="_blank" rel="noopener noreferrer">Join Meeting</a>
                                </Button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    );
                  })()
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

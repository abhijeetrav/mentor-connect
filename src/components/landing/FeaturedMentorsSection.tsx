import { motion } from "framer-motion";
import { Star, MapPin, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const mentors = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    title: "Business Strategy Consultant",
    expertise: ["Startups", "Leadership", "Growth"],
    rating: 4.9,
    reviews: 234,
    sessions: 520,
    price: 150,
    location: "San Francisco, USA",
    available: true,
    initials: "SC",
    color: "from-teal-500 to-cyan-600",
  },
  {
    id: 2,
    name: "Michael Roberts",
    title: "Tech Career Coach",
    expertise: ["Software Engineering", "Career Growth", "Interviews"],
    rating: 4.8,
    reviews: 189,
    sessions: 380,
    price: 120,
    location: "London, UK",
    available: true,
    initials: "MR",
    color: "from-purple-500 to-indigo-600",
  },
  {
    id: 3,
    name: "Dr. Priya Sharma",
    title: "Yoga & Wellness Expert",
    expertise: ["Yoga", "Meditation", "Holistic Health"],
    rating: 5.0,
    reviews: 312,
    sessions: 680,
    price: 80,
    location: "Mumbai, India",
    available: true,
    initials: "PS",
    color: "from-rose-500 to-pink-600",
  },
  {
    id: 4,
    name: "James Williams",
    title: "Acting & Performance Coach",
    expertise: ["Acting", "Auditions", "Voice"],
    rating: 4.9,
    reviews: 156,
    sessions: 290,
    price: 100,
    location: "Los Angeles, USA",
    available: false,
    initials: "JW",
    color: "from-amber-500 to-orange-600",
  },
];

const FeaturedMentorsSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16"
        >
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Featured <span className="text-gradient">Mentors</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Meet our top-rated mentors who have helped thousands achieve their goals.
            </p>
          </div>
          <Button variant="outline" className="mt-6 md:mt-0" asChild>
            <Link to="/mentors">
              View All Mentors
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mentors.map((mentor, index) => (
            <motion.div
              key={mentor.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card rounded-2xl border border-border shadow-soft hover:shadow-elevated transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                {/* Avatar & Status */}
                <div className="relative mb-4">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${mentor.color} flex items-center justify-center text-white font-bold text-2xl mx-auto`}>
                    {mentor.initials}
                  </div>
                  {mentor.available && (
                    <div className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 w-6 h-6 rounded-full bg-green-500 border-4 border-card" />
                  )}
                </div>

                {/* Info */}
                <div className="text-center mb-4">
                  <h3 className="font-semibold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">
                    {mentor.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">{mentor.title}</p>
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {mentor.location}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-secondary text-secondary" />
                    <span className="font-semibold text-foreground">{mentor.rating}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">({mentor.reviews} reviews)</span>
                </div>

                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {mentor.expertise.slice(0, 2).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-accent text-accent-foreground rounded-md text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Sessions & Price */}
                <div className="flex items-center justify-between text-sm border-t border-border pt-4">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {mentor.sessions} sessions
                  </div>
                  <div className="font-semibold text-foreground">
                    ${mentor.price}<span className="text-muted-foreground font-normal">/hr</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <Link
                to={`/mentor/${mentor.id}`}
                className="block py-3 text-center bg-primary/5 text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                View Profile
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedMentorsSection;

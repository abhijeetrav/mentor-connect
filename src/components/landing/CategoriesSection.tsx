import { motion } from "framer-motion";
import { 
  Briefcase, 
  Heart, 
  Code, 
  Palette, 
  GraduationCap, 
  Dumbbell,
  Music,
  TrendingUp 
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    icon: Briefcase,
    name: "Business & Entrepreneurship",
    description: "Business strategy, startups, leadership",
    mentors: 1250,
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Code,
    name: "Technology & Engineering",
    description: "Software, data science, AI/ML",
    mentors: 980,
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Heart,
    name: "Life & Wellness",
    description: "Life coaching, mental health, yoga",
    mentors: 750,
    color: "from-rose-500 to-pink-600",
  },
  {
    icon: Palette,
    name: "Creative & Arts",
    description: "Acting, modeling, design, photography",
    mentors: 620,
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: GraduationCap,
    name: "Academic & Research",
    description: "PhD guidance, research, academics",
    mentors: 540,
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: TrendingUp,
    name: "Finance & Accounting",
    description: "Financial planning, investments, taxes",
    mentors: 480,
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: Dumbbell,
    name: "Health & Fitness",
    description: "Personal training, nutrition, wellness",
    mentors: 420,
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Music,
    name: "Music & Performance",
    description: "Vocal coaching, instruments, production",
    mentors: 380,
    color: "from-fuchsia-500 to-purple-600",
  },
];

const CategoriesSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Explore Mentor <span className="text-gradient">Categories</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find expert guidance across diverse fields. From business strategy to creative arts, we have mentors for every journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={`/categories/${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                className="group block bg-card rounded-2xl p-6 border border-border shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {category.description}
                </p>
                <p className="text-sm font-medium text-primary">
                  {category.mentors.toLocaleString()} mentors
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;

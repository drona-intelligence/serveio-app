import { Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroFood from "../../assets/food.jpg";

const FOOD_CARDS = [
  {
    id: 1,
    name: "Chicken Momo",
    category: "Nepali",
    rating: 4.8,
    time: "20-30 min",
    image:
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=80",
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    category: "Italian",
    rating: 4.5,
    time: "25-35 min",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
  },
  {
    id: 3,
    name: "Cheese Burger",
    category: "American",
    rating: 4.3,
    time: "15-25 min",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
  },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[75vh] flex items-center justify-center">
        <img
          src={heroFood}
          alt="Food"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
            Servieo
          </h1>

          <p className="text-white/80 text-lg mb-8 max-w-xl">
            Order delicious food from your favorite restaurants anytime.
          </p>

          <button
            onClick={() => navigate("/menu")}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-semibold transition"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Popular Foods */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Foods</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FOOD_CARDS.map((food) => (
            <div
              key={food.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300"
            >
              <img
                src={food.image}
                alt={food.name}
                className="w-full h-52 object-cover"
              />

              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900">
                  {food.name}
                </h3>

                <p className="text-sm text-gray-500 mt-1 mb-4">
                  {food.category}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span>{food.rating}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{food.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;

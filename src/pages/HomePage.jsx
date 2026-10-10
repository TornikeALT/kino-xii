import ComingSoonCards from "../components/ComingSoonCards.jsx";
import Featured from "../components/Featured.jsx";
import PlayingNowCard from "../components/PlayingNowCard.jsx";
import RecentlyViewed from "../components/RecentlyViewed.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function HomePage() {
  const { user } = useAuth();
  return (
    <div className="hero">
      <Featured />
      <RecentlyViewed key={user ? user.id : "guest"} />
      <section className="playingNow_wrapper">
        <PlayingNowCard />
      </section>
      <div className="divider" />
      <ComingSoonCards />
    </div>
  );
}

export default HomePage;

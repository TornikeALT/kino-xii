import ComingSoonCards from "../components/ComingSoonCards.jsx";
import Featured from "../components/Featured.jsx";
import PlayingNowCard from "../components/PlayingNowCard.jsx";
import RecentlyViewed from "../components/RecentlyViewed.jsx";

function HomePage() {
  return (
    <div className="hero">
      <Featured />
      <RecentlyViewed />
      <section className="playingNow_wrapper">
        <PlayingNowCard />
      </section>
      <div className="divider" />
      <ComingSoonCards />
    </div>
  );
}

export default HomePage;

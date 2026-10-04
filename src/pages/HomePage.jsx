import Featured from "../components/Featured.jsx";
import PlayingNowCard from "../components/PlayingNowCard.jsx";

function HomePage() {
  return (
    <div className="hero">
      <Featured />
      <section className="playingNow_wrapper">
        <PlayingNowCard />
      </section>
    </div>
  );
}

export default HomePage;

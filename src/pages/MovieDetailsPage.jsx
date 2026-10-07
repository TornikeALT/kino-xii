import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getMovie } from "../api";

function MovieDetailsPage() {
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMoive() {
      try {
        setLoading(true);
        setError("");

        const data = await getMovie(slug);

        setMovie(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    loadMoive();
  }, [slug]);

  if (loading) {
    return <p>...loading</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }
  if (!movie) {
    return <p>Movie not found</p>;
  }

  return <p style={{ color: "white", fontSize: "50px" }}>{movie.title}</p>;
}

export default MovieDetailsPage;

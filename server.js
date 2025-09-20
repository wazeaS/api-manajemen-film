const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3300;

let idSeq = 5;

let movies = [
  { id: 1, title: "Spirited Away", director: "Hayao Miyazaki", year: 2001 },
  { id: 2, title: "My Neighbor Totoro", director: "Hayao Miyazaki", year: 1988 }
];

let directors = [
  { id: 1, nama: "Hayao Miyazaki", birthYear: "1941" },
  { id: 2, nama: "Isao Takahata", birthYear: "1935" }
];

let reviews = [
  { id: 1, film_id: "dany01", user: "Dany", rating: 10, comment: "Film donghua" },
  { id: 2, film_id: "syaip01", user: "Syaip", rating: 15, comment: "Film animasi terbaik sepanjang masa" },
  { id: 3, film_id: "inka01", user: "Inka", rating: 5, comment: "Film animasi untuk anak-anak" },
  { id: 4, film_id: "ica01", user: "Ica", rating: 7, comment: "Animasi Upin Ipin" }
];

//===MIDDLEWARE===
app.use(cors());
app.use(express.json());

//===STATUS===
app.get("/status", (req, res) => {
  res.json({
    ok: true,
    service: "film-api",
    time: new Date().toISOString(),
  });
});

//===MOVIES===
app.get("/movies", (req, res) => {
  res.json(movies);
});

app.get("/movies/:id", (req, res) => {
  const id = Number(req.params.id);
  const movie = movies.find((m) => m.id === id);
  if (!movie) return res.status(404).json({ error: "Movie tidak ditemukan" });
  res.json(movie);
});

app.post("/movies", (req, res) => {
  const { title, director, year } = req.body || {};
  if (!title || !director || !year) {
    return res.status(400).json({ error: "title, director, year wajib diisi" });
  }
  const newMovie = { id: idSeq++, title, director, year };
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

app.put("/movies/:id", (req, res) => {
  const id = Number(req.params.id);
  const movieIndex = movies.findIndex((m) => m.id === id);
  if (movieIndex === -1) {
    return res.status(404).json({ error: "Movie tidak ditemukan" });
  }
  const { title, director, year } = req.body || {};
  const updatedMovie = { id, title, director, year };
  movies[movieIndex] = updatedMovie;
  res.json(updatedMovie);
});

app.delete("/movies/:id", (req, res) => {
  const id = Number(req.params.id);
  const movieIndex = movies.findIndex((m) => m.id === id);
  if (movieIndex === -1) {
    return res.status(404).json({ error: "Movie tidak ditemukan" });
  }
  movies.splice(movieIndex, 1);
  res.status(204).send();
});

//===DIRECTORS===
app.get("/directors", (req, res) => {
  res.json(directors);
});

app.get("/directors/:id", (req, res) => {
  const id = Number(req.params.id);
  const director = directors.find((d) => d.id === id);
  if (!director) return res.status(404).json({ error: "Direktor tidak ditemukan" });
  res.json(director);
});

app.post("/directors", (req, res) => {
  const { nama, birthYear } = req.body || {};
  if (!nama || !birthYear) {
    return res.status(400).json({ error: "Nama, birthYear wajib diisi" });
  }
  const newDirector = { id: idSeq++, nama, birthYear };
  directors.push(newDirector);
  res.status(201).json(newDirector);
});

//===REVIEWS===
app.get("/reviews", (req, res) => {
  res.json(reviews);
});

app.get("/reviews/:id", (req, res) => {
  const id = Number(req.params.id);
  const review = reviews.find((r) => r.id === id);
  if (!review) return res.status(404).json({ error: "Review tidak ditemukan" });
  res.json(review);
});

app.post("/reviews", (req, res) => {
  const { film_id, user, rating, comment } = req.body || {};
  if (!film_id || !user || rating === undefined || !comment) {
    return res.status(400).json({ error: "film_id, user, rating, comment wajib diisi" });
  }
  const newReview = { id: idSeq++, film_id, user, rating, comment };
  reviews.push(newReview);
  res.status(201).json(newReview);
});

app.put("/reviews/:id", (req, res) => {
  const id = Number(req.params.id);
  const reviewIndex = reviews.findIndex((r) => r.id === id);
  if (reviewIndex === -1) {
    return res.status(404).json({ error: "Review tidak ditemukan" });
  }
  const { film_id, user, rating, comment } = req.body || {};
  const updatedReview = { id, film_id, user, rating, comment };
  reviews[reviewIndex] = updatedReview;
  res.json(updatedReview);
});

app.delete("/reviews/:id", (req, res) => {
  const id = Number(req.params.id);
  const reviewIndex = reviews.findIndex((r) => r.id === id);
  if (reviewIndex === -1) {
    return res.status(404).json({ error: "Review tidak ditemukan" });
  }
  reviews.splice(reviewIndex, 1);
  res.status(204).send();
});

//===FALLBACK & ERROR HANDLING===
app.use((req, res) => {
  res.status(404).json({ error: "Rute tidak ditemukan" });
});

app.use((err, req, res, _next) => {
  console.error("[ERROR]", err);
  res.status(500).json({ error: "Terjadi kesalahan pada server" });
});

//===START SERVER===
app.listen(PORT, () => {
  console.log(`Server aktif di http://localhost:${PORT}`);
});

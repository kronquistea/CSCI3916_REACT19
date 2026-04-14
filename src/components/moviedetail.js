import React, { useEffect, useState } from 'react';
import { fetchMovie, addReview } from '../actions/movieActions';
import { useDispatch, useSelector } from 'react-redux';
import { Card, ListGroup, ListGroupItem, Image } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom'; // Import useParams

const MovieDetail = () => {
  const dispatch = useDispatch();
  const { movieId } = useParams(); // Get movieId from URL parameters
  const selectedMovie = useSelector(state => state.movie.selectedMovie);
  const loading = useSelector(state => state.movie.loading); // Assuming you have a loading state in your reducer
  const error = useSelector(state => state.movie.error); // Assuming you have an error state in your reducer
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(1);


  useEffect(() => {
    dispatch(fetchMovie(movieId));
  }, [dispatch, movieId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const username = localStorage.getItem('username')

    if (!username) {
      alert('You must be logged in to submit a review.');
      return;
    }

    if (!reviewText.trim()) {
      alert('Review cannot be empty.');
      return;
    }

    if (rating < 1 || rating > 5) {
      alert('Rating must be between 1 and 5.');
      return;
    }

    const newReview = {
      username: username,
      review: reviewText,
      rating: rating,
    };

    // dispatch your action (you'll implement this)
    dispatch(addReview(movieId, newReview));

    // clear form
    setReviewText('');
    setRating(1);
  };

  const DetailInfo = () => {
    if (loading) {
      return <div>Loading....</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    if (!selectedMovie) {
      return <div>No movie data available.</div>;
    }

    console.log(selectedMovie);

    return (
      <Card className="bg-dark text-dark p-4 rounded">
        <Card.Header>Movie Detail</Card.Header>
        <Card.Body>
          <Image className="image" src={selectedMovie.imageUrl} thumbnail />
        </Card.Body>
        <ListGroup>
          <ListGroupItem>{selectedMovie.title}</ListGroupItem>
          <ListGroupItem>
            {selectedMovie.actors.map((actor, i) => (
              <p key={i}>
                <b>{actor.actorName}</b> {actor.characterName}
              </p>
            ))}
          </ListGroupItem>
          <ListGroupItem>
            <h4>
              <BsStarFill /> {selectedMovie.avgRating}
            </h4>
          </ListGroupItem>
        </ListGroup>
        <Card.Body className="card-body bg-white">
          {selectedMovie.movieReviews.map((review, i) => (
            <p key={i}>
              <b>{review.username}</b>&nbsp; {review.review} &nbsp; <BsStarFill />{' '}
              {review.rating}
            </p>
          ))}
        </Card.Body>
        <Card.Body className="bg-light mt-3">
          <h5>Add a Review</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <textarea
                className="form-control"
                placeholder="Write your review..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
              />
            </div>

            <div className="mb-2">
              <label>Rating:</label>
              <select
                className="form-control"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              Submit Review
            </button>
          </form>
        </Card.Body>
      </Card>
    );
  };

  return <DetailInfo />;
};


export default MovieDetail;

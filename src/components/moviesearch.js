import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies, setMovie } from "../actions/movieActions";
import { Link } from 'react-router-dom';
import { Card, Row, Col, Form } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';

function MovieSearch() {
    const dispatch = useDispatch();
    const movies = useSelector(state => state.movie.movies);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(fetchMovies());
    }, [dispatch]);

    const handleClick = (movie) => {
        dispatch(setMovie(movie));
    };

    const filteredMovies = useMemo(() => {
        if (!movies) return [];

        const lowerCaseSearchTerm = (searchTerm || "").toLowerCase();

        return movies.filter(movie => {
            const titleMatch = movie.title.toLowerCase().includes(lowerCaseSearchTerm);
            const actorMatch = movie.actors?.some(actor => actor.actorName.toLowerCase().includes(lowerCaseSearchTerm)) || false;
        
            return titleMatch || actorMatch;
        });
    }, [movies, searchTerm]);

    if (!movies) {
        return <div>Loading....</div>;
    }

    return (
        <div className="bg-dark text-light p-4 rounded">

            <h2 className="mb-4">Movies</h2>

            <Form.Control
                type="text"
                placeholder="Search movies..."
                className="mb-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Row>
                {filteredMovies.map(movie => (
                    <Col key={movie._id} md={4} lg={3} className="mb-4">
                        <Card className="bg-secondary text-light h-100">

                            <Link to={`/movie/${movie._id}`} onClick={() => handleClick(movie)}>
                                <Card.Img variant="top" src={movie.imageUrl} />
                            </Link>

                            <Card.Body>
                                <Card.Title>{movie.title}</Card.Title>
                                <Card.Text>
                                    <BsStarFill /> {movie.avgRating}
                                    <br />
                                    {movie.releaseDate}
                                </Card.Text>
                            </Card.Body>

                        </Card>
                    </Col>
                ))}
            </Row>

            {filteredMovies.length === 0 && (
                <p>No movies found.</p>
            )}

        </div>
    );
}

export default MovieSearch;
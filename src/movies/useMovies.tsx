import React, {useReducer, useEffect} from 'react';
import {v4 as uuid} from 'uuid';

import {Movie, MovieFetchAction, MoviesAction} from 'types';
import {getMovies} from 'api/movies';

interface MoviesState {
    movies: Movie[]
    initialized: boolean
}

export function useMoviesCollection(): [MoviesState, React.Dispatch<MoviesAction>] {
    // TODO: Implement all action processing

    const movieReducer = (state: MoviesState, action: MoviesAction): MoviesState => {
        switch (action.type) {
            case 'fetch':
                return {initialized: true, movies: action.payload.data};

            case 'add':
                const movie = action.payload.movie;
                return {
                    ...state,
                    movies: [...state.movies, {
                        id: '',
                        description: movie.description,
                        subtitle: movie.subtitle,
                        imageUrl: movie.imageUrl,
                        title: movie.title,
                        ratings: []
                    } as Movie]
                };

            case 'delete':
                const newMovies = state.movies.filter(movie => movie.id !== action.payload.movieId)
                return {...state, movies: newMovies};

            case 'rate':
                const newRatedMovies = state.movies.map(movie => {
                    if (movie.id === action.payload.movieId) {
                        return {
                            ...movie,
                            ratings: [...movie.ratings, action.payload.rating]
                        }
                    } else return movie;

                })
                return {...state, movies: newRatedMovies};

            default:
                return state
        }
    };

    const [state, dispatch] = useReducer(movieReducer, {
        movies: [],
        initialized: false,
    });

    useEffect(() => {
        getMovies().then(result => {
            console.log(result)
            dispatch({type: 'fetch', payload: {data: result}})
        })
    }, []);

    return [state, dispatch];
}

import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getCityById } from '../api/cities_api';
import { selectCityById } from '../features/cities/citiesSlice';
import { selectAllUsers } from '../features/users/usersSlice';
import { selectUserById } from '../features/users/usersSlice';

const SingleCity = () => {
  const [travellersDivHeight, setTravellersDivHeight] = useState(0);
  const [city, setCity] = useState(null);
  const [travellers, setTravellers] = useState([]);

  console.log('CITY', city);

  const { id } = useParams(); // city id
  const users = useSelector(selectAllUsers);
  const detailsContainers = useRef(null);
  // console.log('id', id);
  console.log('USERS', users);

  const getUserDetails = (userId) => users.find((user) => Number(user.id) === Number(userId));

  useEffect(() => {
    const getHeight = () => {
      const childNodesHeight =
        detailsContainers.current &&
        [...detailsContainers.current.childNodes].reduce(
          (prevElement, current) => prevElement + current.getBoundingClientRect().height,
          0
        );
      setTravellersDivHeight(childNodesHeight + 17); // 1.5em
    };
    window.addEventListener('resize', getHeight);
    getHeight();
  }, [city]);

  useEffect(() => {
    const getCityTravellers = () => {
      /** Users who've been to this city */
      const filteredTravellers = users.filter((user) => {
        return user.holidays.filter((hol) => Number(hol.city) === Number(id)).length > 0;
      });
      setTravellers(filteredTravellers);
    };
    getCityTravellers();
  }, [id, users]);

  // console.log('TRAVELLERS', travellers);

  useEffect(() => {
    const getCity = async () => {
      const destination = await getCityById(id);
      setCity(destination);
    };
    getCity();
  }, [id]);

  // console.log('travellersDivHeight', travellersDivHeight);

  const followUser = (travellerID) => {
    console.log('Follow button CLICKED!');
    console.log(`User ID: ${travellerID}`);
  };

  function getStars(rating) {
    const numberOfStars = Math.round(Number(rating));
    switch (numberOfStars) {
      case 1:
        return '⭐️';
      case 2:
        return '⭐️⭐️';
      case 3:
        return '⭐️⭐️⭐️';
      case 4:
        return '⭐️⭐️⭐️⭐️';
      case 5:
        return '⭐️⭐️⭐️⭐️⭐️';
      default:
        return '';
    }
  }

  if (!city) return <p>Loading city...</p>;
  return (
    <section
      className='singleCity'
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.1)), url(${city.image})`
      }}
    >
      <div className='singleCity__geography'>
        <h1 className='singleCity__title'>{city.city}</h1>
        <div className='singleCity__subtitle'>
          {city.state ? <p>{city.state}&emsp;~&emsp;</p> : <p></p>}
          <p>{city.country}</p>
          &emsp;~&emsp;
          <p className='singleCity__continent'>{city.continent}</p>
        </div>
      </div>

      <div className='singleCity__top'>
        <div className='singleCity__details-container' ref={detailsContainers}>
          <div className='singleCity__details singleCity__details--description'>
            <h3>Description</h3>
            <p>{city.description}</p>
          </div>
          <div className='singleCity__details singleCity__details--attractions'>
            <h3>Top 3 Attactions</h3>
            <p className='singleCity__attractions-wrapper'>
              {city.top_3_attractions.map((attraction) => (
                <span className='singleCity__attractions'>{attraction}</span>
              ))}
            </p>
          </div>
        </div>

        <div
          className='singleCity__details singleCity__details--travellers-container'
          style={{ height: `${travellersDivHeight}px` }}
        >
          <h3>Travellers who have been to {city.city}</h3>
          <div className='singleCity__travellers'>
            {travellers.length === 0 ? (
              <p>No travellers yet. Be the first!</p>
            ) : (
              travellers.map((traveller) => (
                <div className='singleCity__traveller'>
                  <div
                    className='singleCity__traveller-image'
                    style={{ backgroundImage: `url(${traveller.image})` }}
                  ></div>
                  <div className='singleCity__traveller-name'>
                    {traveller.first_name} {traveller.last_name}
                  </div>
                  <button
                    className='button singleCity__follow-traveller'
                    onClick={() => followUser(traveller.id)}
                  >
                    Follow
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className='singleCity__details singleCity__details--reviews-container'>
        <h3>Reviews of {city.city}</h3>
        <div className='singleCity__reviews'>
          {city.reviews.map((review) => (
            <div className='singleCity__review'>
              <p>"{review.text}"</p>
              <div className='singleCity__review-ratings'>
                <p>
                  Food <span>{getStars(review.rating_food)}</span>
                </p>
                <p>
                  Weather <span>{getStars(review.rating_weather)}</span>
                </p>
                <p>
                  Culture <span>{getStars(review.rating_culture)}</span>
                </p>
              </div>
              <p>
                <span className='singleCity__reviewer'>
                  {getUserDetails(review.user).first_name} {getUserDetails(review.user).last_name}
                </span>
                &emsp;~&emsp;
                <span className='singleCity__review-date'>{review.created_date}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SingleCity;

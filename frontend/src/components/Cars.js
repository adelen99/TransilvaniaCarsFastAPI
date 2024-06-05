import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCars } from "../redux/carsSlicer";

const Cars = () => {
  const dispatch = useDispatch();
  const { isLoading, error, data } = useSelector((state) => state.cars);
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [transmission, setTransmission] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch]);

  const filteredCars = data.filter((car) => {
    return (
      car.name.toLowerCase().includes(search.toLowerCase()) &&
      (brand === "" || car.brand.toLowerCase() === brand.toLowerCase()) &&
      (transmission === "" ||
        car.transmission.toLowerCase() === transmission.toLowerCase()) &&
      (year === "" || car.year.toString() === year)
    );
  });

  const resetFilters = () => {
    setSearch("");
    setBrand("");
    setTransmission("");
    setYear("");
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex justify-center text-3xl p-32'>
        Încărcare...
        <div>
          <span className='loading loading-spinner loading-lg'></span>
        </div>
      </div>
    );
  }
  if (error) {
    return <div>A apărut o eroare...</div>;
  }

  const uniqueBrands = [
    ...Array.from(new Set(data.map((car) => car.brand.toLowerCase()))).map(
      (brand) => brand.charAt(0).toUpperCase() + brand.slice(1)
    ),
  ];

  const uniqueTransmission = [
    ...Array.from(new Set(data.map((car) => car.transmission))),
  ];

  const uniqueYears = [
    ...Array.from(new Set(data.map((car) => car.year))).sort((a, b) => a - b),
  ];

  return (
    <div>
      <div className='mt-10 flex gap-8 flex-wrap items-center justify-center '>
        <input
          type='text'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Căutare'
          className='input input-bordered mb-4'
        />
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className='select select-bordered mb-4'>
          <option value=''>Alege un brand</option>
          {uniqueBrands.map((brandOption) => (
            <option key={brandOption} value={brandOption}>
              {brandOption}
            </option>
          ))}
        </select>
        <select
          value={transmission}
          onChange={(e) => setTransmission(e.target.value)}
          className='select select-bordered mb-4'>
          <option value=''>Alege o transmisie</option>
          {uniqueTransmission.map((transmissionOption) => (
            <option key={transmissionOption} value={transmissionOption}>
              {transmissionOption}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className='select select-bordered mb-4'>
          <option value=''>Alege un an</option>
          {uniqueYears.map((yearOption) => (
            <option key={yearOption} value={yearOption.toString()}>
              {yearOption}
            </option>
          ))}
        </select>
        <button
          className='btn mb-4 hover:bg-yellow-200 border-none'
          onClick={resetFilters}>
          Reseteaza filterele
        </button>
      </div>
      {filteredCars.length === 0 ? (
        <div className='flex justify-center p-32 text-center  text-2xl font-mono'>
          Nu s-a găsit nicio mașină...
        </div>
      ) : (
        <div className='grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4'>
          {filteredCars.map((car) => {
            return (
              <div
                key={car.id}
                className='card  bg-base-100 shadow-xl  m-auto p-4 my-10 overflow-hidden transition-transform transform-gpu hover:scale-105 cursor-pointer'>
                <figure className='overflow-hidden'>
                  <img src={car.img} alt={car.name} />
                </figure>
                <div className='card-body'>
                  <h2 className='card-title '>{car.name}</h2>
                  <p className='font-semibold text-gray-600 capitalize'>
                    Brand: {car.brand}
                  </p>
                  <p className='font-semibold text-gray-600'>An: {car.year}</p>
                  <p className='font-semibold text-gray-600'>
                    Preț: {car.price}
                  </p>
                  <p className='font-semibold text-gray-600'>
                    Număr de locuri: {car.locuri}
                  </p>
                  <div className='card-actions justify-end'>
                    <Link
                      to={`/mașini/${car.id}`}
                      className='btn hover:bg-yellow-200 border-none'>
                      Vizualizați
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Cars;

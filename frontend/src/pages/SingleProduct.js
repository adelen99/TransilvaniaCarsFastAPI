import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Footer } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleCar } from "../redux/carsSlicer";

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isLoading, error, singleCar } = useSelector((state) => state.cars);

  useEffect(() => {
    dispatch(fetchSingleCar(id));
  }, [dispatch, id]);

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
    return <div>A apărut o eroare: {error}</div>;
  }

  if (!singleCar) {
    return (
      <div className='min-h-screen flex justify-center text-3xl p-32'>
        Nu s-a găsit nicio mașină...
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      <div className='flex flex-col justify-center items-center'>
        <div className='card mx-auto bg-base-100 shadow-xl p-6 lg:w-1/2'>
          <figure>
            <img src={singleCar.img} alt={singleCar.name} />
          </figure>
          <div className='card-body'>
            <h2 className='card-title text-xl'>
              {singleCar.name}
              <div className='badge badge-secondary bg-yellow-200 border-none'>
                {singleCar.brand.toUpperCase()}
              </div>
            </h2>
            <p className='text-gray-600 mt-2 mb-4'>{singleCar.description}</p>
            <div className='card-actions grid grid-cols-1 font-semibold'>
              <div className='badge badge-outline font-mono bg-yellow-200 border-none'>
                An: {singleCar.year}
              </div>
              <div className='badge badge-outline font-mono bg-yellow-200 border-none'>
                Transmisie: {singleCar.transmission}
              </div>
              <div className='badge badge-outline font-mono bg-yellow-200 border-none'>
                Număr locuri: {singleCar.locuri}
              </div>
              <div className='badge badge-outline font-mono bg-yellow-200 border-none capitalize'>
                Carburant: {singleCar.carburant}
              </div>
              {singleCar.price !== "Variabil" && (
                <div className='badge badge-outline font-mono bg-yellow-200 border-none'>
                  Preț: {singleCar.price}
                </div>
              )}
            </div>
            {singleCar.price === "Variabil" && (
              <div className='font-semibold text-sm'>
                <div className='rounded-xl p-2 inline-block font-mono bg-yellow-200 '>
                  <p>
                    Prețul variază în funcție de perioada de închiriere și
                    distanța parcursă.
                  </p>
                </div>
                <div className='rounded-xl p-2 mt-2 inline-block font-mono bg-yellow-200'>
                  <p>Există opțiunea de a se închiria cu tot cu șofer.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SingleProduct;

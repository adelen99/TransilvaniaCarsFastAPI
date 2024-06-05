from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID, uuid4
from fastapi.middleware.cors import CORSMiddleware
from redis_om  import get_redis_connection,HashModel
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET","POST","PUT","DELETE"],
    allow_headers=["*"],
)

redis_db = get_redis_connection(
    host='redis-17384.c328.europe-west3-1.gce.redns.redis-cloud.com',
    port=17384,
    password='TxY9Otl6kneXxePgUtwqUzkMooL88piZ',
    decode_responses=True)

class BaseModel(HashModel):
    class Meta:
        database = redis_db

class Car(BaseModel):
    id: Optional[UUID] = None
    featured:str
    name: str
    brand: str
    img: str
    year: int
    transmission: str
    price: str
    carburant:str
    description:str
    
   


# Load cars data from an external JSON file
with open('cars.json',encoding='utf-8') as f:
    cars_data = json.load(f)

# Initialize the cars list with Car objects and assign unique IDs
cars =[]

for car_data in cars_data:
    car = Car(id=str(uuid4()),**car_data)
    car.save()
    cars.append(car)

@app.get('/')
def welcome():
    return "Welcome to TransilvaniaCars API."

@app.get('/cars/', response_model=List[Car])
def read_cars():
    return cars

@app.get('/cars/{car_id}', response_model=Car)
def read_car(car_id: UUID):
    for car in cars:
        if car.id == car_id:
            return car
    raise HTTPException(status_code=404, detail="Car not found")

@app.get('/featured-cars/',response_model=List[Car])
def read_featured_cars():
    featured_cars = [car for car in cars if car.featured == "yes"]
    return featured_cars
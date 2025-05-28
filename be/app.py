from datetime import datetime
import os
from typing import List

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi import FastAPI, Depends
from fastapi.exceptions import RequestValidationError
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from models import BookingCreate, BusCreate, EmailSchema, LoginRequest, TripCreate, TripSearch, TripUpdate, UserCreate, CompanyCreate
from services import (active_trip_service, create_access_token_service, create_company_service, create_trip_service,
                      delete_trip_service, get_all_buses_service, get_all_companies_service, create_booking_service,
                      get_all_points_service, get_all_trips_service, get_all_users_service, get_all_trips_with_search_service,
                      get_company_service, get_current_user, send_email, update_trip_service, create_bus_service, get_all_bookings_service, verify_user_exists_service,
                      verify_user_service, create_user_service, get_all_locations_service, get_occupied_seats_id_service)

app = FastAPI()
load_dotenv()


origins = [
    "http://localhost:5173",
    os.getenv("FRONTEND")
]
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body},
    )


@app.post("/send-email")
def send_email_api(data: EmailSchema):
    send_email(data.subject, data.to, data.body)
    return {"message": "📧 Email sent successfully!"}


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/trips")
async def get_all_trips_api(company_id: str = None,
                            search: str = None,
                            status: str = None):
    trips = await get_all_trips_service(company_id=company_id,
                                        search=search,
                                        status=status)
    return trips


@app.get("/trips/{trip_id}")
async def get_trip(trip_id: str):
    trip_details = await get_all_trips_service(trip_id=trip_id)

    if trip_details:
        return trip_details[0]
    return {}


@app.post("/trips")
async def create_trip_api(trip: TripCreate):
    trip = await create_trip_service(trip=trip)
    return trip


@app.post("/trips/search")
async def search_trips_api(search: TripSearch):
    trips = await get_all_trips_with_search_service(search)
    return trips


@app.put("/trips/{trip_id}")
async def update_trip_api(trip_id: str, trip: TripUpdate):
    trip = await update_trip_service(trip_id=trip_id, trip=trip)
    return trip


@app.delete("/trips/{trip_id}")
async def delete_trip_api(trip_id: str):
    trip = await delete_trip_service(trip_id=trip_id)
    return trip


@app.get("/trips/{trip_id}/seats")
async def get_occupied_seats(trip_id: str):
    trip = await get_occupied_seats_id_service(trip_id)
    return trip


@app.post("/active-trip/{trip_id}")
async def set_active_trip(trip_id: str):
    trip = await active_trip_service(trip_id=trip_id)
    return trip


@app.get("/locations")
async def get_all_locations_api():
    locations = await get_all_locations_service()
    return locations


@app.get("/points")
async def get_all_points_api(location_id: str = None):
    points = await get_all_points_service(location_id)
    return points


# buses
@app.get("/buses")
async def get_all_buses_api(company_id: str = None):
    buses = await get_all_buses_service(company_id)
    return buses


@app.post("/buses")
async def create_bus_api(bus: BusCreate):
    result = await create_bus_service(bus)
    return {"inserted_id": str(result.inserted_id)}


# users
@app.get("/users")
async def get_all_users():
    users = await get_all_users_service()
    return users


@app.get("/companies")
async def get_all_companies():
    companies = await get_all_companies_service()
    return companies


@app.get("/companies/{company_id}")
async def get_company_api(company_id: str = None):
    company = await get_company_service(company_id)
    return company


@app.post("/companies/create")
async def create_company(company_in: CompanyCreate):
    company = await create_company_service(company_in)
    return company


# Bookings
@app.get("/bookings")
async def get_all_bookings():
    bookings = await get_all_bookings_service()
    return bookings


@app.post("/bookings")
async def create_booking(booking: BookingCreate):
    booking = await create_booking_service(booking)
    return booking


# Authentication
@app.post("/users/create")
async def create_user(user_in: UserCreate):
    user = await create_user_service(user_in)
    return user


@app.get("/users/me")
async def get_user_me(current_user: dict = Depends(get_current_user)):
    return current_user


@app.get("/users/check")
async def check_user(email: str):
    user_exists = await verify_user_exists_service(email)
    return {"exists": bool(user_exists)}


@app.post("/login")
async def login_user(form_data: LoginRequest):
    user = await verify_user_service(form_data)
    access_token = create_access_token_service(data={"sub": user["email"]})
    return {"access_token": access_token}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8001, reload=True)

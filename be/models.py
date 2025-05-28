# models

from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import List, Optional


# Routes
class RouteDetail(BaseModel):
    departure_station: str
    arrival_station: str
    transfers: Optional[List[str]]
    departure_time: str
    bus_type: str
    ticket_price: int = 350000


class BusRoute(BaseModel):
    origin: str
    destination: str
    bus_company: str
    price: int
    distance_km: int
    duration_hours: float
    travel_date: date = date(2025, 3, 25)
    details: List[RouteDetail]


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# User
class UserBase(BaseModel):
    name: str
    email: EmailStr
    password: str
    is_active: Optional[bool] = False


class CompanyCreate(UserBase):
    representative: str
    phone_number: str
    address: str
    tax_code: str
    is_active: Optional[bool] = False
    role: Optional[str] = "company"


class UserCreate(UserBase):
    phone_number: Optional[str] = None
    is_active: Optional[bool] = True
    role: Optional[str] = "user"


class TripCreate(BaseModel):
    company_id: str
    bus_id: str
    departure: str
    destination: str
    from_location: str
    to_location: str
    date: datetime
    price: float


class TripSearch(BaseModel):
    from_location: str
    to_location: str
    date: str
    return_date: Optional[str] = None
    passengers: int


class TripUpdate(BaseModel):
    price: float
    bus_id: str
    date: datetime


class BusCreate(BaseModel):
    status: Optional[str] = "active"
    license_plate: str
    company_id: str
    seats: int
    name: str


class BookingCreate(BaseModel):
    trip_id: str
    seat_number: List[int]
    user_fullname: Optional[str] = None
    user_email: Optional[EmailStr] = None
    user_phone_number: Optional[str] = None
    company_id: str


class EmailSchema(BaseModel):
    to: EmailStr
    subject: str
    body: str

from bson import ObjectId
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import jwt
import hashlib
from typing import Optional
from fastapi import Depends, HTTPException
from datetime import datetime, timedelta
from unidecode import unidecode
from models import BookingCreate, BusCreate, CompanyCreate, LoginRequest, TripCreate, TripSearch, UserCreate
from dal import (delete_trip, get_all_buses, get_all_companies, get_all_points, get_all_routes, get_all_users, get_bus_by_id, get_location_by_id, get_occupied_seats_by_id, get_point_by_id, get_route_by_from_and_to,
                 get_trip_by_id, get_all_trips, get_user_by_email, get_user_by_id, insert_route, insert_trip, insert_user, insert_bus, insert_booking, get_all_bookings,
                 get_route_by_id, get_company_by_tax_code, get_all_locations, update_trip, update_trip_status, update_user)
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = "your_secret_key_here"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


# email
def send_email(subject: str, to: str, body: str):
    msg = MIMEMultipart("alternative")
    msg["From"] = os.getenv("MAIL_FROM")
    msg["To"] = to
    msg["Subject"] = subject

    html_part = MIMEText(body, "html")
    msg.attach(html_part)

    with smtplib.SMTP(os.getenv("MAIL_SERVER"), int(os.getenv("MAIL_PORT"))) as server:
        server.starttls()
        server.login(os.getenv("MAIL_USERNAME"), os.getenv("MAIL_PASSWORD"))
        server.sendmail(msg["From"], msg["To"], msg.as_string())


def send_email(subject: str, to: str, body: str):
    msg = MIMEMultipart("alternative")
    msg["From"] = os.getenv("MAIL_FROM")
    msg["To"] = to
    msg["Subject"] = subject

    # Dạng text thuần
    text = "Nếu bạn không thể xem HTML, đây là thông tin chuyến đi của bạn."

    # Dạng HTML
    html = body

    msg.attach(MIMEText(text, "plain"))
    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP(os.getenv("MAIL_SERVER"), int(os.getenv("MAIL_PORT"))) as server:
        server.starttls()
        server.login(os.getenv("MAIL_USERNAME"), os.getenv("MAIL_PASSWORD"))
        server.sendmail(msg["From"], msg["To"], msg.as_string())


# routes
async def get_all_routes_service():
    """Service: get all routes"""
    routes = await get_all_routes()
    for route in routes:
        from_location = await get_location_by_id(route["from"])
        to_location = await get_location_by_id(route["to"])
        route["from"] = from_location.name
        route["to"] = to_location.name
        route["name"] = f"{route["from"]} - {route["to"]}"
    return routes


# trips
async def get_all_trips_service(company_id: str = None,
                                trip_id: str = None,
                                search: str = None,
                                status: str = None):
    """Service: get all trips"""
    trips = await get_all_trips(company_id=company_id, trip_id=trip_id)
    results = []

    for trip in trips:
        # check if date > now() then status completed
        if trip["date"] < datetime.now():
            await update_trip_status(trip_id=str(
                trip["_id"]), new_status="completed")

        route = await get_route_by_id(trip["route_id"])
        company = await get_user_by_id(trip["company_id"])
        from_location = await get_location_by_id(route["from"])
        to_location = await get_location_by_id(route["to"])
        from_point = await get_point_by_id(trip["from"])
        to_point = await get_point_by_id(trip["to"])
        bus = await get_bus_by_id(trip["bus_id"])
        occupied_seats = await get_occupied_seats_by_id(trip["_id"])

        formatted_date = datetime.fromisoformat(
            str(trip["date"])).strftime("%d/%m/%Y")
        formatted_hour = datetime.fromisoformat(
            str(trip["date"])).strftime("%H:%M")

        results.append({
            "id": str(trip["_id"]),
            "rating": trip["rating"],
            "price": trip["price"],
            "seats": bus["seats"],
            "bus": f"{bus["name"]} ({bus["license_plate"]})",
            "bus_id": str(trip["bus_id"]),
            "seats_available": bus["seats"] - len(occupied_seats),
            "date": formatted_date,
            "hour": formatted_hour,
            "date_iso": trip["date"],
            "to": to_location["name"],
            "from": from_location["name"],
            "from_point": from_point["name"],
            "from_point_id": str(trip["from"]),
            "to_point": to_point["name"],
            "to_point_id": str(trip["to"]),
            "company": company["name"],
            "company_id": str(trip["company_id"]),
            "distance": route["distance"],
            "route_id": str(trip["route_id"]),
            "duration": route["duration"],
            "status": trip["status"]
        })

    if search is not None and search.strip():
        search_lower = unidecode(search.lower().strip())
        results = [
            trip for trip in results
            if search_lower in unidecode(trip["from_point"].lower()) or search_lower in unidecode(trip["to_point"].lower())
        ]

    if status is not None and status.strip():
        results = [trip for trip in results if status == trip["status"]]

    return results


async def get_all_trips_with_search_service(search: TripSearch):
    trips = await get_all_trips_service(status="on_route")

    go_results = [trip for trip in trips if search.from_location.lower()
                  in trip["from"].lower()]
    go_results = [trip for trip in go_results if search.to_location.lower()
                  in trip["to"].lower()]

    search_date = datetime.fromisoformat(
        str(search.date)).strftime("%d/%m/%Y")
    go_results = [trip for trip in go_results if trip["date"] == search_date]

    return_results = []
    if search.return_date:
        return_results = [trip for trip in trips if search.from_location.lower()
                          in trip["to"].lower()]
        return_results = [trip for trip in return_results if search.to_location.lower()
                          in trip["from"].lower()]

        return_date = datetime.fromisoformat(
            str(search.return_date)).strftime("%d/%m/%Y")
        results = [trip for trip in return_results if trip["date"] == return_date]

    results = go_results + return_results

    if search.passengers:
        results = [trip for trip in results if trip["seats_available"]
                   >= search.passengers]
    return results


async def get_occupied_seats_id_service(trip_id: str):
    seats = await get_occupied_seats_by_id(trip_id)
    return seats


async def create_trip_service(trip: TripCreate):
    route = await get_route_by_from_and_to(from_location=trip.departure, to_location=trip.destination)

    if not route:
        route_data = {
            "from": ObjectId(trip.departure),
            "to": ObjectId(trip.destination),
            "distance": 500,
            "duration": 16
        }
        inserted_route = await insert_route(route_data)
        route = await get_route_by_id(inserted_route.inserted_id)

    bus = await get_bus_by_id(trip.bus_id)
    company = await get_user_by_id(trip.company_id)

    status = "scheduled"
    if company["is_active"]:
        status = "on_route"

    trip_data = {
        "company_id": ObjectId(trip.company_id),
        "bus_id": ObjectId(trip.bus_id),
        "from": ObjectId(trip.from_location),
        "to": ObjectId(trip.to_location),
        "date": trip.date,
        "price": trip.price,
        "route_id": route["_id"],
        "seats_available": bus["seats"],
        "status": status,
        "rating": 4.4,
    }

    result = await insert_trip(trip_data)
    return {"id": str(result.inserted_id)}


async def update_trip_service(trip_id: str, trip: TripCreate):
    existing_trip = await get_trip_by_id(trip_id)
    if not existing_trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    # Prepare the update data
    trip_in = {
        "bus_id": ObjectId(trip.bus_id),
        "date": trip.date,
        "price": trip.price
    }

    result = await update_trip(trip_id=trip_id, trip_in=trip_in)

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Trip not found")

    return {"id": str(result.upserted_id)}


async def delete_trip_service(trip_id: str):
    result = await delete_trip(trip_id=trip_id)
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Trip not found")
    return {"id": str(trip_id)}


async def active_trip_service(trip_id: str):
    trip = await get_trip_by_id(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    result = await update_trip(trip_id=trip_id, trip_in={
        "status": "on_route"
    })

    # active the company too, for later trips
    await update_user(user_id=trip["company_id"], user_in={
        "active": True
    })

    return {"id": str(result.upserted_id)}


# authentication
def verify_password(plain_password, hashed_password):
    return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password


def get_password_hash(password):
    return hashlib.sha256(password.encode()).hexdigest()


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401, detail="Could not validate credentials")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception

    user = await get_user_by_email(email=email)
    if user is None:
        raise credentials_exception

    user["_id"] = str(user["_id"])
    if "password_hash" in user:
        del user["password_hash"]

    return user


def create_access_token_service(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def create_user_service(user_in: UserCreate):
    # Create new company document
    user_dict = user_in.model_dump()
    user_dict["password_hash"] = get_password_hash(user_in.password)
    user_dict.pop("password")

    # Insert into MongoDB
    result = await insert_user(user_dict)

    # Return the created company
    created_user = await get_user_by_id(result.inserted_id)
    created_user["_id"] = str(created_user["_id"])

    return created_user


async def verify_user_service(form_data: LoginRequest):

    user = await get_user_by_email(form_data.email)

    if not user:
        raise HTTPException(
            status_code=401, detail="Incorrect email or password")

    if not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=401, detail="Incorrect email or password")

    return user


async def verify_user_exists_service(email: str):
    user = await get_user_by_email(email)
    print(user)
    return user


# companies
async def get_all_companies_service():
    companies = await get_all_companies()
    for company in companies:
        company["_id"] = str(company["_id"])
        if "password_hash" in company:
            del company["password_hash"]
    return companies


async def create_company_service(company_in: CompanyCreate):
    # Check if company with this email already exists
    company = await get_user_by_email(company_in.email)
    if company:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Check if company with this tax code already exists
    company = await get_company_by_tax_code(company_in.tax_code)
    if company:
        raise HTTPException(
            status_code=400, detail="Tax code already registered")

    # Create new company document
    company_dict = company_in.model_dump()
    company_dict["password_hash"] = get_password_hash(company_in.password)
    company_dict.pop("password")

    # Insert into MongoDB
    result = await insert_user(company_dict)

    # Return the created company
    created_company = await get_user_by_id(result.inserted_id)
    created_company["_id"] = str(created_company["_id"])

    return created_company


async def get_company_service(company_id: str = None):
    company = await get_user_by_id(company_id)
    company["_id"] = str(company["_id"])
    if "password_hash" in company:
        del company["password_hash"]
    return company


# locations
async def get_all_locations_service():
    locations = await get_all_locations()
    for location in locations:
        points = await get_all_points(location_id=location["_id"])
        for point in points:
            point["_id"] = str(point["_id"])
            point.pop("location_id")

        location["_id"] = str(location["_id"])
        location["points"] = points
    return locations


# points
async def get_all_points_service(location_id: str = None):
    points = await get_all_points(location_id)
    for point in points:
        point["_id"] = str(point["_id"])
        point["location_id"] = str(point["location_id"])
    return points


# buses
async def get_all_buses_service(company_id: str = None):
    buses = await get_all_buses(company_id)
    for bus in buses:
        bus["_id"] = str(bus["_id"])
        bus["company_id"] = str(bus["company_id"])
    return buses


async def create_bus_service(bus: BusCreate):
    bus_dict = bus.model_dump()
    bus_dict["company_id"] = ObjectId(bus_dict["company_id"])
    return await insert_bus(bus_dict)


# users
async def get_all_users_service():
    users = await get_all_users()
    for user in users:
        user["_id"] = str(user["_id"])
        if "password_hash" in user:
            del user["password_hash"]
    return users


# booking
async def create_booking_service(booking: BookingCreate):
    # create user if not exist
    user = await get_user_by_email(booking.user_email)
    if not user:
        user = await create_user_service(UserCreate(email=booking.user_email,
                                                    phone_number=booking.user_phone_number,
                                                    name=booking.user_fullname,
                                                    password="12345678"))
    if not user["phone_number"]:
        await update_user(user_id=user["_id"], user_in={
            "phone_number": booking.user_phone_number})

    booking_dict = booking.model_dump()
    booking_dict["user_id"] = user["_id"]
    booking_dict["status"] = "unpaid"
    return await insert_booking(booking_dict)


async def get_all_bookings_service():
    bookings = await get_all_bookings()
    for booking in bookings:
        user = await get_user_by_id(booking["user_id"])
        if user:
            booking["user_fullname"] = user["name"]
            booking["user_email"] = user["email"]
            booking["user_phone_number"] = user["phone_number"]

        trip = await get_trip_by_id(booking["trip_id"])
        from_point = await get_point_by_id(trip["from"])
        to_point = await get_point_by_id(trip["to"])
        if trip:
            booking["trip_from"] = from_point["name"]
            booking["trip_to"] = to_point["name"]

        company = await get_user_by_id(booking["company_id"])
        if company:
            booking["company_name"] = company["name"]
            booking["company_email"] = company["email"]

        booking["_id"] = str(booking["_id"])
        booking["trip_id"] = str(booking["trip_id"])
        booking["user_id"] = str(booking["user_id"])
        booking["company_id"] = str(booking["company_id"])

    # send email

    return bookings

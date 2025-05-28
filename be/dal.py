# data access layer
import os
from bson.objectid import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient

from dotenv import load_dotenv
load_dotenv()

# Connect to MongoDB
MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = "booking"

client = AsyncIOMotorClient(MONGODB_URI, maxPoolSize=10, minPoolSize=2)
db = client.get_database(DATABASE_NAME)


# trips
async def get_all_trips(company_id: str = None, trip_id: str = None):
    query = {}
    if company_id:
        query["company_id"] = ObjectId(company_id)
    if trip_id:
        query["_id"] = ObjectId(trip_id)

    cursor = db.trips.find(query)
    return await cursor.to_list(length=None)


async def get_trip_by_id(trip_id: str):
    return await db.trips.find_one({"_id": ObjectId(trip_id)})


async def insert_trip(trip):
    return await db.trips.insert_one(trip)


async def delete_trip(trip_id: str):
    return await db.trips.delete_one({"_id": ObjectId(trip_id)})


async def update_trip(trip_id: str, trip_in):
    return await db.trips.update_one({"_id": ObjectId(trip_id)}, {"$set": trip_in})


async def update_trip_status(trip_id: str, new_status: str):
    return await db.trips.update_one({"_id": ObjectId(trip_id)}, {"$set": {"status": new_status}})


async def get_all_locations():
    cursor = db.locations.find({})
    return await cursor.to_list(length=None)


async def get_location_by_id(location_id: str):
    return await db.locations.find_one({"_id": ObjectId(location_id)})


async def get_occupied_seats_by_id(trip_id: str):
    cursor = db.bookings.find({"trip_id": ObjectId(trip_id)})
    seats = []
    async for booking in cursor:
        seats.extend(booking.get("seat_number", []))
    return seats


# points
async def get_all_points(location_id: str = None):
    query = {}
    if location_id:
        query["location_id"] = ObjectId(location_id)
    cursor = db.points.find(query)
    return await cursor.to_list(length=None)


async def get_point_by_id(point_id: str):
    return await db.points.find_one({"_id": ObjectId(point_id)})


# routes
async def get_all_routes():
    cursor = db.routes.find({})
    return await cursor.to_list(length=None)


async def get_route_by_id(route_id: str):
    return await db.routes.find_one({"_id": ObjectId(route_id)})


async def get_route_by_from_and_to(from_location: str, to_location: str):
    return await db.routes.find_one({"from": ObjectId(from_location), "to": ObjectId(to_location)})


async def insert_route(route):
    return await db.routes.insert_one(route)


# companies
async def get_all_companies():
    cursor = db.users.find({"role": "company"})
    return await cursor.to_list(length=None)


async def get_company_by_tax_code(tax_code: str):
    return await db.users.find_one({"tax_code": tax_code})


# users
async def get_all_users():
    cursor = db.users.find({"role": "user"})
    return await cursor.to_list(length=None)


async def get_user_by_id(user_id: str):
    return await db.users.find_one({"_id": ObjectId(user_id)})


async def insert_user(user):
    return await db.users.insert_one(user)


async def update_user(user_id: str, user_in):
    return await db.users.update_one({"_id": ObjectId(user_id)}, {"$set": user_in})


async def get_user_by_email(email: str):
    user = await db.users.find_one({"email": email})
    print(user)
    return user


# buses
async def get_all_buses(company_id: str = None):
    query = {}
    if company_id:
        query["company_id"] = ObjectId(company_id)
    cursor = db.buses.find(query)
    return await cursor.to_list(length=None)


async def get_bus_by_id(bus_id: str):
    return await db.buses.find_one({"_id": ObjectId(bus_id)})


async def insert_bus(bus):
    return await db.buses.insert_one(bus)


# bookings
async def insert_booking(booking):
    booking["trip_id"] = ObjectId(booking["trip_id"])
    booking["company_id"] = ObjectId(booking["company_id"])
    result = await db.bookings.insert_one(booking)
    return {"message": "Booking created", "booking_id": str(result.inserted_id)}


async def get_all_bookings():
    cursor = db.bookings.find({})
    return await cursor.to_list(length=None)

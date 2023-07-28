import osmnx as ox
import sys
import json


def get_pois(latitude, longitude, distance, prefTags):

    # Define a point at the given latitude and longitude
    point = (latitude, longitude)

    # Create a GeoDataFrame of amenities near the point
    result = ox.features_from_point(point, prefTags, dist=distance)

    return result.to_json()


if __name__ == "__main__":
    # Get the latitude and longitude and distance and preffered tags from the command line arguments
    latitude = float(sys.argv[1])
    longitude = float(sys.argv[2])
    distance = int(sys.argv[3])
    prefTags = json.loads(sys.argv[4])

    # Convert prefTags to a dictionary
    # prefTags = json.loads(prefTags.replace("'", "\""))

    # Get the amenities
    results = get_pois(latitude, longitude, distance, prefTags)

    # Convert the results to JSON and print them
    print(json.dumps(results))

import osmnx as ox
import sys
import json
import networkx as nx


def get_pois(latitude, longitude, distance, prefTags):

    # Define a point at the given latitude and longitude
    point = (latitude, longitude)

    # Create a GeoDataFrame of amenities near the point
    gdf = ox.features_from_point(point, prefTags, dist=distance)

    # Create a graph from the point within the specified distance
    G = ox.graph_from_point(point, dist=distance, dist_type='network', network_type='walk')

    # Find the node in the graph nearest to the point
    node = ox.nearest_nodes(G, point[1], point[0])

    # Add a new column to the GeoDataFrame for the distance to the point
    def calculate_distance(row):
        geom = row['geometry']
        lon, lat = (geom.centroid.x, geom.centroid.y) if geom.type == 'Polygon' else (geom.x, geom.y)
        try:
            return nx.shortest_path_length(G, node, ox.nearest_nodes(G, lon, lat), weight='length')
        except nx.NetworkXNoPath:
            return None

    gdf['distance'] = gdf.apply(calculate_distance, axis=1)

    return gdf.to_json()


if __name__ == "__main__":
    # Get the latitude and longitude and distance and preffered tags from the command line arguments
    latitude = float(sys.argv[1])
    longitude = float(sys.argv[2])
    distance = int(sys.argv[3])
    prefTags = json.loads(sys.argv[4])

    # Get the amenities
    results = get_pois(latitude, longitude, distance, prefTags)

    # Convert the results to JSON and print them
    print(json.dumps(results))

import os
from os.path import join

def save_api_response(authToken):
    """Saves the auth token to a file."""
    # file_path = join(dirname(__file__), "user_details.txt")
    file_path = join(os.environ["HOME"], "user_details.txt")
    with open(file_path, 'w') as file:
        file.write(f"{authToken}")
    return {"success":True,"message":file_path}

def get_api_response():
    file_path = join(os.environ["HOME"], "user_details.txt")
    if not os.path.exists(file_path):
        with open(file_path,"w"):pass
    stored_auth = open(file_path, 'r').read()
    if "Authorization" not in stored_auth:
        return False
    return stored_auth
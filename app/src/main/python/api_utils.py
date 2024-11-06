import os

def save_api_response(authToken):
    """Saves the auth token to a file."""
    file_path = os.path.join(os.getcwd(), "user_details.txt")
    with open(file_path, 'w') as file:
        file.write(f"{authToken}")
    print(f"Auth token saved to {file_path}: {authToken}")


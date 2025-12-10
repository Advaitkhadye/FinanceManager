from rembg import remove
from PIL import Image
import sys

def process_image(input_path, output_path):
    try:
        input_image = Image.open(input_path)
        output_image = remove(input_image)
        output_image.save(output_path)
        print("Successfully removed background")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    process_image("dirty_logo.png", "clean_logo.png")

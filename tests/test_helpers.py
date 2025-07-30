from models.media_item import MediaItem

def validate_media_item(item: MediaItem, provider_name: str = "") -> bool:
    errors = []

    if not isinstance(item, MediaItem):
        errors.append("Object is not an instance of MediaItem.")

    if not isinstance(item.title, str) or not item.title.strip():
        errors.append("Invalid or empty title.")

    if item.description is not None and not isinstance(item.description, str):
        errors.append("Description must be a string or None.")

    if item.release_date is not None and not isinstance(item.release_date, str):
        errors.append("Release date must be a string or None.")

    if not isinstance(item.rating, dict):
        errors.append("Rating must be a dictionary.")
    else:
        for k, v in item.rating.items():
            if not isinstance(k, str):
                errors.append("Rating key must be a string.")
            if not isinstance(v, (int, float)):
                errors.append(f"Rating value for '{k}' must be a number.")

    if item.image_url is not None and not isinstance(item.image_url, str):
        errors.append("Image URL must be a string or None.")

    if not isinstance(item.source, str) or not item.source.strip():
        errors.append("Invalid or empty source.")

    if not isinstance(item.id, str) or not item.id.strip():
        errors.append("Invalid or empty ID.")

    if not isinstance(item.media_type, str) or not item.media_type.strip():
        errors.append("Invalid or empty media_type.")

    if errors:
        print(f"\n❌ Validation failed for {item} from {provider_name}:")
        for err in errors:
            print(f"   - {err}")
        return False

    print(f"✅ {item} passed validation.")
    return True

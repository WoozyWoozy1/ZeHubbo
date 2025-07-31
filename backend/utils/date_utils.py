from typing import Optional
from dateutil import parser
from datetime import datetime, timezone

def standardize_date(date_input: Optional[str | int | float]) -> Optional[str]:
    if not date_input:
        return None

    try:
        # Case 1: UNIX timestamp (int or str of digits)
        if isinstance(date_input, (int, float)) or (isinstance(date_input, str) and date_input.isdigit()):
            dt = datetime.fromtimestamp(int(date_input), tz=timezone.utc)  # ✅ uses timezone-aware object
            return dt.strftime("%d-%m-%Y")

        # Case 2: Parseable date string
        dt = parser.parse(date_input)
        return dt.strftime("%d-%m-%Y")

    except Exception:
        return str(date_input) + "!"  # Just in case non-string input sneaks in

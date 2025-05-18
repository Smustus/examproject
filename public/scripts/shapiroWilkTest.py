import sys, json
from scipy.stats import shapiro

try:
    data = json.load(sys.stdin)
    stat, p_value = shapiro(data)
    
    # Convert to float to ensure JSON serialization
    result = {
        "statistic": float(stat),
        "p_value": float(p_value),
        "isNormal": bool(p_value > 0.05)  # Explicitly convert to bool
    }
    print(json.dumps(result))
    
except Exception as e:
    print(json.dumps({"error": str(e)}), file=sys.stderr)
    sys.exit(1)
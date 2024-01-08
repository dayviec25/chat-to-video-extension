FROM python:3.9-slim

# Set a working directory
WORKDIR /app

COPY python-service/ .
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port the app runs on
EXPOSE 5000

# Run the application
CMD ["gunicorn", "-b", "0.0.0.0:5000", "main:app"]

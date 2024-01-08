# Step 1: Use a multi-stage build to keep the final image size small
# Start with a Python base image for building our application
FROM python:3.9-slim as builder

# Set a working directory
WORKDIR /usr/src/python-service

COPY python-service/ .

# Install dependencies in a virtual environment to make it easy to copy them later
RUN python -m venv /usr/src/app/venv
ENV PATH="/usr/src/app/venv/bin:$PATH"

# Install build dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libc-dev

# Copy the requirements file and install Python dependencies
COPY python-service/requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Step 2: Build the final, lean production image
# Start with a clean, minimal base image
FROM python:3.9-slim

# Set a non-root user for security
RUN useradd --create-home appuser
WORKDIR /home/appuser
USER appuser

# Copy the virtual environment with all the dependencies from the builder stage
COPY --from=builder /usr/src/app/venv /home/appuser/venv
ENV PATH="/home/appuser/venv/bin:$PATH"

# Copy the application code to the container
COPY --chown=appuser:appuser . .

# Expose the port the app runs on
EXPOSE 5000

# Run the application
CMD ["gunicorn", "-b", "0.0.0.0:5000", "main:app"]

FROM python:3.12-slim

# Set a working directory
WORKDIR /app

# Create a virtual environment and activate it
RUN python -m venv /home/appuser/venv
ENV PATH="/home/appuser/venv/bin:$PATH"

COPY python-service/ .
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD ["/home/appuser/venv/bin/gunicorn", "-k", "gevent", "-w", "1", "-b", "0.0.0.0:5000", "main:app"]

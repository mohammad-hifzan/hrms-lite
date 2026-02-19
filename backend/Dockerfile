# Use Python 3.8
FROM python:3.8-slim

WORKDIR /app

# Copy backend code
COPY . .

# Upgrade pip and install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Expose the port Render uses
EXPOSE 10000

# Run Gunicorn
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:$PORT"]

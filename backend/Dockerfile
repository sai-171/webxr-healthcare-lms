# Use the full official Python image. This image is larger but often comes
# with pre-compiled packages (wheels) or more necessary libraries,
# drastically reducing the dependency installation time.
FROM python:3.11

# Set working directory inside container
WORKDIR /app

# 1. Copy requirements.txt
COPY requirements.txt .

# 2. Install all dependencies. We can remove most of the complex apt-get
# lines because the full image usually handles them better.
# We still install libgl1 as it is a common runtime dependency for OpenCV.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libgl1 && \
    pip install --no-cache-dir -r requirements.txt && \
    apt-get remove -y --purge libgl1 && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# 3. Copy the entire application source code
COPY ./app ./app

# Expose the port where FastAPI runs
EXPOSE 8000

# Command to run FastAPI app via Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
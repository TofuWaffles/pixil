FROM ultralytics/ultralytics:latest
RUN apt-get install -y python3 python3-pip
RUN pip install ultralytics
WORKDIR /classifier
COPY . .
CMD ["python3", "./classifier.py"]

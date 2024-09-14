FROM python:3.10
WORKDIR /app
COPY requirements.txt /app
RUN pip install -r requirements.txt
COPY . /app
EXPOSE 8000
CMD python3 /app/manage.py makemigrations
CMD python3 /app/manage.py migrate
CMD python3 /app/manage.py runserver 0.0.0.0:8000

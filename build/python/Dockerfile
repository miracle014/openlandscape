FROM python

RUN mkdir -p /usr/src/app/python
WORKDIR /usr/src/app/python


RUN pip install --upgrade pip
RUN pip install --upgrade setuptools

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

ENV FLASK_ENV development
ENV FLASK_APP app



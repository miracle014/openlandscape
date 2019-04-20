FROM php:5.6-apache

RUN a2enmod rewrite

RUN apt-get update && apt-get install -y zlib1g-dev libpng-dev \
      && docker-php-ext-install mysqli && docker-php-ext-install zip \
      && docker-php-ext-install mysql \
      && docker-php-ext-install gd
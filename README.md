# Ecommerce_Backend

## Description

### What is project about?

The project is an E-commerce Web App. This project contains both the customer side and a seller side too. You can be a customer to buy things as well as a seller to sell products. The front of the E-commerce i.e. customers, you buy the products from the world of Fashion, Beauty, Electronics and Furniture/Home Decor. The seller side contains an admin panel where you can do CRUD of Products, CRUD of discounts, and can edit seller info and company's info. This project is built on React with typescript. I have used libraries like redux-toolkit, tailwindcss, slick-carousel, tinymce for adding description, uui and axios.

### Intention

The intention behind building this web app is to learn a lot of things that goes into a world-class production web apps used by many. I have tried to keep the project structure as close to a professional codebase. I have used CI/CD pipelines to make the deployment and tesing process becomes easier for the maintainers of the project. I have deployed the project on aws S3 bucket.

### Problems I faced while building the project

I faced some problems while implementing logics in typescript as it is a very strict language. I used typescript with React for the first time, so it was hard to build project. I found it difficult at initial state when I was setting Redux for the project as also used it for the first in a big project but after that it became easy to use. 

## Project Setup for Local Development

You can setup this application with two methods:-

#### 1. Normal Setup

Clone Git Repository

```
git clone https://github.com/BurhanRaja/Ecommerce_Backend.git
```

Install the Dependencies

```
npm install
```

Add Environment Variables

```
SECRET_KEY=
RAZORPAY_SECRET_KEY=
RAZORPAY_KEY_ID=
MONGO_URL=
```

Start the app

```
npm run start
```

#### 2. Setup with Docker (Please download Docker Desktop before setting up)

Clone Git Repository

```
git clone https://github.com/BurhanRaja/Ecommerce_Backend.git
```

Create a Docker Compose

```
version: "3"
services:
  ecommerce-node-app:
    image: ecommerce-backend:version1.0
    build:
      context: .
      args:
        NODE_ENV: development
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - SECRET_KEY=
      - RAZORPAY_SECRET_KEY=
      - RAZORPAY_KEY_ID=
      - MONGO_DB=
      - MONGO_USER=
      - MONGO_PASSWORD=
      - MONGO_PORT=
      - MONGO_IP=
    command: npm run prod
    depends_on:
      - mongo
  mongo:
    image: mongo
    environment:
      - MONGO_INITDB_ROOT_USERNAME=
      - MONGO_INITDB_ROOT_PASSWORD=
      - MONGO_INITDB_DATABASE=
    volumes:
      - mongo-db:/data/db

volumes:
  mongo-db:
```

Run and Build Docker Compose in detached Mode

```
docker-compose up -d
```

## Demo

https://github.com/BurhanRaja/Ecommerce_Backend/assets/76507095/61a77838-4f43-4ad6-b9d7-d5e747e209f3


## Technologies Used

<head>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.15.1/devicon.min.css">
</head>
  
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="50" height="50" /> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" width="50" height="50" /> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg" width="50" height="50" /> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-plain-wordmark.svg" width="50" height="50" /> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-plain-wordmark.svg" width="50" height="50" /> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg" width="50" height="50" />
          

## The node.js example app

The node.js example app teaches the very basics of how to work with manipulate REST API.
The app demonstrates how decoupling content from its presentation enables greater flexibility and facilitates shipping higher quality software more quickly.

## Requirements

* Node 18
* Git

## Common setup

Clone the repo and install the dependencies.

```bash
git clone https://github.com/tienv1per/nodejs_course.git
cd the-example-app.nodejs
```

```bash
npm install
```

## Steps for read-only access

To start the express server, run the following

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) and take a look around.


You can also deploy this app to Heroku:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)


## Use Docker
You can also run this app as a Docker container:

Step 1: Clone the repo

```bash
git clone https://github.com/tienv1per/nodejs_course.git
```

Step 2: Build the Docker image

```bash
docker build -t the-example-app.nodejs .
```

Step 3: Run the Docker container locally:

```bash
docker run -p 3000:3000 -d the-example-app.nodejs
```

If you created your own Contentful space, you can use it by overriding the following environment variables:

```bash
docker run -p 3000:3000 \
  -e CONTENTFUL_SPACE_ID=<SPACE_ID> \
  -e CONTENTFUL_DELIVERY_TOKEN=<DELIVERY_ACCESS_TOKEN> \
  -e CONTENTFUL_PREVIEW_TOKEN=<PREVIEW_ACCESS_TOKEN> \
  -d the-example-app.nodejs
```
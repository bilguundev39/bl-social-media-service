
# Social Media Service

A scalable backend service built to support a social media platform's core functionalities, including image resizing, comments, post reconcile.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Setup and Installation](#setup-and-installation)
5. [Configuration](#configuration)
6. [Usage](#usage)

## Project Overview

The Social Media Service is designed to handle post creation, image processing, and managing comments in a distributed system. This service uses Event-driven architecture to ensure reliable data processing across multiple consumers, which are responsible for managing posts, comments. Each services are loose-coupled communicate through message broker (Kafka). In real world I would separate into smaller independent services like post-service, image-service, comment-service to handle its own operations.

## Features

- **Post Creation**: Users can create posts with an image and a caption.
- **Comment Management**: Users can add and delete comments on posts.
- **Image Upload and Processing**: The service supports image processing (resize)
- **Scalable Architecture**: Built to handle large traffic with Kafka for message queuing.
- **Error Handling**: Comprehensive error handling with detailed error messages and logging.

## Architecture

- **Microservices**: Each feature (post creation, comment management, etc.) is handled by separate services.
- **Kafka Consumers**: Each consumer handles specific tasks like `post creation` and `image processing`.
- **MongoDB Database**: Used to store posts, comments

### Folder Structure

```plaintext
/social-media-service
├── src
│   ├── config        # Configuration files
│   ├── consumers     # Kafka consumers for various background tasks
│   ├── handlers      # Handles kafka messages & routes to service layer
│   ├── models        # Mongoose models for MongoDB
│   ├── producer      # Kafka producer to communicate other components
│   ├── services      # Business logic for handling core features
│   ├── utils         # Utility functions and helper methods
│   └── index.ts      # Entry point for the application
├── .env              # Environment variables
├── package.json      # Dependencies and scripts
└── README.md         # Documentation for the project
```

## Setup and Installation

### Installation

1. Clone the repository:
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables in a `.env.dev` file (see [Configuration](#configuration) section).

4. Run the consumer-service:

   ```bash
   npm run start-dev
   ```

## Configuration

Configure the following variables in the `.env.dev` file:

```plaintext
KAFKA_BROKERS=localhost:9092,localhost:9093
KAFKA_CLIENT_ID=API_SERVER
MONGO_URL=mongodb://localhost:27017/social_media
POST_EVENT_TOPIC=post-events
COMMENT_EVENT_TOPIC=comment-events
IMAGE_EVENT_TOPIC=image-events
FILE_BASE_URL=http://localhost:3000/
```

## Usage

### Starting the consumer service

To start the consumers, run:

```bash
npm run star-dev
```

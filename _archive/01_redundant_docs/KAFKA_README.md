# Kafka Microservice Workflow

This document outlines the Kafka integration workflow for this NestJS application, covering both request-response and event-based communication patterns.

## Prerequisites

Before running the application, ensure you have a running Kafka instance. A simple setup can be achieved using Docker Compose:

```yaml
# docker-compose.yml
version: '3'
services:
  zookeeper: # Zookeeper is required for Kafka to manage its cluster state
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - "2181:2181"

  kafka:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181 # Kafka connects to Zookeeper here
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092,PLAINTEXT_HOST://localhost:9092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
```

Run `docker-compose up -d` to start Kafka and Zookeeper.

## Communication Patterns

We leverage two primary communication patterns with Kafka.

### 1. Request-Response (Message-based)

This pattern is used when a service sends a request and expects a response from another service.

**Workflow:**

1.  **Client-Side (`.send()`):**
    *   A service injects the `ClientKafka` proxy.
    *   It calls `client.send('topic-name', payload)`.
    *   NestJS automatically creates a message with a unique `correlationId` and a `replyTopic`. The `replyTopic` is where the client will listen for the response.
    *   The message is produced to the `topic-name` Kafka topic.

2.  **Server-Side (`@MessagePattern`):**
    *   The Kafka microservice is subscribed to `topic-name`.
    *   It consumes the message from the topic.
    *   The handler decorated with `@MessagePattern('topic-name')` is invoked.
    *   The handler processes the request and returns a value (or an `Observable` that emits a value).

3.  **Response Flow:**
    *   The microservice takes the return value from the handler.
    *   It constructs a response message, including the original `correlationId`.
    *   This response is produced to the `replyTopic` specified in the initial request message.
    *   The original client, subscribed to the `replyTopic`, consumes the response, matches it using the `correlationId`, and resolves the `Observable` returned by the initial `.send()` call.

### 2. Event-Based (Fire-and-Forget)

This pattern is used for broadcasting events to interested services without waiting for a response.

**Workflow:**

1.  **Client-Side (`.emit()`):**
    *   A service calls `client.emit('event-topic', payload)`.
    *   The message is produced to the `event-topic` Kafka topic. No `replyTopic` or `correlationId` for response tracking is included.

2.  **Server-Side (`@EventPattern`):**
    *   One or more microservices are subscribed to `event-topic`.
    *   The handler(s) decorated with `@EventPattern('event-topic')` are invoked when a message is consumed.
    *   The handler performs its task (e.g., sends an email, updates a database).
    *   No response is sent back to the producer.
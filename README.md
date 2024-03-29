# LEF4CART

## Overview

Lef4Cart is a micro shopping cart app that is FREE and open source. One of its standout features is the use of RabbitMQ as a message broker. Additionally, Lef4Cart uses the standard HTTP protocol for data transmission

## ENVIRONMENT

```shell
# USING AT DOCKER CONTAINER
DATABASE_URL="mongodb://username:mongoDB2121@host.docker.internal:27017/shoppingCart?retryWrites=true&authSource=admin&directConnection=true"
# USING AT LOCALHOST
DATABASE_URL="mongodb://username:mongoDB2121@localhost:27017/shoppingCart?retryWrites=true&authSource=admin&directConnection=true"
## APP ENV
NODE_ENV="DEVELOPMENT"

## RABBITMQ ENV
RBMQ_URL="amqp://username:password@localhost:5672"
# CONFIG FOR CONSUMER
RBMQ_CART_EXCHANGE="lef4cart"
RBMQ_CART_QUEUE="sub.cartMessageQueue"
# CONFIG FOR PUBLISHER
RBMQ_PUB_QUEUE="pub.cartMessageQueue"
RBMQ_PUB_ROUTING_KEY="pub.MessageRouting"
## LOCAL SERVICE ENV
SERVICE_LOCAL_PORT="8081"

## DOCKER ENV
COMPOSE_PROJECT_NAME="shopping-cart"

```

## API

Endpoint :

* `/v1/shopping-cart` : method would be `GET, POST, PATCH, DELETE`

Request Body :

```json
{
    "task": "string", // valid selection: create, read, update, delete,
    "payload": {
        "apps_id": "string", // optional. Default: null
        "merchant_id": "string", // optional. Default: null
        "merchant_name": "string", // optional. Default: null
        "session_id": "string", // optional. Default: null
        "user_id": "string", // required      
        "product_id": "string", // required    
        "product_image": "string", // required. Accepting URL only 
        "product_name":  "string", // required
        "price": 0, // required       
        "quantity": 0, // required
    }
}
```

## RabbitMQ

Message Payload:

```json
{
    "task": "string", // valid selection: create, read, update, delete,
    "payload": {
        "apps_id": "string", // optional. Default: null
        "merchant_id": "string", // optional. Default: null
        "merchant_name": "string", // optional. Default: null
        "session_id": "string", // optional. Default: null
        "user_id": "string", // required      
        "product_id": "string", // required    
        "product_image": "string", // required. Accepting URL only 
        "product_name":  "string", // required
        "price": 0, // required       
        "quantity": 0, // required
    },
    // origin is required when using rabbitmq
    "origin": {
        "queue": "customerOrder",
        "routingKey": "customerOrderKey"
    }
}
```

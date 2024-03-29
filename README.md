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

Sample Request and Request Body :

```json
  {
    "task": "create",
    "payload": {
      "apps_id": "6606cc8ed9c25c6c5f00b48b",
      "merchant_id": "5798426b-8c7c-4064-b43b-d51e5ef6067b",
      "merchant_name": "My Favorite Store",
      "session_id": "a0a8ae1a-aa31-488c-9a6c-cfda44202446",
      "user_id": "deanknowles@valpreal.com",
      "product_id": "6606cc8e1b69fbabf8a3b534",
      "product_image": "https://images.mediaservice.io/example.jpeg",
      "product_name": "Apple Vision Pro",
      "price": 1000000,
      "quantity": 1
    }
  }
```
>[!NOTE]
> `task` consist of `create`, `read`, `update` and `delete`

## RabbitMQ

Message Payload :

```json
{
    "task": "create",
    "payload": {
      "apps_id": "6606cc8ed9c25c6c5f00b48b",
      "merchant_id": "5798426b-8c7c-4064-b43b-d51e5ef6067b",
      "merchant_name": "My Favorite Store",
      "session_id": "a0a8ae1a-aa31-488c-9a6c-cfda44202446",
      "user_id": "deanknowles@valpreal.com",
      "product_id": "6606cc8e1b69fbabf8a3b534",
      "product_image": "https://images.mediaservice.io/example.jpeg",
      "product_name": "Apple Vision Pro",
      "price": 1000000,
      "quantity": 1
    },
    "origin": {
      "queue": "customerOrder",
      "routingKey": "customerOrderKey"
    }
}
```

## Attribute descriptions

| Element   |  Value | Required |
| -------   |  ----------- | -------- |
| `task`    |  `create`, `read`, `update`, `delete` | Required
| `payload` | `Object`: Cart details | Required
| `apps_id` | `String`: (eg: server-key or service id) | Optional
| `merchant_id` | `String` | Optional
| `session_id` | `String` | Optional
| `user_id` | `String`: (eg: email or random token) | Required
| `product_id` | `String`: (eg: Product SKU) | Required
| `product_image` | `String`: value must be valid URL format | Required
| `product_name` | `String` | Required
| `price` | `Number` | Required
| `quantity` | `Number` | Required
| `origin` | `Object`: consist of two key [`queue`, `routingKey`] only required when using MQTT protocols | Required  

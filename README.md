# LEF4CART

## Overview

Lef4Cart is a micro shopping cart app that is FREE and open source. One of its standout features is the use of RabbitMQ as a message broker. Additionally, Lef4Cart uses the standard HTTP protocol for data transmission

<details>
<summary>See environment example</summary>

## ENVIRONMENT EXAMPLE

```shell
# USING AT DOCKER CONTAINER
DATABASE_URL="mongodb://username:password@host.docker.internal:27017/shoppingCart?retryWrites=true&authSource=admin&directConnection=true"
# USING AT LOCALHOST
DATABASE_URL="mongodb://username:password@localhost:27017/shoppingCart?retryWrites=true&authSource=admin&directConnection=true"
## APP ENV
NODE_ENV="DEVELOPMENT"

## RABBITMQ ENV
RBMQ_URL="amqp://username:password@localhost:5672"
# CONFIG FOR CONSUMER
RBMQ_CART_EXCHANGE="lef4cart"
RBMQ_CART_QUEUE="sub.cartMessageQueue"
RBMQ_CART_ROUTING_KEY="cartMessageRoutingKey"
# CONFIG FOR PUBLISHER
RBMQ_PUB_QUEUE="pub.cartMessageQueue"
RBMQ_PUB_ROUTING_KEY="pub.MessageRouting"
## LOCAL SERVICE ENV
SERVICE_LOCAL_PORT="8081"

## DOCKER ENV
COMPOSE_PROJECT_NAME="shopping-cart"

```
</details>

## API

Endpoint :

* `/v1/shopping-cart` : method would be `GET, POST, PATCH, DELETE`

<details>
<summary>POST Body JSON attribute </summary>

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
</details>

<details>
<summary>READ Body JSON attribute</summary>

```json
  {
    "task": "read",
    "payload": {
      "user_id": "deanknowles@valpreal.com"
    }
  }
```
</details>

<details>
<summary>PATCH Body JSON attribute</summary>

```json
  {
    "task": "update",
    "payload": {
      "user_id": "deanknowles@valpreal.com",
      "product_id": "6606cc8e1b69fbabf8a3b534",
      "quantity": 2,
      "params": "params"
    }
  }
```
> `PARAMS:` value must be `increment` or `decrement`
</details>

<details>
<summary>DELETE Body JSON attribute</summary>

```json
  {
    "task": "delete",
    "payload": {
        "id": ["arrayOfIDs"]
    }
  }
```
>`arrayOfIDs`: ID must be in array format consist of cart ID / ID's. eg: [1, 2, 3, 4]
</details><br>

>[!NOTE]
> `task` consist of `create`, `read`, `update` and `delete`


## 📍 Task Description & Method

| Task | Method | Minimum Payload |
| ---- | ------ | ------- |
| `create` | POST | `user_id`, `product_id`, `product_image`, `product_name`, `price`, `quantity` |
| `read` | GET | `user_id` |
| `update` | PATCH | `user_id`, `product_id`, `quantity` |
| `remove` | DELETE | `[id]` or `[cartId]` |

## RabbitMQ

<details>
<summary>Message Payload:</summary>

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

</details>

## Attribute descriptions

| Element   |  Description| Required |
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
| `custom_fields` | `Object`: [see example](#custom-fields-on-payload)  | Optional
| `origin` | `Object`: consist of two key [`queue`, `routingKey`] only required when using MQTT protocols | Required  

## Custom Fields on Payload

Custom fields allow you to add any extra info on user items, such as brand name, item size, color, and more.

<details>
<summary>Body JSON Attribute</summary>

```json
{
  "task": "create",
  "payload": {
    "custom_fields": {
      "brand": "XYZ",
      "color": "Green",
      "size": "XL"
    }
  }
}
```

</details>
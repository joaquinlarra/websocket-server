# Wizzy - Your custom websocket server

## Installation

```bash
$ npm install -g wizzy
```

## Configuration

You will have several methods to configure the websocket server.

### Configure with NODE_ENV

For example, if you are running as `NODE_ENV=development`, you can add a `development.js` file in the `config` folder in order to override configuration keys.

### Configure with environment variables

You can also use these environment variables that are read by default by the app :

| Variable | Role |
| -------- | ---- |
| `WIZZY_WS_PORT` | Port on which the websocket server will listen |
| `WIZZY_SCHEMAS_DIR` | Directory of the message JSON schemas |
| `WIZZY_SSL_CERT` | Path to the SSL certificate file |
| `WIZZY_SSL_KEY` | Path to the SSL key file |

> The specification for JSON schemas can be found on [this site](https://spacetelescope.github.io/understanding-json-schema/index.html).

You can also find default schemas inside the `schemas` folder of this application.

## Usage

```bash
WIZZY_WS_PORT=4999 WIZZY_SCHEMAS_DIR=/home/mchacaton/wizzy_schemas wizzy
```

By running this command, you will run the app by setting the port to `4999` and the schemas dir to `/home/mchacaton/wizzy_schemas`. So you can start to send messages to it at `ws://localhost:4999`.

If you want to use SSL, you will need SSL certificates as with Let's Encrypt or another Certification Authority and add them to the configuration or to the environment variables.

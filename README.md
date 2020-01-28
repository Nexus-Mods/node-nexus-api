# Nexus API

## Introduction

The Nexus API provides applications access to Nexus Mods metadata including lists of games, mods and individual files, version information and so on.

## Authorization

All requests must identify the user and the application which is making the request. To achieve this, a set of parameters must be set in the header of all requests.

### APIKEY

An APIKEY can be created for a specific user and a specific application on the Nexus Mods website. This key can be manually copied into your application and used when generating requests. Alternatively, a websocket-based Single Sign-On system can be used as described further down.

Based on this key, access for individual users or applications can be revoked (by Nexus Mods or the user himself), and access rights can be restricted (e.g. an application might be allowed to read mod meta data but not to make endorsements in the name of the user), finally, the key can also be used for network traffic throttling.

For this reason it's not acceptable for an application to use API keys created for other applications.

Before API Keys for your application can be generated you have to register your application with Nexus Mods. You will be assigned an appid.

### Protocol-Version

The protocol version identifies the exact protocol the client expects from the server and allows us to make improvements to the API without breaking older clients.
This version is set automatically by this library and there is no good reason to override it.

### Application-Version

The application version - which has to follow semantic versioning guidelines - identifies the version of your application and may be used to work around problems without affecting all users of the application.

E.g. if one version of your application has a bug that leads to it spamming a certain request, we might block that request for that application version without affecting other versions which don't have the problem.

Therefore it's in your, and your users best interest to provide a version in the right format and keeping it up-to-date.

## Single Sign-On

As described above, an APIKEY can be generated using a websocket-based protocol. This is *not* part of this library.

### Process

- Generate a random unique id (we suggest uuid v4)
- Create a websocket connection to wss://sso.nexusmods.com
- When the connection is established, send a JSON encoded message containing the id you just generated and the appid you got on registration.
Example: { "id": "4c694264-1fdb-48c6-a5a0-8edd9e53c7a6", "appid": "your_fancy_app" }
- From now on, until the connection is closed, send a websocket ping once every 30 seconds.
- Have the user open _https://www.nexusmods.com/sso?id=xyz_ (_id_ being the random id you generated in step 1) _in the default browser_
- On the website users will be asked to log-in to Nexus Mods if they aren't already. Then they will be asked to authorize your application to use their account.
- Once the user confirms, a message will be sent to your websocket with the APIKEY (not encoded, just the plain key). This is the only non-error message you will ever receive from the server.
- Save away the key and close the connection.

## API Reference

All relevant functionality is accessible through the [Nexus class](https://github.com/Nexus-Mods/node-nexus-api/blob/master/docs/classes/_nexus_.nexus.md).

The API may throw a bunch of [Custom Errors](https://github.com/Nexus-Mods/node-nexus-api/blob/master/docs/modules/_customerrors_.md).

### Throttling

The library implements request throttling to avoid spamming the API.
This is done on two levels: The client will use a quota of 300 (600 for premium) requests that can be used in bursts but only recover one request per second so it won't allow for sustained high traffic.

the server will also reject requests if traffic is to high both total traffic and per user by replying with a HTTP message code 429. In this event the api will reset it's quota to 0.

Please note that tampering with this throttling may lead to more requests being  blocked, resulting in even worse performance for your users, or - in extreme cases - even revocation of API Keys.

### Feedback API

The library contains a feedback API but it's only intended for internal use

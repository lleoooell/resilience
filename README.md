# Resilience

## Installation :


```
git clone https://github.com/lleoooell/resilience.git
cd resilience
npm install
node server.js
```

## View app :

```
app is living now on your server:3000

```

## Deploy for production with pm2 :

```
git clone https://github.com/lleoooell/resilience.git
cd resilience
npm install
pm2 start server.js --name resilience
```
## serve over hhtps to Enable geolocation for map:

```
create /keys folder at the root of the project and add your .pem files as :

add /keys/cert.pem
add /keys/privkey.pem
add /keys/chain.pem

```
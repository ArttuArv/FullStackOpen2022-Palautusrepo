# Köykäinen API doc

**Oletettu työskentelyjärjestys menee kuta kuinkin näin**

## /api/users käyttäjän luonti
### POST  
{  
  "username": "",  
  "name": "",  
  "password": ""  
}  

## /login
### POST  
{  
  "username": ""  
  "password": ""  
}  

**Ota Token ja käytä**  

## /api/blogs  
### POST + Token
{  
    "title": "",  
    "author": "",  
    "url": "",  
    "likes:": 0,  
    "user": ""  
}  

### Tai sitten vain npm run test

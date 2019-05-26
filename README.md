## How to run this api

- start a mongod server
- `npm i` to install node deps
- `npm start`

live demo is here



https://airbnb.benhalverson.me

### docs
Make a new user at 
POST /api/v1/users/register

`{
  "name": "name",
  "email": "email@email.com",
  "password": "password",
  "passwordConfirmation": "password"
}`


API will return

 `{ "registered": true}`

POST request to login will give you a Bearer token

`
 {
  "username": "TestUser",
  "email": "test@gmail.com",
  "password": "testtest"
  }
`

returns 
`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1Y2VhM2JlNDk0YTk0NWVhY2I4ZjFiYzciLCJ1c2VybmFtZSI6IlRlc3RVc2VyIiwiaWF0IjoxNTU4ODU0NjQ1LCJleHAiOjE1NTg4NTgyNDV9.s3ADhunuXI85CM6rG3h2bNAjLTR5ATl9O2nMFL51Rss`

### Make an authenticated GET request
GET request to get listings of apartments.
http://localhost:3000/api/v1/rentals/
Header 

`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1Y2VhM2JlNDk0YTk0NWVhY2I4ZjFiYzciLCJ1c2VybmFtZSI6IlRlc3RVc2VyIiwiaWF0IjoxNTU4ODU0NjQ1LCJleHAiOjE1NTg4NTgyNDV9.s3ADhunuXI85CM6rG3h2bNAjLTR5ATl9O2nMFL51Rss`

returns some sample data

`
[
    {
        "_id": "5cea3be494a945eacb8f1bcb",
        "title": "Modern apartment in center",
        "city": "new york",
        "street": "Time Square",
        "category": "apartment",
        "image": "https://localhost:3000/uploads/rental/image/5/image.jpeg",
        "bedrooms": 1,
        "shared": true,
        "description": "Very nice apartment in center of the city.",
        "dailyRate": 11,
        "createdAt": "2019-05-26T07:10:28.979Z",
        "user": "5cea3be494a945eacb8f1bc7",
        "__v": 0
    },
    {
        "_id": "5cea3be494a945eacb8f1bcd",
        "title": "Old house in nature",
        "city": "spisska nova ves",
        "street": "Banicka 1",
        "category": "house",
        "image": "https://localhost:3000/uploads/rental/image/5/image.jpeg",
        "bedrooms": 5,
        "shared": false,
        "description": "Very nice apartment in center of the city.",
        "dailyRate": 23,
        "createdAt": "2019-05-26T07:10:28.980Z",
        "user": "5cea3be494a945eacb8f1bc7",
        "__v": 0
    },
    {
        "_id": "5cea3be494a945eacb8f1bcf",
        "title": "Amazing modern place",
        "city": "san francisco",
        "street": "Green street",
        "category": "house",
        "image": "https://localhost:3000/uploads/rental/image/5/image.jpeg",
        "bedrooms": 2,
        "shared": false,
        "description": "Hiking routes 10 min walking away",
        "dailyRate": 140,
        "createdAt": "2019-05-26T07:10:28.980Z",
        "user": "5cea3be494a945eacb8f1bc7",
        "__v": 0
    },
    {
        "_id": "5cea3be494a945eacb8f1bd1",
        "title": "Apartment In China Town",
        "city": "san francisco",
        "street": "Union Street",
        "category": "apartment",
        "image": "https://localhost:3000/uploads/rental/image/5/image.jpeg",
        "bedrooms": 3,
        "shared": false,
        "description": "Very nice apartment in China Town",
        "dailyRate": 89,
        "createdAt": "2019-05-26T07:10:28.981Z",
        "user": "5cea3be494a945eacb8f1bc7",
        "__v": 0
    },
    {
        "_id": "5cea3be494a945eacb8f1bd3",
        "title": "House with Garden",
        "city": "new york",
        "street": "Long Island, Queens",
        "category": "house",
        "image": "https://localhost:3000/uploads/rental/image/5/image.jpeg",
        "bedrooms": 6,
        "shared": false,
        "description": "Very nice house in Long Island with garden",
        "dailyRate": 189,
        "createdAt": "2019-05-26T07:10:28.981Z",
        "user": "5cea3be494a945eacb8f1bc7",
        "__v": 0
    },
    {
        "_id": "5cea3be494a945eacb8f1bd5",
        "title": "Cozy modern Condo",
        "city": "new york",
        "street": "Penn Station",
        "category": "condo",
        "image": "https://localhost:3000/uploads/rental/image/5/image.jpeg",
        "bedrooms": 3,
        "shared": true,
        "description": "Building close to Penn Station",
        "dailyRate": 68,
        "createdAt": "2019-05-26T07:10:28.981Z",
        "user": "5cea3be494a945eacb8f1bc7",
        "__v": 0
    }
]
`


GET request by ID 

http://localhost:3000/api/v1/rentals/:id
`http://localhost:3000/api/v1/rentals/5cea3be494a945eacb8f1bcb`
Needs a Bearer token




Make an authenticated POST request
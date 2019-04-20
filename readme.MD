###Simple Redirecting / URL Shortening Server
**What's this?** It's a simple REST server to shorten and redirect users to certain URLS depending on the main URL provided.
This server started as a side project of "1 project a day", where I'll try to build a project each day, from design to upload.
---

###Environment Variables
**NODE_ENV** If ser to `PRODUCTION`, will enable the system to use production configuration. Otherwise, it will use development configuration.

**HOST** Is the URL that will be appended to the code for generating the shortened URL. If not specified, will default to HOST.

**Port** Is the port that will be defined to listen to the server requests. If not specified, will default to `3000`.

**JWTKey** Is the key that will be used to sign the JWTs. If not specified, will default to `l1k2j3j12n312l3b123jl`.

----

###Main Functions
####View registered users
**notes** Only the first user (aapointed as the admin) can see the user records.

**method** `GET /auth/user?skip=$skip$&limit=$limit$`

**responses**
`CODE:200 | data:JSON {data:[PROFILE]}`
`CODE:500 | data: JSON {error:STRING}`

####Create an user

**method** `POST /auth/user`

**body data** ` JSON {username: String, password: String}`

**responses**
`CODE:200 | data:null`
`CODE:40*|500 | data: JSON {error:STRING}`

####Sign In

**method** `POST /auth/login`

**body data** `JSON {username:String, password:String}`

**responses**
`CODE: 200 | data: JSON {jwt:String}`
`CODE: 40*|500 | data: JSON {error:STRING}`

####Shortening Request
**NOTE** (Requires log-in + Authorization header with JWT provided on Log-in)

**method** `POST /reqShort?url=$URL$`

**parameters** `$URL$: The URL to shorten. Must be a valid URL.`

**responses**
`CODE: 200 | data: JSON {url:String}`
`CODE: 40*|500 | data: JSON {error:String}`

####Shortening Redirect
**NOTE** (Requires log-in + Authorization header with JWT provided on Log-in)

**method** `GET /$REDIRECT_TOCE$ (Via Browser)`

**parameters** `$REDIRECT_CODE$: The code of the shortened URL.`

**responses**
`CODE: 301 + Redirection to the Page`
`CODE: 404 | data: null`
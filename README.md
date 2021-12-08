# ScoreZone

Scorezone is a website on which you can predict football matches.

## Local installation

#### Step 1: Setup the database

1. Clone this repository
2. Create a MySQL database called `ScoreZone`
3. Run the DDL script in `/db/scorezoneDDL.sql`
4. Run the seed script in `db/scorezoneSeed.sql`

#### Step 2: Set up environment variables

Create a file called `.env.local` in the root of the project and set the following variables:

-   `MYSQL_HOST` - Your MySQL host URL.
-   `MYSQL_DATABASE` - The name of the MySQL database you want to use.
-   `MYSQL_USERNAME` - The name of the MySQL user with access to database.
-   `MYSQL_PASSWORD` - The password of the MySQL user.
-   `MYSQL_PORT` - The port on which the database resides.
-   `NODE_ENV` - Set the value of this variable to `development`.

#### Step 3: Run website

Run the following command to start the website:

```bash
npm install
npm run dev
```

You can now navigate to [localhost:3000](localhost:3000) and login on the website using the following credentials:

**Admin**: `username = admin`, `password = testadmin`
**User**: `username = user`, `password = testuser`

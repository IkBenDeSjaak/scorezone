# ScoreZone

Scorezone is a website on which you can predict football matches.

## Local installation

#### Step 1: Setup the database

1. Clone this repository
2. Create a MySQL database called `ScoreZoneTestDB`
3. Run the DDL script in `/db/scorezone_dll.sql`
4. Run the seed script in `/db/scorezone_seed.sql`

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

-   **Admin**: `username = testadmin`, `password = testadmin`
-   **User**: `username = testuser`, `password = testuser`

## Development styles

**JavaScript Standard Style**
Run `npm run style` in the terminal to format the code before committing.

**Next Lint**
Run `npm run lint` in the terminal to see errors that need to be fixed before committing.

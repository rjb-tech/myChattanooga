# myChattanooga Backend

Be sure to `npm i` before starting work

## Dev environment Variables (.env)

```
DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"
```

## Data Models

The data models and migrations are made using [Prisma](https://www.prisma.io/). All the migration files and models can be found in the `/prisma` directory.

**Apply previous migrations**

- Note: This deletes all data. Do not use in prod pls

```
npx prisma migrate reset
```

**Create and apply new migration**

```
npx prisma migrate --name <migration_name>
```

## Database

This project uses Supabase for the Database. Built in auth and easy file storage are too good to pass up.

**Start local development environment**

```
supabase start
```

**Stop local development environment**

```
Supabase stop
```

## Scrapers

All scrapers are written in Typescript using [Playwright](https://github.com/microsoft/playwright). They can be found in the `/scrapers` folder. There are separate folders for news and web scrapers that can be called using npm scripts. They both share a factory pattern design and class-based structure.

**Run standalone scraper scraper**

```
npm run scrape:<news | weather>
```

**Run all scrapers**

```
npm run scrape
```

## Hosting

**Adding new user to [Digital Ocean Droplet](https://cloud.digitalocean.com/projects/1fb3d67d-1a7f-4328-9775-81ec7c3561dd/resources?i=805fde)**

1. Create a new ssh key using [this guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent). Call it whatever you want
2. Create new user account on droplet

```
adduser <new_username>
usermod -d /home/<new_username> -m <new_username>
usermod -aG sudo <new_username>
```

3. Add SSH public key (<new_keyname>.pub) from step 1 to the `~/.ssh/authorized_keys`
4. Profit and access the server using ssh from your machine. IP in Bitwarden

[Supabase project](https://supabase.com/dashboard/project/irlbnquhcxpdvhbdqsqp)

# Quiz

## Setup guide

1. Install yarn if needed:

```bash
npm install --global yarn
```

2. Install dependencies

```bash
yarn
```

3. Create database

```bash
sudo -u postgres psql
```

```sql
create user quiz;
alter user quiz with encrypted password 'quiz';
create database quiz;
grant all privileges on database quiz to quiz;
\q
```

4. Start server

```bash
yarn start
```

5. Try to use users resource

```bash
http :3000/users firstName=Alex lastName="Kotov"
http :3000/users
```

## api

###auth
"# library" 

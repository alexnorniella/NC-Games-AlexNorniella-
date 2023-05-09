# Northcoders House of Games API

## Background

Ensure that you have cloned down the repo first.

You will need to make your own public repo so that you can share this project as part of your portfolio by doing the following:

Create a new public GitHub repository. Do not initialise the project with a readme, .gitignore or license.
From your cloned local version of this project you'll want to push your code to your new repository using the following commands:

git remote set-url origin YOUR_NEW_REPO_URL_HERE
git branch -M main
git push -u origin main



Once you have cloned down the project, be sure to run npm install to instal all the relevant packages. Most of what you need is there already, but you will additionally need to install express and supertest

You will need to create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored => *env on thre git ignore. 
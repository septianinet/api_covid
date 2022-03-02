#Mini Project Covid19 API

## Installation

1. Create a database in Postgres and give it a name `api_covid`
2. Create a table and give it a name `covid_data`
3. add fields to the table you create before. `id, total_positive, total_hospitalize, total_recovered, total_pass_away, date, created_date`
4. Clone this repo and execute `yarn install` in command line
5. Start project by executing `yarn start`
    
## How to test it

1. Execute `http://localhost:your_port/fetch` to updates the data covid
2. Execute `http://localhost:your_port/updates` to see the lastest data.

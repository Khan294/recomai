
DETAILS:

TODO: Primary
- Make repo
- In information create and update (conditionally) functions, create a generate rule book function that will take all the information that needs to be passed to the generic models (openAi) and then generate tags accordingly
- Specific models (TF)?

Secondary todos
- add postman api (Fahad)
- db config needs to go in env variables
- Just like view functionality update and create should return associated modules
- Parent keys are nullable instead of cascade at this moment
- Add validations in the form
- Add authentication

Useful commands:
npx sequelize-cli model:generate --name Model --attributes id:integer,label:string
npx sequelize-cli db:migrate

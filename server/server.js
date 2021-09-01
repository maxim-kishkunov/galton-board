const express = require("express");
const pg = require('pg');
const bcrypt = require('bcrypt');
const uuid = require('node-uuid');
const bodyParser = require('body-parser')

const db = new pg.Pool({
 host: 'localhost',
 database: 'galton_board',
 user: 'api_user',
 password: 'unibiter',
 port: '5432'
});
const PORT = process.env.PORT || 3001;

const app = express();

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));

const makeid = function(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
 }
 return result;
}

app.get("/migrate", async (req, res) => {
  let queryText = "select exists(select FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'public' AND TABLE_NAME = 'users')";
  let tablesExist = false;
  let inner_results = [];
  
  await db.query(queryText)
  .then(async(result) => {
    tablesExist = result.rows[0].exists;
  });
  if(!tablesExist){
    //users
    queryText =  'CREATE TABLE users(';
    queryText += 'id UUID PRIMARY KEY, ';
    queryText += 'email VARCHAR(255) NOT NULL UNIQUE, ';
    queryText += 'name VARCHAR(255) UNIQUE, ';
    queryText += 'encrypted_password VARCHAR(255) NOT NULL, ';
    queryText += 'token VARCHAR(255) NOT NULL, ';
    queryText += 'is_confirmed BOOLEAN NOT NULL, ';
    queryText += 'created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL';
    queryText += ')';    
    await db.query(queryText);

    //roles
    queryText =  'CREATE TABLE roles(';
    queryText += 'id UUID PRIMARY KEY, ';
    queryText += 'key VARCHAR(255) NOT NULL UNIQUE';
    queryText += ')';
    
    await db.query(queryText).then(async(result) => {
      let text = '';
      let values = [];
      let lectRoleID = '';
      let adminRoleID = '';

      text = 'INSERT INTO roles(id, key) VALUES($1, $2) RETURNING *';
      values = [uuid.v4(), 'lecturer'];
      await db.query(text, values).then((result) => {
        lectRoleID = result.rows[0].id;
        inner_results.push('Роль летора создана');
      });

      text = 'INSERT INTO roles(id, key) VALUES($1, $2)';
      values = [uuid.v4(), 'user'];
      await db.query(text, values);

      text = 'INSERT INTO roles(id, key) VALUES($1, $2) RETURNING *';
      values = [uuid.v4(), 'admin'];
      await db.query(text, values).then((result) => {
        adminRoleID = result.rows[0].id;
        inner_results.push('Роль админа создана');
      });

      //user_roles
      queryText =  'CREATE TABLE user_roles(';
      queryText += 'id UUID PRIMARY KEY, ';
      queryText += 'user_id UUID NOT NULL, ';
      queryText += 'role_id UUID NOT NULL, ';
      queryText += 'created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL';
      queryText += ')';

      await  db.query(queryText).then(async(result) => {                  
        let lectUserID = '';
        let adminUserID = '';
        let time = new Date();
        let lectPassword = await bcrypt.hashSync('unibiter', 10);
        text = 'INSERT INTO users(id, email, name, encrypted_password, token, is_confirmed, created_at) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';
        values = [
          uuid.v4(),
          'lecturer@unibit.pro',
          'lecturer',
          lectPassword,
          '123',
          true,
          time
        ];
        await db.query(text, values).then((result) => {
          lectUserID = result.rows[0].id;
          inner_results.push('Юзер лектора создан');
        });

        let admPassword = await bcrypt.hashSync('unibiter', 10);
        text = 'INSERT INTO users(id, email, name, encrypted_password, token, is_confirmed, created_at) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';
        values = [
          uuid.v4(),
          'admin@unibit.pro',
          'admin',
          admPassword,
          '123',
          true,
          time
        ];
        await db.query(text, values).then((result) => {
          adminUserID = result.rows[0].id;
          inner_results.push('Юзер админа создан');
        });
        
        text = 'INSERT INTO user_roles(id, user_id, role_id, created_at) VALUES($1, $2, $3, $4) RETURNING *';
        values = [
          uuid.v4(),
          lectUserID,
          lectRoleID,
          time
        ];
        db.query(text, values).then((result) => {
          inner_results.push('Роль юзеру лектора дана');
        });

        text = 'INSERT INTO user_roles(id, user_id, role_id, created_at) VALUES($1, $2, $3, $4) RETURNING *';
        values = [
          uuid.v4(),
          adminUserID,
          adminRoleID,
          time
        ];
        db.query(text, values).then((result) => {
          inner_results.push('Роль админу лектора дана');
        });
      });
    });

    //groups
    queryText =  'CREATE TABLE groups(';
    queryText += 'id UUID PRIMARY KEY, ';
    queryText += 'name VARCHAR(255) NOT NULL, ';
    queryText += 'is_active BOOLEAN NOT NULL, ';
    queryText += 'created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL';
    queryText += ')';    
    await db.query(queryText);

    //group_users
    queryText =  'CREATE TABLE group_users(';
    queryText += 'id UUID PRIMARY KEY, ';
    queryText += 'group_id UUID NOT NULL, ';
    queryText += 'user_id UUID NOT NULL, ';
    queryText += 'created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL';
    queryText += ')';    
    await db.query(queryText);

    //galton_inputs
    queryText =  'CREATE TABLE galton_inputs(';
    queryText += 'id UUID PRIMARY KEY, ';
    queryText += 'drops_quantity INTEGER NOT NULL, ';
    queryText += 'board_length INTEGER NOT NULL, ';
    queryText += 'input_json VARCHAR(255) NOT NULL, ';
    queryText += 'random_shift integer, ';
    queryText += 'created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL';
    queryText += ')';    
    await db.query(queryText);

    //group_inputs
    queryText =  'CREATE TABLE group_inputs(';
    queryText += 'id UUID PRIMARY KEY, ';
    queryText += 'group_id UUID NOT NULL, ';
    queryText += 'input_id UUID NOT NULL, ';
    queryText += 'created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL';
    queryText += ')';    
    await db.query(queryText);

    //user_outputs
    queryText =  'CREATE TABLE user_outputs(';
    queryText += 'id UUID PRIMARY KEY, ';
    queryText += 'user_id UUID NOT NULL, ';
    queryText += 'output_json VARCHAR(255) NOT NULL, ';
    queryText += 'created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL';
    queryText += ')';    
    await db.query(queryText);

    result = 'tables are created!';
  }else{
    result = 'tables are exist';
  }
  res.json({ message: result, inner_results: inner_results });

});

app.get("/registrate", async (req, res) => {
  let query = req.query;
  let passwordHash = await bcrypt.hashSync(query.password, 10);
  let userRoleID = '';
  let newUserID = '';
  let inner_results = [];

  let queryText = `SELECT users.id as id FROM users WHERE users.email = '${query.email}'`
  db.query(queryText).then(async (resEmailCheck) => {
    let emailExist = resEmailCheck.rows.length && resEmailCheck.rows[0].id;
    if(!emailExist){
      let queryText = `SELECT roles.id as id FROM roles WHERE key = 'user'`;
      await db.query(queryText).then((result) => {
        userRoleID = result.rows[0].id;
        inner_results.push('User role object received');
      });

      let token = await makeid(10);
      let time = new Date();
      queryText = 'INSERT INTO users(id, email, name, encrypted_password, token, is_confirmed, created_at) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';
      values = [
        uuid.v4(),
        query.email,
        query.name,
        passwordHash,
        token,
        false,
        time
      ];
      await db.query(queryText, values).then((result) => {
        newUserID = result.rows[0].id;
        inner_results.push('User object created');
      });

      queryText = 'INSERT INTO user_roles(id, user_id, role_id, created_at) VALUES($1, $2, $3, $4) RETURNING *';
      values = [
        uuid.v4(),
        newUserID,
        userRoleID,
        time
      ];
      await db.query(queryText, values).then((result) => {
        inner_results.push('User role created');
      });
      res.json({
        user_id: newUserID,
        user_email: query.email,
        user_name: query.name,
        role_id: userRoleID,
        service_info: inner_results,
        code: 200
      });
    }else{
      res.json({
        code: 401,
        message: 'User with this email is already exist',
      });
    }
  });
});

app.get("/get_lect_data", async (req, res) => {     
  let queryText =  `
    SELECT
    groups.id AS group_id,
    groups.name AS group_name,
    groups.is_active AS group_is_active,
    users.id AS user_id,
    users.name AS user_name,
    galton_inputs.drops_quantity AS drops_quantity,
    galton_inputs.board_length AS board_length,
    galton_inputs.input_json AS input_json,
    galton_inputs.random_shift AS random_shift,
    roles.key AS role_key
  FROM groups
  LEFT JOIN group_users ON group_users.group_id = groups.id
  LEFT JOIN users ON group_users.user_id = users.id
  LEFT JOIN user_roles ON user_roles.user_id = users.id
  LEFT JOIN roles ON user_roles.role_id = roles.id
  LEFT JOIN group_inputs ON group_users.group_id = group_inputs.group_id
  LEFT JOIN galton_inputs ON galton_inputs.id = group_inputs.input_id
  UNION ALL
  SELECT
    '00000000-0000-0000-0000-000000000000' AS group_id,
    'no_group' AS group_name,
    'true' AS group_is_active,
    users.id AS user_id,
    users.name AS user_name,
    '0' AS drops_quantity,
    '0' AS board_length,
    '' AS input_json,
    '0' AS random_shift,
    roles.key AS role_key
  FROM users
  LEFT JOIN user_roles ON user_roles.user_id = users.id
  LEFT JOIN roles ON user_roles.role_id = roles.id 
  WHERE roles.key != 'lecturer' AND roles.key != 'admin'`;


  let table_data = [];
  await db.query(queryText).then((result) => {
    if(result.rows.length > 0)
      table_data = result.rows;
  });

  let groupsWithUsers = {};
  let groupData = [];
  for(let i = 0; i < table_data.length; i++){
    let item = table_data[i];
    if(typeof groupsWithUsers[item.group_id] === 'undefined'){
      groupsWithUsers[item.group_id] = [];
      groupData.push({
        id: item.group_id,
        name: item.group_name,
        is_active: item.group_is_active
      })
    }
    groupsWithUsers[item.group_id].push(item);
  }

  if(table_data.length > 0 )
    res.json({ group_data: groupData, data: groupsWithUsers, code: 200 });
  else
    res.json({ message: 'Table data is not found', code: 404 });
});

app.post("/create_new_group", async (req, res) => {
  let query = req.body;
  let text = 'INSERT INTO groups (id, name, is_active, created_at) VALUES($1, $2, $3, $4) RETURNING *';
  let time = new Date();
  let values = [
    uuid.v4(),
    query.name,
    true,
    time
  ];
  let success = false;
  let inner_results = [];
  db.query(text, values).then((result) => {
    inner_results.push('Группа создана');
    success = true;
  });
  if(success)
    res.json({ message:inner_results, code: 200 });
  else
    res.json({ message: 'Error with creation of group', code: 401 });
});

app.get("/check_user_role", async (req, res) => {
  let query = req.query;
     
  let queryText =  `SELECT * `;
  queryText += `FROM user_roles `;
  queryText += `LEFT JOIN roles ON roles.id = user_roles.role_id `;
  queryText += `WHERE user_roles.user_id = '${query.user_id}'`;

  let role_key = '';
  await db.query(queryText).then((result) => {
    if(result.rows.length > 0 && Object.keys(result.rows[0]).length > 0)
      role_key = result.rows[0].key;
  });

  if(role_key.length > 0 )
    res.json({ role: role_key, code: 200 });
  else
    res.json({ message: 'User role is not found', code: 404 });
});

app.get("/auth", async (req, res) => {
  let query = req.query;
  let passwordHash = await bcrypt.hashSync(query.password, 10);

  let queryText = `SELECT
    users.id as id,
    users.email as email,
    users.encrypted_password as encrypted_password,
    roles.id as role_id
  FROM users 
  LEFT JOIN user_roles ON user_roles.user_id = users.id
  LEFT JOIN roles ON user_roles.role_id = roles.id
  WHERE users.email = '${query.email}'`

  db.query(queryText).then((result) => {
    if(result.rows.length > 0 && Object.keys(result.rows[0]).length > 0){
      let currItem = result.rows[0];
      bcrypt.compare(query.password, currItem.encrypted_password).then(function(cmpRes) {
        if(cmpRes)
          res.json({
            user_id: currItem.id,
            user_email: currItem.email,
            role_id: currItem.role_id,
            message: 'Success!', 
            code: 200
          });
        else
          res.json({ message: 'Wrong email or password', code: 401 });
      });
    }else
      res.json({ message: 'Wrong email or password', code: 401 });
  });
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
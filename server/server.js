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

const dropSome = function(quantity, size) {
  let allRoutes = [];

  for(let i = 0; i < quantity; i ++){
      let routeItem = [0];
      for(let j = 1; j <= size; j ++){
          let randAddNumber = Math.round(Math.random(0));
          routeItem.push(routeItem[routeItem.length - 1] + randAddNumber);
      }
      allRoutes.push(routeItem);
  }
  return allRoutes;
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
    queryText += 'input_json TEXT NOT NULL, ';
    queryText += 'input_last_row_json TEXT NOT NULL, ';
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
    queryText += 'output_json TEXT NOT NULL, ';
    queryText += 'result_json TEXT NOT NULL, ';
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
      galton_inputs.input_last_row_json AS input_last_row_json,
      galton_inputs.random_shift AS random_shift,
      user_outputs.result_json AS result_json,
      roles.key AS role_key
    FROM groups
    LEFT JOIN group_users ON group_users.group_id = groups.id
    LEFT JOIN user_outputs ON user_outputs.user_id = group_users.user_id
    LEFT JOIN users ON group_users.user_id = users.id
    LEFT JOIN user_roles ON user_roles.user_id = users.id
    LEFT JOIN roles ON user_roles.role_id = roles.id
    LEFT JOIN group_inputs ON groups.id = group_inputs.group_id
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
      '' AS input_last_row_json,
      '0' AS random_shift,
      '' AS result_json,
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
  let ckeckedIds = [];
  for(let i = 0; i < table_data.length; i++){
    let item = table_data[i];
    if(!ckeckedIds.find(elt => elt && elt === item.user_id)){
      if(typeof groupsWithUsers[item.group_id] === 'undefined'){
        groupsWithUsers[item.group_id] = [];
        groupData.push({
          id: item.group_id,
          name: item.group_name,
          is_active: item.group_is_active,
          drops_quantity: item.drops_quantity,
          board_length: item.board_length,
          input_json: item.input_json,
          random_shift: item.random_shift,
        })
      }
      groupsWithUsers[item.group_id].push(item);
      ckeckedIds.push(item.user_id);
    }
  }

  if(table_data.length > 0 )
    res.json({ group_data: groupData, data: groupsWithUsers, code: 200 });
  else
    res.json({ message: 'Table data is not found', code: 404 });
});

app.get("/get_user_data", async (req, res) => {
  let query = req.query;
  let queryText =  `
    SELECT
      user_outputs.output_json AS output_json,
      user_outputs.result_json AS result_json,
      galton_inputs.drops_quantity AS drops_quantity
    FROM users
    LEFT JOIN group_users ON group_users.user_id = users.id
    LEFT JOIN group_inputs ON group_inputs.group_id = group_users.group_id
    LEFT JOIN galton_inputs ON group_inputs.input_id = galton_inputs.id
    LEFT JOIN user_outputs ON user_outputs.user_id = users.id
    WHERE users.id = '${query.user_id}'
  `;

  let table_data = {};
  await db.query(queryText).then((result) => {
    if(result.rows.length > 0)
      table_data = result.rows[0];
  });

  if(Object.keys(table_data).length > 0 )
    res.json({ data: table_data, code: 200 });
  else
    res.json({ message: 'User data is not found', code: 404 });
});

app.get("/check_result_step", async (req, res) => {
  let inner_results = [];
  let query = req.query;
  let queryText =  `
    SELECT
      user_outputs.id AS id,
      user_outputs.output_json AS output_json,
      user_outputs.result_json AS result_json,
      galton_inputs.input_last_row_json AS input_last_row_json,
      galton_inputs.drops_quantity AS drops_quantity,
      galton_inputs.board_length AS board_length
    FROM users
    LEFT JOIN group_users ON group_users.user_id = users.id
    LEFT JOIN group_inputs ON group_inputs.group_id = group_users.group_id
    LEFT JOIN galton_inputs ON group_inputs.input_id = galton_inputs.id
    LEFT JOIN user_outputs ON user_outputs.user_id = users.id
    WHERE users.id = '${query.user_id}'
  `;

  let data = {};
  await db.query(queryText).then((result) => {
    inner_results.push('Данные пользователя получены');
    if(result.rows.length > 0)
      data = result.rows[0];
  });

  result_data = {};
  let success = false;

  if(Object.keys(data).length > 0 ){
    let resultRow = JSON.parse(data.input_last_row_json);
    let userOutput = JSON.parse(data.output_json);
    if(!userOutput)
      userOutput = [];

    result_data.drops_quantity = data.drops_quantity;
    result_data.board_length = data.board_length;
    if(+query.step === 0 && data.result_json === null){
      inner_results.push('Это первый шаг, действий не выполняется');
      result_data.stepValue = resultRow[0];
      result_data.userResult = [resultRow[0]];
      result_data.userOutput = [];
      result_data.initialResult = [];
    }else if(userOutput.length === result_data.drops_quantity){
      let userResult = JSON.parse(data.result_json);
      result_data.userResult = userResult;
      result_data.userOutput = userOutput;
      result_data.initialResult = resultRow;
    }else{
      let userResult = JSON.parse(data.result_json);

      if(!userResult)
        userResult = [resultRow[0]];

      userOutput[+ query.step - 1] = + query.value;
      userResult[+ query.step] = + resultRow[query.step] + parseInt(query.value);

      let queryText =  ``;
      let time = new Date();
      let values = [];
      if(data.id){
        queryText = `
          UPDATE user_outputs 
          SET 
            output_json = '${JSON.stringify(userOutput)}',
            result_json = '${JSON.stringify(userResult)}'
          WHERE id = '${data.id}'
        `;
      }else{
        queryText = 'INSERT INTO user_outputs(id, user_id, output_json, result_json, created_at) VALUES($1, $2, $3, $4, $5) RETURNING *';
        
        values = [
          uuid.v4(),
          query.user_id,
          JSON.stringify(userOutput),
          JSON.stringify(userResult),
          time
        ];
      }
      await db.query(queryText, values).then((result) => {
        inner_results.push('Данные пользователя обновлены');
        success = true;
        result_data.stepValue = userResult[+ query.step - 1];
        result_data.userResult = userResult;
        result_data.userOutput = userOutput;
        result_data.initialResult = [];
      });
    }
  }

  if(Object.keys(result_data).length > 0 )
    res.json({ data: result_data, inner_results: inner_results, code: 200 });
  else
    res.json({ message: 'User data is not found', code: 404 });
});

app.post("/change_user_group", async (req, res) => {
  let query = req.body;
  let success = false;
  let inner_results = [];
  let queryText = `DELETE FROM group_users WHERE user_id = '${query.user_id}'`;
  await db.query(queryText).then((result) => {
    inner_results.push('Предыдущее значение группы пользователя удалено.');
    success = true;
  });

  queryText = 'INSERT INTO group_users (id, group_id, user_id, created_at) VALUES($1, $2, $3, $4) RETURNING *';  
  let time = new Date();
  let values = [
    uuid.v4(),
    query.group_id,
    query.user_id,
    time
  ];
  await db.query(queryText, values).then((result) => {
    inner_results.push('Новое значение группы пользователя добавлено.');
    success = true;
  });
  if(success)
    res.json({ message:inner_results, code: 200 });
  else
    res.json({ message: 'Error with creation of group', code: 401 });
});

app.post("/create_group_input", async (req, res) => {
  let query = req.body;
  let group_data = query.group_data;
  let success = false;
  let inner_results = [];

  let queryText = 'INSERT INTO galton_inputs (id, drops_quantity, board_length, input_json, input_last_row_json, random_shift, created_at) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';  
  let input_json = await dropSome(group_data.drops_quantity, group_data.board_length);
  let random_shift = Math.floor(Math.random() * 7) * (Math.random() >= 0.5 ? -1 : 1);
  let time = new Date();
  let new_input_id = uuid.v4();

  let inputLastRow = [];
  let correction = Math.round(+ group_data.board_length / 2);
  for(let i = 0; i < input_json.length; i++){
      let currItem = input_json[i];
      inputLastRow.push(currItem[currItem.length - 1] - correction + random_shift);
  }

  let values = [
    new_input_id,
    group_data.drops_quantity,
    group_data.board_length,
    JSON.stringify(input_json),
    JSON.stringify(inputLastRow),
    random_shift,
    time
  ];
  await db.query(queryText, values).then((result) => {
    inner_results.push('Новое значение исходных данных добавлено.');
    success = true;
  });

  queryText = 'INSERT INTO group_inputs (id, group_id, input_id, created_at) VALUES($1, $2, $3, $4) RETURNING *';  

  values = [
    uuid.v4(),
    group_data.id,
    new_input_id,
    time
  ];
  await db.query(queryText, values).then((result) => {
    inner_results.push('Значение исходных данных для группы добавлено.');
    success = true;
  });
  if(success)
    res.json({ message:inner_results, code: 200 });
  else
    res.json({ message: 'Error with creation!', code: 401 });
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
    users.is_confirmed as is_confirmed,
    roles.id as role_id
  FROM users 
  LEFT JOIN user_roles ON user_roles.user_id = users.id
  LEFT JOIN roles ON user_roles.role_id = roles.id
  WHERE users.email = '${query.email}'`

  db.query(queryText).then((result) => {
    if(result.rows.length > 0 && Object.keys(result.rows[0]).length > 0){
      let currItem = result.rows[0];
      bcrypt.compare(query.password, currItem.encrypted_password).then(function(cmpRes) {
        if(cmpRes){
          if(currItem.is_confirmed){
            res.json({
              user_id: currItem.id,
              user_email: currItem.email,
              role_id: currItem.role_id,
              message: 'Success!', 
              code: 200
            });
          }else{
            res.json({ message: 'Your account is not activated', code: 401 });
          }
        }else
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
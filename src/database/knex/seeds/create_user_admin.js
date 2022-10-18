const { hash } = require('bcryptjs');

exports.seed = async function seed(knex) {
  await knex('users').insert([
    {
      name: 'admin',
      email: 'admin@email.com',
      password: await hash('123456', 8),
      is_admin: true
    }
  ]);
};

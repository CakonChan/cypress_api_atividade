Cypress.Commands.add('CadastrarProduto', (token, produto, preco, descricao, quantidade) =>{

    cy.request({
      method: 'POST',
      url: '/produtos',
      failOnStatusCode: false,
      headers: {
        authorization: token
      },
      body: {
        "nome": produto,
        "preco": preco,
        "descricao": descricao,
        "quantidade": quantidade
      }
    })

})

Cypress.Commands.add('ListarUsuarios', () => {
  
  cy.request({
    method: 'GET',
    url: '/usuarios',
  })

})

Cypress.Commands.add('CadastrarUsuario', (nome, email, senha, administrador) => {
  
  cy.request({
    method: 'POST',
    url: '/usuarios',
    failOnStatusCode: false,
    body: {
      nome,
      email: email,
      password: senha,
      administrador
    }
  })

})

Cypress.Commands.add('EditarUsuario', (id, nome, email, senha, administrador) => {
  
  cy.request({
    method: 'PUT',
    url: `/usuarios/${id}`,
    failOnStatusCode: false,
    body: {
      nome,
      email,
      password: senha,
      administrador
    }
  })

})

Cypress.Commands.add('DeletarUsuario', (id) => {
  
  cy.request({
    method: 'DELETE',
    url: `/usuarios/${id}`,
    failOnStatusCode: false
  });

});

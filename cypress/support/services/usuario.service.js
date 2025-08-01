/// <reference types="cypress" />

export function cadastrarUsuario(nome, email, senha, administrador = 'true') {
  return cy.request({
    method: 'POST',
    url: '/usuarios',
    failOnStatusCode: false,
    body: {
      nome,
      email,
      password: senha,
      administrador
    }
  });
}

export function editarUsuario(id, nome, email, senha, administrador = 'true') {
  return cy.request({
    method: 'PUT',
    url: `/usuarios/${id}`,
    failOnStatusCode: false,
    body: {
      nome,
      email,
      password: senha,
      administrador
    }
  });
}

export function deletarUsuario(id) {
  return cy.request({
    method: 'DELETE',
    url: `/usuarios/${id}`,
    failOnStatusCode: false
  });
}

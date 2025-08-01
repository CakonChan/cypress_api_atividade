/// <reference types="cypress" />
import contrato from '../contracts/produtos.contrato'

describe('Teste de API - Produtos', () => {

  let token;

  before(() => {
    cy.request({
      method: 'POST',
      url: '/login',
      body: {
        email: "fulano@qa.com",
        password: "teste"
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      token = response.body.authorization
    })
  })


  it('Listar Produtos - GET', () => {
    cy.request({
      method: 'GET',
      url: '/produtos'
    }).should((response) => {
      expect(response.status).equal(200)
      expect(response.body).to.have.property('produtos')
    })
  })


  it('Cadastrar Produto - POST Com Token', () => {

    cy.request({
      method: 'POST',
      url: '/produtos',
      failOnStatusCode: false,
      headers: {
        authorization: token
      },
      body: {
        "nome": "Cabo USB",
        "preco": 15,
        "descricao": "Cabo USB do tipo C",
        "quantidade": 100
      }
    }).then((response) => {
      if (response.status === 201) {
        expect(response.body.message).to.eq("Cadastro realizado com sucesso");
      } else if (response.status === 400) {
        expect(response.body.message).to.eq("Já existe produto com esse nome");
      } else {
        throw new Error(`Status inesperado: ${response.status}`);
      }
    })
  })


  it('Cadastrar Produto Com Nome Aleatorio de Usuario', () => {
    let produto = 'Produto EBAC' + Math.floor(Math.random() * 1000000000000)
    let produtoDescricao = 'Descricao de Produto EBAC' + Math.floor(Math.random() * 1000000000000)
    cy.request({
      method: 'POST',
      url: '/produtos',
      headers: {
        authorization: token
      },
      body: {
        nome: produto,
        preco: 30,
        descricao: produtoDescricao,
        quantidade: 10
      }
    }).should((response) => {
      expect(response.status).to.eq(201)
      expect(response.body.message).to.eq("Cadastro realizado com sucesso")
    });
    cy.log("Nome de Produto: " + produto)
    cy.log("Descrição de Produto: " + produtoDescricao)
  })


  it('Não Deve Permitir Cadastro Produto Com Usuario Cadastrado', () => {
    cy.request({
      method: 'POST',
      url: '/produtos',
      failOnStatusCode: false,
      headers: {
        authorization: token
      },
      body: {
        "nome": "Cabo USB",
        "preco": 20,
        "descricao": "Outro cabo com mesmo nome",
        "quantidade": 50
      }
    }).should((response) => {
      expect(response.status).to.eq(400)
      expect(response.body.message).to.eq("Já existe produto com esse nome")
    });
  })


  it('Cadastrar Produto - POST Sem Token', () => {
    cy.request({
      method: 'POST',
      url: '/produtos',
      failOnStatusCode: false,
      body: {
        "nome": "Cabo USB",
        "preco": 15,
        "descricao": "Cabo USB do tipo C",
        "quantidade": 100
      }
    }).should((response) => {
      expect(response.status).equal(401)
      expect(response.body.message).to.eq('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
    })
  })

  it('Cadastrar Produto com commands - POST Com Token', () => {
    let produto = 'Novo Produto EBAC' + Math.floor(Math.random() * 1000000000000)
    cy.CadastrarProduto(token, produto, 15, 'Cabo USB C', 99)
      .should((response) => {
        expect(response.status).equal(201)
      })
  })


  it('Deve Editar Um Produto Escolhido Com Sucesso', () => {
    let produto = 'Produto EBAC Editado' + Math.floor(Math.random() * 1000000000000)
    cy.CadastrarProduto(token, produto, 15, 'Produto EBAC Editado', 99)
      .then(response => {
        let id = response.body._id

        cy.request({
          method: 'PUT',
          url: `produtos/${id}`,
          headers: { authorization: token },
          body: {
            "nome": produto,
            "preco": 500,
            "descricao": "Produto editado",
            "quantidade": 100
          }
        }).should(response => {
          expect(response.body.message).to.equal('Registro alterado com sucesso')
          expect(response.status).to.equal(200)
        })
      })
  })

  it('Deve Deletar Um Produto Escolhido Com Sucesso', () => {
    let produto = 'Produto EBAC a ser deletado' + Math.floor(Math.random() * 1000000000000)
    cy.CadastrarProduto(token, produto, 15, 'Produto EBAC a ser deletado', 99)
      .then(response => {
        let id = response.body._id

        cy.request({
          method: 'DELETE',
          url: `produtos/${id}`,
          headers: { authorization: token },
          body: {
            "nome": produto,
            "preco": 500,
            "descricao": "Produto editado",
            "quantidade": 100
          }
        }).should(response => {
          expect(response.body.message).to.equal('Registro excluído com sucesso')
          expect(response.status).to.equal(200)
        })
      })
  })

  it('Deve validar contrato de produtos com sucesso', () => {

    cy.request('produtos').then(response => {
      return contrato.validateAsync(response.body)
    })

  })

})



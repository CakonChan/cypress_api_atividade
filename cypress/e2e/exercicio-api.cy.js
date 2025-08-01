/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contrato'
import { deletarUsuario } from '../support/services/usuario.service'

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {

    cy.request('usuarios').then(response => {
      return contrato.validateAsync(response.body)
    })

  });

  it('Deve listar usuários cadastrados', () => {
        cy.request({
          method: 'GET',
          url: '/usuarios'
        }).should((response) => {
          expect(response.status).equal(200)
          expect(response.body).to.have.property('usuarios')
        })
  });

  it('Deve listar usuários cadastrados com Commando Customizado', () => {
        cy.ListarUsuarios().
        should((response) => {
          expect(response.status).equal(200)
          expect(response.body).to.have.property('usuarios')
        })
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    const email = Math.floor(Math.random() * 1000000000000) + `usuario@ebac.com`;

    cy.CadastrarUsuario("Caio Porto", email, "123456", "true")
      .should(response => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq('Cadastro realizado com sucesso');
      });
  });


  it('Deve cadastrar um usuário com sucesso com fixture então apos sucesso, deletar pra nao repetir erro nas proximas tentativas de teste', () => {

    cy.fixture('usuarios').then((usuarios) => {
      const nome = usuarios[0].nome;
      const email = usuarios[0].email;
      const password = usuarios[0].password;
      const administrador = usuarios[0].administrador;

      cy.CadastrarUsuario(nome, email, password, administrador)
        .then((response) => {

          expect(response.status).to.equal(201);
          expect(response.body.message).to.eq('Cadastro realizado com sucesso');

          const id = response.body._id;


          deletarUsuario(id).then((resDelete) => {
            expect(resDelete.status).to.eq(200);
            expect(resDelete.body.message).to.eq('Registro excluído com sucesso');
          });

        })

    })

  })


  it('Deve validar um usuário com email inválido', () => {
     cy.fixture('usuarios').then((usuarios) => {
      const nome = usuarios[0].nome;
      const email = "email_InvalidoDeProposito";
      const password = usuarios[0].password;
      const administrador = "false";

      cy.CadastrarUsuario(nome, email, password, administrador)
        .then((response) => {
          expect(response.status).to.equal(400);
        })

    })
  });

  it('Deve editar um usuário previamente cadastrado', () => {

    let nome = "Usuario Vai ser Cadastrado Mas Sera Editado Em Breve"
    let email = Math.floor(Math.random() * 1000000000000) + "editadoSucesso@ebac.com"
    let password = "testeEBACSucessoCadastrado"
    let administrador = "false"

    cy.CadastrarUsuario(nome, email, password, administrador)
      .then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body.message).to.eq('Cadastro realizado com sucesso');

        const id = response.body._id

        let nomeEditado = "Usuario Vai ser Editado"
        let emailEditado = Math.floor(Math.random() * 1000000000000) + "editadoSucesso@ebac.com"
        let passwordEditado = "testeEBACSucessoEditado"
        let administradorEditado = "false"

        cy.EditarUsuario(id, nomeEditado, emailEditado, passwordEditado, administradorEditado)
          .then((responseEdicao) => {
            expect(responseEdicao.status).to.eq(200);
            expect(responseEdicao.body.message).to.eq('Registro alterado com sucesso');
          })

      })

  })


  it('Deve deletar um usuário previamente cadastrado', () => {

    let nome = "Usuario Vai ser Cadastrado Mas Sera Deletado Em Breve"
    let email = "deletadoSucesso@ebac.com"
    let password = "testeEBACSucessoDeletado"
    let administrador = "false"

    cy.CadastrarUsuario(nome, email, password, administrador)
      .then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body.message).to.eq('Cadastro realizado com sucesso');

        const id = response.body._id;

        cy.request({
          method: 'DELETE',
          url: `usuarios/${id}`,
          failOnStatusCode: false
        }).should((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.message).to.eq('Registro excluído com sucesso')
        })

      })

  })

  it('Deve criar e deletar usuário com sucesso usando comando customizado', () => {

    const nome = 'Usuário Cadastrado para ser Deletado';
    const email = `testeDelete}@ebac.com`;
    const password = 'senhaDeletad123';
    const administrador = 'false';

    cy.CadastrarUsuario(nome, email, password, administrador)
      .then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body.message).to.eq('Cadastro realizado com sucesso');

        const id = response.body._id;

        cy.DeletarUsuario(id)
          .then((responseDelete) => {
            expect(responseDelete.status).to.eq(200);
            expect(responseDelete.body.message).to.eq('Registro excluído com sucesso');
          })
      })
  })

});









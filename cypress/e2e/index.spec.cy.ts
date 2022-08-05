/// <reference types="cypress" />

import { getByTestId } from "@testing-library/react";

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('metro bus route app', () => {
  // beforeEach(() => {
  // [TODO] For each route we would intercept with mock since bus routes change.
  // cy.intercept('GET', '/activities/*', { fixture: 'activities.json' })
  // cy.intercept('GET', '/activities/*', { fixture: 'activities.json' })
  // cy.intercept('GET', '/activities/*', { fixture: 'activities.json' })
  // cy.intercept('GET', '/activities/*', { fixture: 'activities.json' })
  // })

  it('displays a default page', () => {
    cy.visit('http://localhost:3000')
    cy.screenshot('defaultpage');
  })

  it('can select route', () => {
    cy.wait(2000)
    cy.get('[data-cy="selectRoute"]')
      .click()
      .type('METRO Green Line{enter}')
    cy.wait(2000)
    cy.screenshot('selectRoute');
  })

  it('can select direction', () => {
    cy.wait(2000)
    cy.get('[data-cy="selectDirection"]')
      .click()
      .type('Eastbound{enter}')
    cy.wait(2000)
    cy.screenshot('selectDirection');
  })

  it('can select stop', () => {
    cy.wait(2000)
    cy.get('[data-cy="selectPlace"]')
      .click()
      .type('Government Plaza{enter}')
    cy.wait(2000)
    cy.screenshot('selectPlace');
  })

  it('can display routeTable', () => {
    cy.wait(2000)
    cy.screenshot('routeTable');
  })


})

import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../src/app';

import { Response } from 'superagent';
import TeamsModel from '../src/database/models/TeamsModel';
import { teamsMock } from './mocks/teams.mock';

chai.use(chaiHttp);

const { expect } = chai;

let chaiHttpResponse: Response;

describe('/teams', () => {
  it('getAllTeams', async () => {
    sinon.stub(TeamsModel, 'findAll').resolves(teamsMock as any);
    chaiHttpResponse = await chai.request(app).get('/teams');
    (TeamsModel.findAll as sinon.SinonStub).restore();

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(teamsMock);
  });
  it('getAllTeams <fail>', async () => {
    sinon.stub(TeamsModel, 'findAll').resolves([]);
    chaiHttpResponse = await chai.request(app).get('/teams');
    (TeamsModel.findAll as sinon.SinonStub).restore();

    expect(chaiHttpResponse.status).to.be.equal(404);
    expect(chaiHttpResponse.body.message).to.be.equal('No teams found');
  });
  it('getById - Success', async () => {
    sinon.stub(TeamsModel, 'findByPk').resolves(teamsMock[0] as any);
    chaiHttpResponse = await chai.request(app).get('/teams/1');
    (TeamsModel.findByPk as sinon.SinonStub).restore();

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(teamsMock[0]);
  });
  it('getById - Fail', async () => {
    sinon.stub(TeamsModel, 'findByPk').resolves(null);
    chaiHttpResponse = await chai.request(app).get('/teams/100');
    (TeamsModel.findByPk as sinon.SinonStub).restore();

    expect(chaiHttpResponse.status).to.be.equal(404);
    expect(chaiHttpResponse.body.message).to.be.equal('Team not found');
  });
});

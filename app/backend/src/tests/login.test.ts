import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';
import UsersModel from '../database/models/UsersModel';
import { userBody, userMock } from './mocks/user.mock';

chai.use(chaiHttp);

const { expect } = chai;

let chaiHttpResponse: Response;

describe('/login', () => {
  it('Success', async () => {
    sinon.stub(UsersModel, 'findOne').resolves(userMock);
    chaiHttpResponse = await chai.request(app).post('/login').send(userBody.OK);
    (UsersModel.findOne as sinon.SinonStub).restore();

    const userMockWithoutPassword = {
      id: userMock.id,
      username: userMock.username,
      role: userMock.role,
      email: userMock.email,
    };

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body.user).to.be.deep.equal(
      userMockWithoutPassword,
    );
    expect(chaiHttpResponse.body.token).to.haveOwnProperty;
  });

  it('Wrong <password>', async () => {
    sinon.stub(UsersModel, 'findOne').resolves(userMock);
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send(userBody.wrongPassword);
    (UsersModel.findOne as sinon.SinonStub).restore();

    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body.message).to.be.equal(
      'Incorrect email or password',
    );
  });

  it('Wrong <email>', async () => {
    sinon.stub(UsersModel, 'findOne').resolves(null);
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send(userBody.wrongEmail);
    (UsersModel.findOne as sinon.SinonStub).restore();

    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body.message).to.be.equal(
      'Incorrect email or password',
    );
  });

  it('Undefined <password>', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send(userBody.withoutPassword);

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body.message).to.be.equal(
      'All fields must be filled',
    );
  });

  it('Undefined <email>', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send(userBody.withoutEmail);

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body.message).to.be.equal(
      'All fields must be filled',
    );
  });
  it('/validate', async () => {
    sinon.stub(UsersModel, 'findOne').resolves(userMock);
    const {
      body: { token },
    } = await chai.request(app).post('/login').send(userBody.OK);
    (UsersModel.findOne as sinon.SinonStub).restore();

    chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate')
      .set({ authorization: token });

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.equal('King of hell');
  });
  it('/validate - Invalid <token>', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate')
      .set({ authorization: 'tokenInvalido' });

    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body.message).to.be.equal(
      'Expired or invalid token',
    );
  });
});

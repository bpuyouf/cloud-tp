const http = require('http');
const { app, pool } = require('./app');

let server;
let baseUrl;

beforeAll(done => {
  server = app.listen(0, () => {
    const { port } = server.address();
    baseUrl = `http://127.0.0.1:${port}`;
    done();
  });
});

afterAll(done => {
  server.close(done);
});

function request(path) {
  return new Promise((resolve, reject) => {
    http.get(`${baseUrl}${path}`, res => {
      let body = '';
      res.on('data', chunk => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: JSON.parse(body) });
      });
    }).on('error', reject);
  });
}

describe('/health endpoint', () => {
  test('returns 200 and connected when database query succeeds', async () => {
    const querySpy = jest.spyOn(pool, 'query').mockResolvedValue({ rows: [{ '?column?': 1 }] });

    const response = await request('/health');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: 'ok', database: 'connecte' });

    querySpy.mockRestore();
  });

  test('returns 500 and disconnected when database query fails', async () => {
    const querySpy = jest.spyOn(pool, 'query').mockRejectedValue(new Error('connection failed'));

    const response = await request('/health');

    expect(response.statusCode).toBe(500);
    expect(response.body).toMatchObject({ status: 'error', database: 'disconnected' });
    expect(response.body.error).toBe('connection failed');

    querySpy.mockRestore();
  });
});
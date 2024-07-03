import request from "supertest";

import app from "../src/index";

describe('Testing Endpoint All List Cars', () => {
    test('return http code 200 after hit endpoint', async () => {
        const endpoint = await request(app).get('/api/cars')
        expect(endpoint.status).toBe(200)
    })
})
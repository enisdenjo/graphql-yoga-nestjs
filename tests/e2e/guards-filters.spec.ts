import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { ApplicationModule } from "../code-first/app.module.js";

describe("GraphQL - Guards", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ApplicationModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it(`should throw an error`, async () => {
    const res = await request(app.getHttpServer())
      .post("/graphql")
      .send({
        operationName: null,
        variables: {},
        query: '{\n  recipe(id: "3") {\n    id\n  }\n}\n',
      })
      .expect(200);

    expect(res.body).toEqual({
      errors: [
        {
          message: "Unauthorized error",
          locations: [{ line: 2, column: 3 }],
          path: ["recipe"],
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            exception: {
              response: { statusCode: 401, message: "Unauthorized" },
              status: 401,
              message: "Unauthorized error",
              name: "UnauthorizedException",
              options: {},
            },
          },
        },
      ],
      data: null,
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
